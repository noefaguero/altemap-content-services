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
    console.log(error)
    throw error

  } finally {
    session.endSession()
  }
}