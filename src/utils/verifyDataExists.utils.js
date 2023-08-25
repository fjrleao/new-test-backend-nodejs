import { ObjectId } from 'mongodb'

export async function verifyDataExists(collection, id) {
	const findData = await collection.findOne({
		_id: new ObjectId(id),
	})

	if (!findData) {
		return false
	}

	return true
}
