import { MongoClient } from 'mongodb'
import { AppError } from '../../errors/AppError'
import { ProductService } from '../../services/product.service'

describe('Testing products service', () => {
	let connection
	let db

	beforeAll(async () => {
		connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db(globalThis.__MONGO_DB_NAME__)
		await db.collection('categories').insertOne({
			title: 'valid_category',
			description: 'valid_description',
		})
	})

	afterEach(async () => {
		await db.collection('products').deleteMany({})
	})

	afterAll(async () => {
		await connection.close()
	})

	const makeSut = () => {
		return new ProductService(db)
	}

	describe('Testing create product', () => {
		test('Should return product data on success', async () => {
			const sut = makeSut()
			const product = await sut.add({
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})
			expect(product.title).toBe('valid_title')
			expect(product.owner).toBe('valid_owner')
			expect(product.description).toBe('valid_description')
			expect(product.price).toBe(100.5)
			expect(product.category).toBe('valid_category')
		})

		test('Should save a product on database', async () => {
			const sut = makeSut()
			const product = await sut.add({
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})
			const databaseProduct = db.collection('products')
			const insertedProduct = await databaseProduct.findOne({
				title: 'valid_title',
			})
			expect(product._id).toBeTruthy()
			expect(insertedProduct.title).toBe('valid_title')
			expect(insertedProduct.owner).toBe('valid_owner')
			expect(insertedProduct.description).toBe('valid_description')
			expect(insertedProduct.price).toBe(100.5)
			expect(insertedProduct.category).toBe('valid_category')
		})

		test('Should add same name product if owner is diferent ', async () => {
			const sut = makeSut()
			const databaseProduct = db.collection('products')
			await databaseProduct.insertOne({
				title: 'exists_title',
				owner: 'exists_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})
			const product = await sut.add({
				title: 'exists_title',
				owner: 'other_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})
			expect(product._id).toBeTruthy()
			expect(product.title).toBe('exists_title')
			expect(product.owner).toBe('other_owner')
			expect(product.description).toBe('valid_description')
			expect(product.price).toBe(100.5)
			expect(product.category).toBe('valid_category')
		})

		test('Should throw an AppError when a product already exists to an owner', async () => {
			const sut = makeSut()
			const productData = {
				title: 'exists_title',
				owner: 'exists_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			}
			const databaseProduct = db.collection('products')
			await databaseProduct.insertOne(productData)
			await expect(sut.add(productData)).rejects.toThrow(AppError)
		})

		test('Should throw an AppError when a category does not exists', async () => {
			const sut = makeSut()
			const productData = {
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'invalid_category',
				price: 100.5,
				description: 'valid_description',
			}
			await expect(sut.add(productData)).rejects.toThrow(AppError)
		})
	})

	describe('Testing update product', () => {
		test('Should return product data on success', async () => {
			const sut = makeSut()
			const collectionProduct = db.collection('products')
			const insertedProduct = await collectionProduct.insertOne({
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})

			const product = await sut.update(
				{
					title: 'updated_title',
					owner: 'updated_owner',
					price: 10,
					description: 'updated_description',
				},
				insertedProduct.insertedId
			)
			expect(product._id).toStrictEqual(insertedProduct.insertedId)
			expect(product.title).toBe('updated_title')
			expect(product.owner).toBe('updated_owner')
			expect(product.description).toBe('updated_description')
			expect(product.price).toBe(10)
		})

		test('Should throw an AppError when id does not exists', async () => {
			const sut = makeSut()
			await expect(
				sut.update(
					{
						title: 'updated_title',
						owner: 'updated_owner',
						price: 10,
						description: 'updated_description',
					},
					123
				)
			).rejects.toThrow(AppError)
		})

		test('Should throw an AppError when a category does not exists', async () => {
			const sut = makeSut()
			const collectionProduct = db.collection('products')
			const insertedProduct = await collectionProduct.insertOne({
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})

			await expect(
				sut.update(
					{
						title: 'updated_title',
						owner: 'updated_owner',
						category: 'invalid_category',
						price: 10,
						description: 'updated_description',
					},
					insertedProduct.insertedId
				)
			).rejects.toThrow(AppError)
		})
	})

	describe('Testing delete product', () => {
		test('Should remove a product from database', async () => {
			const sut = makeSut()
			const collectionProduct = db.collection('products')
			const insertedProduct = await collectionProduct.insertOne({
				title: 'valid_title',
				owner: 'valid_owner',
				category: 'valid_category',
				price: 100.5,
				description: 'valid_description',
			})

			await sut.delete(insertedProduct.insertedId)
			const findProduct = await collectionProduct.findOne({
				_id: insertedProduct.insertedId,
			})
			expect(findProduct).toBeNull()
		})

		test('Should throw an AppError when id does not exists', async () => {
			const sut = makeSut()
			await expect(sut.delete(123)).rejects.toThrow(AppError)
		})
	})
})
