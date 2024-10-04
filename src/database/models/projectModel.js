const { Schema, model, SchemaTypes } = require('mongoose')
const Component = require('./componentModel')

const projectSchema = new Schema({
    _id: {
        type: SchemaTypes.ObjectId,
        auto: false // se proporciona desde la BD altemap-users
    },
    name: {
        type: SchemaTypes.String,
        required: true
    },
    pages: {
        type: SchemaTypes.String,
        required: true
    },
    components: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: Component
        }]
    },
    metrics: {
        requests: { type: Schema.Types.Number },
        media: {
            files: { type: Schema.Types.Number },
            total_kb: { type: Schema.Types.Number }
        }
    }
}, {
    timestamps: true
})

const Project = model('Project', projectSchema)


module.exports = Project