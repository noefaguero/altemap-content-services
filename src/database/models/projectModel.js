const { Schema, model, SchemaTypes } = require('mongoose')

const projectSchema = new Schema({
    externalId: {
      type: String, // cadena de objectId en la base de datos altemap_users
      required: true
    },
    pages: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Page',
            default: []
        }]
    }
}, {
    timestamps: true
})

const Project = model('Project', projectSchema)

module.exports = Project