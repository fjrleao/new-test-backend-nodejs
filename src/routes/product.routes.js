import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'
import { ensureSchemaIsValid } from '../middlewares/ensureSchemaIsValid.middleware'
import {
	createProductSchema,
	updateProductSchema,
} from '../schemas/product.schemas'

const productRoutes = Router()
const productController = new ProductController()

productRoutes.post('', ensureSchemaIsValid(createProductSchema), (req, res) =>
	productController.create(req, res)
)
productRoutes.patch(
	'/:id',
	ensureSchemaIsValid(updateProductSchema),
	(req, res) => productController.update(req, res)
)
productRoutes.delete('/:id', (req, res) => productController.delete(req, res))

export default productRoutes
