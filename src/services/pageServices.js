const Page = require('../database/models/pageModel')


exports.getPageComponents = async (id) => {
    try {
        return await Page.findById(id, 'components').lean()
    } catch (error) {
        throw error
    }
}