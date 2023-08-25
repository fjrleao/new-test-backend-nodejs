import app from './app'
import 'dotenv/config'
import { DatabaseConfig } from './configs/database'

const PORT = process.env.PORT || 3000

DatabaseConfig.connect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running in port ${PORT}`)
	})
})
