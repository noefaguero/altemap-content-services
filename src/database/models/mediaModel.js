const { Schema, model, SchemaTypes } = require('mongoose')

const mediaSchema = new Schema({
    name: {
        type: SchemaTypes.String, // panda.jpg
        required: [true, 'El nombre del archivo es necesario'],
        unique: true
    },
    content_type: {
        type: SchemaTypes.String, 
        enum: {
            values: ['imagen', 'pdf'],
            message: props => `No se aceptan los medios de tipo ${props.value}`
        },
        required: [true, 'Es necesario especificar el tipo de medio']
    },
    size: {
        type: SchemaTypes.Number, // en kb
        required: [true, 'El tamaño del archivo es necesario']
    },
    externalUserId: {
        type: SchemaTypes.String, 
        required: [true, 'El identificador del usuario es necesario'],
    },
    createdAt: { 
        type: SchemaTypes.Date,
        default: Date.now 
    }
}, {
    timestamps: true
})

const Media = model('Media', mediaSchema)

module.exports = Media