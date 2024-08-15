const { Schema, model, SchemaTypes } = require('mongoose')

const projectSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    pages: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Page'
        }]
    },
    components: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Component'
        }]
    },
    media: { // los componentes pueden compartir archivos
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Media',
            default: []
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