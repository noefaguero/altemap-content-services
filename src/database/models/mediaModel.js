const { Schema, model, SchemaTypes } = require('mongoose')


// SCHEMA /////////////////////////////////////////////////////////////////////////

const mediaSchema = new Schema({
	path: {
		type: SchemaTypes.String, // ":project_id/hospital.webp"
		required: [true, 'La ruta de almacenamiento del archivo es necesaria'],
	},
	url: {
		type: SchemaTypes.String, // "https://api.altemap.com/media/:project_id/hospital.webp"
		required: [true, 'La URL de acceso al archivo es necesaria'],
        match: [
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/, 
            'URL del archivo no válida'
        ]
	},
	content_type: {
		type: SchemaTypes.String,
		enum: {
			values: ['image/jpg', 'image/jpeg', 'image/png', 'image/avif', 'image/webp', 'image/svg+xml', 'application/pdf'],
			message: props => `No se aceptan los medios de tipo ${props.value}`
		},
		required: [true, 'Es necesario especificar el tipo de medio']
	},
	size: {
		type: SchemaTypes.Number, // en kb con dos decimales
		required: [true, 'El tamaño del archivo es necesario']
	}
}, {
	timestamps: true
})


const Media = model('Media', mediaSchema)

module.exports = Media