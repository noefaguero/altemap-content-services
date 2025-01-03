exports.handleNotFound = (result, errorMessage) => {
	if (!result) {
		const error = new Error(errorMessage)
		error.status = 404
		throw error
	}
	return result
}