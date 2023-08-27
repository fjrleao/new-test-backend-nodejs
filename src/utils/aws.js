import { S3 } from 'aws-sdk'
import 'dotenv/config'

export class AWS {
	async uploadS3JSONFile(fileName, fileContent) {
		const s3 = new S3({
			apiVersion: '2006-03-01',
			region: process.env.AWS_REGION,
		})

		await s3
			.upload({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: fileName,
				Body: Buffer.from(JSON.stringify(fileContent)),
			})
			.promise()
	}
}
