import { S3, SQS } from 'aws-sdk'
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

	async getContentS3JSONFile(fileName) {
		const data = await this.#s3
			.getObject({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: fileName,
			})
			.promise()
		return JSON.parse(data.Body)
	}
}

export class AWSSQS {
	#sqs

	constructor() {
		this.#sqs = new SQS({
			apiVersion: '2012-11-05',
			region: process.env.AWS_REGION,
		})
	}

	async sendJSONMessage(data) {
		await this.#sqs
			.sendMessage({
				MessageBody: JSON.stringify(data),
				QueueUrl: process.env.AWS_SQS_URL,
			})
			.promise()
	}
}
