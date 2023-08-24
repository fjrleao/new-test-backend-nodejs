import { AppError } from '../errors/AppError'

export class CategoryService {
	#db

	constructor(db) {
		this.#db = db
	}

	async add(categoryData) {
		const categories = this.#db.collection('categories')

		const categoryAlreadyExists = await categories.findOne({
			title: categoryData.title,
		})

		if (categoryAlreadyExists) {
			throw new AppError('Category already exists', 409)
		}

		const newCategory = await categories.insertOne(categoryData)
		const findCategory = await categories.findOne(newCategory.insertedId)
		return findCategory
	}
}
