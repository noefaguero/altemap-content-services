const Page = require('../database/models/pageModel')

exports.getPageComponents = async (id) => {
    return await Page.findById(id, 'components').lean() 
}