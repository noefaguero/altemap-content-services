const { Schema, model, SchemaTypes } = require('mongoose')

const projectSchema = new Schema({
    _id: {
        type: SchemaTypes.ObjectId,
        auto: false // se proporciona desde la BD altemap-users
    },
    name: {
        type: SchemaTypes.String,
        required: true
    },
    components: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Component'
        }]
    },
    media: {
		type: [{
            type: SchemaTypes.ObjectId, 
			ref: 'Media'
        }],
    },
    component_media: { // relación componente-medios
        type: SchemaTypes.Map,
        of: [{
            type: SchemaTypes.ObjectId,
            ref: 'Media'
        }],
    },
    metrics: {
        requests: { type: Schema.Types.Number },
        media: {
            total_files: { type: Schema.Types.Number },
            total_kb: { type: Schema.Types.Number } // en kb con dos decimales
        }
    }
}, {
    timestamps: true
})

const Project = model('Project', projectSchema)

module.exports = Project