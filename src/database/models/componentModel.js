const { Schema, model, SchemaTypes } = require('mongoose')

// definicion del esquema de los campos de contenido, se utilizara para construir el formulario y validacion de sus elementos
const contentFieldsSchema = new Schema({ 
    key: { // nombre del campo
        type: SchemaTypes.String,
        unique: true,
        required: [true, 'El nombre del campo en el esquema de contenido es necesario']
    },
    col_span: { // porciones que ocupara la columna en la tabla de gestión
        type: SchemaTypes.Number, 
        required: true,
    },
    type: { // input type en el formulario de gestión
        type: SchemaTypes.String,
        enum: {
            values: ['text', 'date', 'number', 'textarea', 'url'],
            message: props => `No se aceptan los medios de tipo ${props.value}`
        },
        required: [true, 'Es necesario especificar el tipo del campo']
    },
    validation: { 
        type: SchemaTypes.Map, // {min: 20, required: true}
        default: {}
    }
}, { _id: false })

const changelogSchema = new Schema({
    externalUserId: {
        type: SchemaTypes.String, 
        required: [true, 'El identificador del usuario es necesario'],
    },
    action: {
        type: SchemaTypes.String, // 'accion#usuario'
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
    content_fields: [contentFieldsSchema], // se utilizara para construir el contenido de un elemento
    is_abstract: { 
        type: SchemaTypes.Boolean, // true si no existe un componente como tal, se usan sus datos para construir diferentes componentes
        default: false
    },
    is_hidden: {
        type: SchemaTypes.Boolean, // false si temporalmente no se muestra en la web del cliente
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
    elements_lenght: {
        type: SchemaTypes.Number,
        default: 0
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