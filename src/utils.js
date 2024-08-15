const mongoose = require('mongoose')

exports.transaction = async (operations) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    for (const operation of operations) {
      await operation()
    }
    await session.commitTransaction()
    return true

  } catch (error) {
    await session.abortTransaction() //rollback
    return false

  } finally {
    session.endSession()
  }
}