import { ObjectId } from 'mongodb'
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
			owner: categoryData.owner,
		})

		if (categoryAlreadyExists) {
			throw new AppError('Category already exists', 409)
		}

		await categories.insertOne(categoryData)
		return categoryData
	}

	async update(categoryData, categoryId) {
		const categories = this.#db.collection('categories')

		const categoryExists = await verifyDataExists(categories, categoryId)

		if (!categoryExists) {
			throw new AppError('Category does not exists', 404)
		}

		await categories.updateOne(
			{
				_id: new ObjectId(categoryId),
			},
			{
				$set: { ...categoryData },
			}
		)

		const updatedCategory = await categories.findOne({
			_id: new ObjectId(categoryId),
		})

		return updatedCategory
	}

	async delete(categoryId) {
		const categories = this.#db.collection('categories')

		const categoryExists = await verifyDataExists(categories, categoryId)

		if (!categoryExists) {
			throw new AppError('Category does not exists', 404)
		}

		await categories.deleteOne({ _id: new ObjectId(categoryId) })
	}
}
