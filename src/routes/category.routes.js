import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'
import { ensureSchemaIsValid } from '../middlewares/ensureSchemaIsValid.middleware'
import {
	createCategorySchema,
	updateCategorySchema,
} from '../schemas/category.schemas'

const categoryRoutes = Router()
const categoryController = new CategoryController()

categoryRoutes.post('', ensureSchemaIsValid(createCategorySchema), (req, res) =>
	categoryController.create(req, res)
)
categoryRoutes.patch(
	'/:id',
	ensureSchemaIsValid(updateCategorySchema),
	(req, res) => categoryController.update(req, res)
)
categoryRoutes.delete('/:id', (req, res) => categoryController.delete(req, res))

export default categoryRoutes
