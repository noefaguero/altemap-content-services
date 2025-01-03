const Media = require('../database/models/mediaModel')
const mongoose = require('mongoose')


exports.getMedia = async (ids) => {
    try {
        return await Media.find({ _id: { $in: ids } }).lean()
    } catch (error) {
        throw error
    }
}


exports.postMedia = async (data) => {
    try {
        return await mongoose.connection.transaction(
            async () => await Media.insertMany(data)
        )

    } catch (error) {
        throw error
    }
}


// TO-DO: añadir opcion en frontend para usarla en los archivos no usados (sin pasar component)
exports.deleteMedia = async (ids) => {
    try {
        return await mongoose.connection.transaction(
            async () =>  await Media.deleteMany({ _id: { $in: ids } })
        )

    } catch (error) {
        throw error
    }
}