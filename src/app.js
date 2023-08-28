import 'express-async-errors'
import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import { AppError } from './errors/AppError'
import { ZodError } from 'zod'
import categoryRoutes from './routes/category.routes'
import productRoutes from './routes/product.routes'
import catalogRoutes from './routes/catalog.routes'

const app = express()
app.use(express.json())

app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)
app.use('/catalog', catalogRoutes)

app.use(
	expressWinston.errorLogger({
		transports: [
			new winston.transports.File({
				filename: 'error-logs.json',
			}),
		],
		format: winston.format.combine(winston.format.json()),
	})
)

app.use((err, req, res, next) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		})
	}

	if (err instanceof ZodError) {
		return res.status(400).json({
			message: err.flatten().fieldErrors,
		})
	}

	if (err.code === 'NoSuchKey') {
		return res.status(404).json({
			message: 'Data not found',
		})
	}

	console.log(err)
	return res.status(500).json({
		message: 'Internal server error',
	})
})

export default app
