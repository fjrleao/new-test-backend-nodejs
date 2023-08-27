import { S3 } from 'aws-sdk'
import 'dotenv/config'

export class AWSS3 {
	#s3

	constructor() {
		this.#s3 = new S3({
			apiVersion: '2006-03-01',
			region: process.env.AWS_REGION,
		})
	}

	async uploadS3JSONFile(fileName, fileContent) {
		await this.#s3
			.upload({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: fileName,
				Body: Buffer.from(JSON.stringify(fileContent)),
			})
			.promise()
	}
}
