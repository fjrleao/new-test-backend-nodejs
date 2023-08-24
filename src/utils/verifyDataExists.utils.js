import { AppError } from '../errors/AppError'

export async function verifyDataExists(collection, id) {
	const findData = await collection.findOne({
		_id: id,
	})

	if (!findData) {
		throw new AppError('Id not found', 404)
	}
}
