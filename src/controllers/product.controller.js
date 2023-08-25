import { DatabaseConfig } from '../configs/database'
import { ProductService } from '../services/product.service'

export class ProductController {
	async create(req, res) {
		const productService = new ProductService(DatabaseConfig.getDatabase())
		const newProduct = await productService.add(req.body)
		return res.status(201).json(newProduct)
	}

	async update(req, res) {
		const productService = new ProductService(DatabaseConfig.getDatabase())
		const updatedProduct = await productService.update(req.body, req.params.id)
		return res.status(200).json(updatedProduct)
	}

	async delete(req, res) {
		const productService = new ProductService(DatabaseConfig.getDatabase())
		await productService.delete(req.params.id)
		return res.status(204).send()
	}
}
