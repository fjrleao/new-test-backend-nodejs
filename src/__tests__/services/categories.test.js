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

		test('Should throw an AppError when a category already exists', async () => {
			const sut = makeSut()
			const categoryData = {
				title: 'exists_title',
				owner: 'correct_owner',
				description: 'correct_description',
			}
			const databaseCategory = db.collection('categories')
			await databaseCategory.insertOne(categoryData)
			await expect(sut.add(categoryData)).rejects.toThrow(AppError)
		})
	})
})
