import { AppError } from '../errors/AppError'
import { verifyDataExists } from '../utils/verifyDataExists.utils'

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

		await verifyDataExists(categories, categoryId)

		await categories.updateOne(
			{
				_id: categoryId,
			},
			{
				$set: { ...categoryData },
			}
		)

		const updatedCategory = await categories.findOne({ _id: categoryId })

		return updatedCategory
	}
}
