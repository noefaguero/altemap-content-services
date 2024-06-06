const { Schema, model, SchemaTypes } = require('mongoose')


const componentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contentSchema: {
        // JSON de esquema variable, se utilizara para construir el formulario para manerar el contenido de un elemento del componente
        type: Schema.Types.Mixed, 
        required: true,
        validate: {
            validator: (json) => {
                const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/
                
                if (json.url && !urlRegex.test(json.url)) return false
                if (json.image && !urlRegex.test(json.image)) return false
                if (json.pdf && !urlRegex.test(json.pdf)) return false

              return true // Si no tiene el campo url, el objeto es válido
            },
            message: props => 'La URL no es válida'
          }
    },
    subcomponents: {
        type: SchemaTypes.ObjectId,
        ref: 'Component',
        default: []
    },
    hide: {
        type: Boolean,
        default: false
    },
    elements: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Element',
            default: []
        }],
    },
    changelog: {
        type: [{
            timestamp: {
                type: Date,
            },
            change: {
                type: String, // accion#usuario
            }
        }],
        default: []
    },
}, {
    timestamps: true
})


const Component = model('Component', componentSchema)

module.exports = Component