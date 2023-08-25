import { MongoClient } from 'mongodb'
import { CategoryService } from '../../services/category.service'
import { AppError } from '../../errors/AppError'

describe('Testing categories service', () => {
	let connection
	let db

	beforeAll(async () => {
		connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db(globalThis.__MONGO_DB_NAME__)
	})

	afterEach(async () => {
		await db.collection('categories').deleteMany({})
	})

	afterAll(async () => {
		await connection.close()
	})

	const makeSut = () => {
		return new CategoryService(db)
	}

	describe('Testing create category', () => {
		test('Should return category data on success', async () => {
			const sut = makeSut()
			const category = await sut.add({
				title: 'correct_title',
				owner: 'correct_owner',
				description: 'correct_description',
			})
			expect(category.title).toBe('correct_title')
			expect(category.owner).toBe('correct_owner')
			expect(category.description).toBe('correct_description')
		})

		test('Should save a category on database', async () => {
			const sut = makeSut()
			const category = await sut.add({
				title: 'correct_title',
				owner: 'correct_owner',
				description: 'correct_description',
			})
			const databaseCategory = db.collection('categories')
			const insertedCategory = await databaseCategory.findOne({
				title: 'correct_title',
			})
			expect(category._id).toBeTruthy()
			expect(insertedCategory.title).toBe('correct_title')
			expect(insertedCategory.owner).toBe('correct_owner')
			expect(insertedCategory.description).toBe('correct_description')
		})

		test('Should add same name category if owner is diferent ', async () => {
			const sut = makeSut()
			const databaseCategory = db.collection('categories')
			await databaseCategory.insertOne({
				title: 'exists_title',
				owner: 'exists_owner',
				description: 'correct_description',
			})
			const category = await sut.add({
				title: 'exists_title',
				owner: 'other_owner',
				description: 'correct_description',
			})
			expect(category._id).toBeTruthy()
			expect(category.title).toBe('exists_title')
			expect(category.owner).toBe('other_owner')
			expect(category.description).toBe('correct_description')
		})

		test('Should throw an AppError when a category already exists to an owner', async () => {
			const sut = makeSut()
			const categoryData = {
				title: 'exists_title',
				owner: 'exists_owner',
				description: 'correct_description',
			}
			const databaseCategory = db.collection('categories')
			await databaseCategory.insertOne(categoryData)
			await expect(sut.add(categoryData)).rejects.toThrow(AppError)
		})
	})

	describe('Testing update category', () => {
		test('Should return category data on success', async () => {
			const sut = makeSut()
			const collectionCategory = db.collection('categories')
			const insertedCategory = await collectionCategory.insertOne({
				title: 'valid_title',
				owner: 'valid_owner',
				description: 'valid_description',
			})

			const category = await sut.update(
				{
					title: 'updated_title',
					owner: 'updated_owner',
					description: 'updated_description',
				},
				insertedCategory.insertedId
			)
			expect(category._id).toStrictEqual(insertedCategory.insertedId)
			expect(category.title).toBe('updated_title')
			expect(category.owner).toBe('updated_owner')
			expect(category.description).toBe('updated_description')
		})

		test('Should throw an AppError when id does not exists', async () => {
			const sut = makeSut()
			await expect(
				sut.update(
					{
						title: 'updated_title',
						owner: 'updated_owner',
						description: 'updated_description',
					},
					'id_invalid'
				)
			).rejects.toThrow(AppError)
		})
	})

	describe('Testing delete category', () => {
		test('Should remove a category from database', async () => {
			const sut = makeSut()
			const collectionCategory = db.collection('categories')
			const insertedCategory = await collectionCategory.insertOne({
				title: 'valid_title',
				owner: 'valid_owner',
				description: 'valid_description',
			})

			await sut.delete(insertedCategory.insertedId)
			const findCategory = await collectionCategory.findOne({
				_id: insertedCategory.insertedId,
			})
			expect(findCategory).toBeNull()
		})

		test('Should throw an AppError when id does not exists', async () => {
			const sut = makeSut()
			await expect(sut.delete('id_invalid')).rejects.toThrow(AppError)
		})
	})
})
