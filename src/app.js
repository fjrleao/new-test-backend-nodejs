import express from 'express'
import categoryRoutes from './routes/category.routes'
import productRoutes from './routes/product.routes'

const app = express()
app.use(express.json())

app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)

export default app
