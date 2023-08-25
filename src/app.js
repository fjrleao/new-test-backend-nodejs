import 'express-async-errors'
import express from 'express'
import categoryRoutes from './routes/category.routes'
import productRoutes from './routes/product.routes'
import { AppError } from './errors/AppError'

const app = express()
app.use(express.json())

app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)

app.use((err, req, res, next) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		})
	}

	console.log(err)
	return res.status(500).json({
		message: 'Internal server error',
	})
})

export default app
