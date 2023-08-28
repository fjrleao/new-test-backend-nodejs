import app from './app'
import 'dotenv/config'
import { DatabaseConfig } from './configs/database'
import { Consumer } from 'sqs-consumer'
import { CatalogService } from './services/catalog.service'

const PORT = process.env.PORT || 3000

DatabaseConfig.connect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running in port ${PORT}`)
		const consumer = Consumer.create({
			queueUrl: process.env.AWS_SQS_URL,
			handleMessage: async (message) => {
				const catalogService = new CatalogService(DatabaseConfig.getDatabase())
				await catalogService.generateCatalogAndUploadToS3(
					JSON.parse(message.Body).owner
				)
			},
		})
		consumer.on('error', (err) => {
			console.log(err)
		})
		consumer.on('processing_error', (err) => {
			console.error(err.message)
		})

		consumer.start()
	})
})
