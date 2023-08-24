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

		await categories.insertOne(categoryData)
		return categoryData
	}

	async update(categoryData, categoryId) {
		const categories = this.#db.collection('categories')

		await categories.updateOne(
			{
				_id: categoryId,
			},
			{
				$set: { categoryData },
			}
		)

		return categoryData
	}
}
