import { MongoClient } from 'mongodb'
import { AppError } from '../../errors/AppError'
import { ProductService } from '../../services/product.service'

describe('Testing categories service', () => {
	let connection
	let db

	beforeAll(async () => {
		connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db(globalThis.__MONGO_DB_NAME__)
		await db.collection('categories').insertOne({
			title: 'correct_category',
			description: 'correct_description',
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
				title: 'correct_title',
				owner: 'correct_owner',
				category: 'correct_category',
				price: 100.5,
				description: 'correct_description',
			})
			expect(product.title).toBe('correct_title')
			expect(product.owner).toBe('correct_owner')
			expect(product.description).toBe('correct_description')
			expect(product.price).toBe(100.5)
			expect(product.category).toBe('correct_category')
		})

		test('Should save a product on database', async () => {
			const sut = makeSut()
			const product = await sut.add({
				title: 'correct_title',
				owner: 'correct_owner',
				category: 'correct_category',
				price: 100.5,
				description: 'correct_description',
			})
			const databaseProduct = db.collection('products')
			const insertedProduct = await databaseProduct.findOne({
				title: 'correct_title',
			})
			expect(product._id).toBeTruthy()
			expect(insertedProduct.title).toBe('correct_title')
			expect(insertedProduct.owner).toBe('correct_owner')
			expect(insertedProduct.description).toBe('correct_description')
			expect(insertedProduct.price).toBe(100.5)
			expect(insertedProduct.category).toBe('correct_category')
		})

		test('Should add same name product if owner is diferent ', async () => {
			const sut = makeSut()
			const databaseProduct = db.collection('products')
			await databaseProduct.insertOne({
				title: 'exists_title',
				owner: 'exists_owner',
				category: 'correct_category',
				price: 100.5,
				description: 'correct_description',
			})
			const product = await sut.add({
				title: 'exists_title',
				owner: 'other_owner',
				category: 'correct_category',
				price: 100.5,
				description: 'correct_description',
			})
			expect(product._id).toBeTruthy()
			expect(product.title).toBe('exists_title')
			expect(product.owner).toBe('other_owner')
			expect(product.description).toBe('correct_description')
			expect(product.price).toBe(100.5)
			expect(product.category).toBe('correct_category')
		})

		test('Should throw an AppError when a product already exists to an owner', async () => {
			const sut = makeSut()
			const productData = {
				title: 'exists_title',
				owner: 'exists_owner',
				category: 'correct_category',
				price: 100.5,
				description: 'correct_description',
			}
			const databaseProduct = db.collection('products')
			await databaseProduct.insertOne(productData)
			await expect(sut.add(productData)).rejects.toThrow(AppError)
		})

		test('Should throw an AppError when a category does not exists', async () => {
			const sut = makeSut()
			const productData = {
				title: 'correct_title',
				owner: 'correct_owner',
				category: 'incorrect_category',
				price: 100.5,
				description: 'correct_description',
			}
			await expect(sut.add(productData)).rejects.toThrow(AppError)
		})
	})
})
