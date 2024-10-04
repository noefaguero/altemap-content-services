const mongoose = require('mongoose')

exports.transaction = async (operations) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {

		let response
		for (const operation of operations) {
			response = await operation()
		}
		await session.commitTransaction()
		return response

	} catch (error) {
		await session.abortTransaction() //rollback
		console.error(error)
		throw error

	} finally {
		session.endSession()
	}
}

exports.handleNotFound = (result, errorMessage) => {
	if (!result) {
		const error = new Error(errorMessage)
		error.status = 404
		throw error
	}
	return result
}