import { DatabaseConfig } from '../configs/database'
import { CategoryService } from '../services/category.service'

export class CategoryController {
	async create(req, res) {
		const categoryService = new CategoryService(DatabaseConfig.getDatabase())
		const newCategory = await categoryService.add(req.body)
		return res.status(201).json(newCategory)
	}

	async update(req, res) {
		const categoryService = new CategoryService(DatabaseConfig.getDatabase())
		const updatedCategory = await categoryService.update(
			req.body,
			req.params.id
		)
		return res.status(200).json(updatedCategory)
	}

	async delete(req, res) {
		const categoryService = new CategoryService(DatabaseConfig.getDatabase())
		await categoryService.delete(req.params.id)
		return res.status(204).send()
	}
}
