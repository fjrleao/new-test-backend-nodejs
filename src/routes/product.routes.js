import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'

const productRoutes = Router()
const productController = new ProductController()

productRoutes.post('', (req, res) => productController.create(req, res))
productRoutes.patch('/:id', (req, res) => productController.update(req, res))
productRoutes.delete('/:id', (req, res) => productController.delete(req, res))

export default productRoutes
