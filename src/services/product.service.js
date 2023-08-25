import { ObjectId } from 'mongodb'
import { AppError } from '../errors/AppError'
import { verifyDataExists } from '../utils/verifyDataExists.utils'

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

	async update(productData, productId) {
		const products = this.#db.collection('products')
		const categories = this.#db.collection('categories')

		const productExists = await verifyDataExists(products, productId)

		if (!productExists) {
			throw new AppError('Product does not exists', 404)
		}

		await products.updateOne(
			{
				_id: new ObjectId(productId),
			},
			{
				$set: { ...productData },
			}
		)

		if (productData.category) {
			const categoryExists = await categories.findOne({
				title: productData.category,
			})

			if (!categoryExists) {
				throw new AppError(
					'Category does not exists. Verify the submitted title or create a new category.',
					404
				)
			}
		}

		const updatedProduct = await products.findOne({
			_id: new ObjectId(productId),
		})

		return updatedProduct
	}

	async delete(productId) {
		const products = this.#db.collection('products')

		const productExists = await verifyDataExists(products, productId)

		if (!productExists) {
			throw new AppError('Product does not exists', 404)
		}

		await products.deleteOne({ _id: new ObjectId(productId) })
	}
}
