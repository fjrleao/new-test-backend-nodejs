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

	test('Should throw an AppError when id does not exists', async () => {
		const category = db.collection('categories')
		await expect(verifyDataExists(category, '123123123')).rejects.toThrow(
			AppError
		)
	})
})
