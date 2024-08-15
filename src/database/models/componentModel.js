const { Schema, model, SchemaTypes } = require('mongoose')

// definicion del esquema de contenido, se utilizara para construir el formulario y validacion de sus elementos
const contentSchemaSchema = new Schema({ 
    name: {
        type: SchemaTypes.String,
        required: [true, 'El nombre del campo en la especificacion del esquema de contenido es necesario']
    },
    type: { // input type
        type: SchemaTypes.String,
        enum: {
            values: ['text', 'date', 'number', 'textarea', 'url'],
            message: props => `No se aceptan los medios de tipo ${props.value}`
        },
        required: [true, 'Es necesario especificar el tipo del campo']
    },
    validations: { 
        type: SchemaTypes.Array, // atributos html de validacion ['min="10"', 'max="50"'] => se usara join(' ') en cliente y split('=') en servidor
        default: []
    }
}, { _id: false })

const changelogSchema = new Schema({
    externalUserId: {
        type: SchemaTypes.String, 
        required: [true, 'El identificador del usuario es necesario'],
    },
    action: {
        type: SchemaTypes.String, // accion#usuario
    },
    createdAt: { 
        type: SchemaTypes.Date,
        default: Date.now 
    }
}, { _id: false })


const componentSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    content_fields: [contentSchemaSchema], // se utilizara para construir el contenido de un elemento
    is_abstract: { 
        type: SchemaTypes.Boolean, // true si no existe un componente como tal, se usan sus datos para construir diferentes componentes
        default: false
    },
    is_hidden: {
        type: SchemaTypes.Boolean,
        default: false
    },
    unique_element: {
        type: SchemaTypes.Boolean,
        default: false
    },
    elements: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Element',
            default: []
        }],
    },
    media: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Media',
            default: []
        }]
    },
    changelog: [changelogSchema]
}, {
    timestamps: true
})

const Component = model('Component', componentSchema)

module.exports = Component