import { ObjectId } from 'mongodb'
import { AppError } from '../errors/AppError'
import { verifyDataExists } from '../utils/verifyDataExists.utils'
import { CatalogService } from './catalog.service'
import { AWSSQS } from '../utils/aws'

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

		const awsSQS = new AWSSQS()
		await awsSQS.sendJSONMessage({ owner: productData.owner })

		return productData
	}

	async update(productData, productId) {
		const products = this.#db.collection('products')
		const categories = this.#db.collection('categories')

		const productExists = await verifyDataExists(products, productId)

		if (!productExists) {
			throw new AppError('Product does not exists', 404)
		}

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

		if (productData.title) {
			const productExists = await products.findOne({
				title: productData.title,
			})

			if (productExists) {
				throw new AppError('Product already exists', 409)
			}
		}

		delete productData['owner']

		await products.updateOne(
			{
				_id: new ObjectId(productId),
			},
			{
				$set: { ...productData },
			}
		)

		const updatedProduct = await products.findOne({
			_id: new ObjectId(productId),
		})

		const awsSQS = new AWSSQS()
		await awsSQS.sendJSONMessage({ owner: updatedProduct.owner })

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
