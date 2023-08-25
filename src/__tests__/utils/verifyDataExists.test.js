import { MongoClient } from 'mongodb'
import { CategoryService } from '../../services/category.service'
import { AppError } from '../../errors/AppError'
import { verifyDataExists } from '../../utils/verifyDataExists.utils'

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

	test('Should return true when category exists', async () => {
		const category = db.collection('categories')
		const inesrtedCategory = await category.insertOne({
			title: 'valid_title',
			description: 'valid_description',
		})
		const dataExists = await verifyDataExists(
			category,
			inesrtedCategory.insertedId
		)
		expect(dataExists).toBe(true)
	})

	test('Should return false when category does not exists', async () => {
		const category = db.collection('categories')
		const dataExists = await verifyDataExists(category, 123)
		expect(dataExists).toBe(false)
	})
})
