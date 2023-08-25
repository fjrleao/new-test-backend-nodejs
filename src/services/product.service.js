import { AppError } from '../errors/AppError'

export class ProductService {
	#db

	constructor(db) {
		this.#db = db
	}

	async add(productData) {
		const products = this.#db.collection('products')
		const categories = this.#db.collection('categories')

		const productAlreadyExists = await products.findOne({
			title: productData.title,
			owner: productData.owner,
		})

		if (productAlreadyExists) {
			throw new AppError('Product already exists', 409)
		}

		const categoryExists = await categories.findOne({
			title: productData.category,
		})

		if (!categoryExists) {
			throw new AppError(
				'Category does not exists. Verify the submitted title or create a new category.',
				404
			)
		}

		await products.insertOne(productData)
		return productData
	}
}
