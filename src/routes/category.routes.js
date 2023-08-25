import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'

const categoryRoutes = Router()
const categoryController = new CategoryController()

categoryRoutes.post('', (req, res) => categoryController.create(req, res))
categoryRoutes.patch('/:id', (req, res) => categoryController.update(req, res))
categoryRoutes.delete('/:id', (req, res) => categoryController.delete(req, res))

export default categoryRoutes
