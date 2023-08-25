import { MongoClient } from 'mongodb'
import 'dotenv/config'

export class DatabaseConfig {
	static #conn

	static async connect() {
		const MONGODB_URL = process.env.MONGODB_URL

		if (!MONGODB_URL) {
			throw new Error('Insert MONGODB_URL in .env file to start server')
		}

		const client = new MongoClient(MONGODB_URL)

		this.#conn = await client.connect()
	}

	static getConnection() {
		return this.#conn
	}
}
