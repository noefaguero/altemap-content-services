const { Schema, model, SchemaTypes } = require('mongoose')

const pageSchema = new Schema({
    url: {
      type: String,
      matches: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/, 'La URL no es válida'],
      required: true
    },
    components: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Component',
            default: []
        }]
    }
})

const Page = model('Page', pageSchema)

module.exports = Page