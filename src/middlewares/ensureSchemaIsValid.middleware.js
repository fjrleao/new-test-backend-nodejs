export const ensureSchemaIsValid = (schema) => (req, res, next) => {
	req.body = schema.parse(req.body)
	return next()
}
