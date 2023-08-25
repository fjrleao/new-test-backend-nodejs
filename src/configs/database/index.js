import { MongoClient } from 'mongodb'
import 'dotenv/config'

export class DatabaseConfig {
	static #db

	static async connect() {
		const MONGODB_URL = process.env.MONGODB_URL

		if (!MONGODB_URL) {
			throw new Error('Insert MONGODB_URL in .env file to start server')
		}

		const client = new MongoClient(MONGODB_URL)

		const conn = await client.connect()
		this.#db = conn.db('database')
	}

	static getDatabase() {
		return this.#db
	}
}
