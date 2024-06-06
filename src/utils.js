// MUTACIONES EN DOCUMENTOS CON DEPENDENCIA
exports.transaction = async (operations) => {
    const session = await startSession()
    session.startTransaction()
    
    try {
      operations.forEach(async operation => await operation())
      return true

    } catch (error) {
      await session.abortTransaction()
      return false

    } finally {
      session.endSession()
    }
}
