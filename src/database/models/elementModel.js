const { Schema, model, SchemaTypes } = require('mongoose')
const Component = require('./componentModel')
const Project = require('./projectModel')


const mediaSchema = new Schema({
	field_name: {
		type: SchemaTypes.String,
		required: [true, 'El nombre del campo del archivo es necesario'],
	},
	path: {
		// "/664d16d9273c58e8d0517669/6662148f51be4483244edc7f/hospital.webp"
		type: SchemaTypes.String, 
		required: [true, 'La ruta de almacenamiento del archivo es necesaria'],
	},
	content_type: {
		type: SchemaTypes.String,
		enum: {
			values: ['image', 'pdf'],
			message: props => `No se aceptan los medios de tipo ${props.value}`
		},
		required: [true, 'Es necesario especificar el tipo de medio']
	},
	size: {
		type: SchemaTypes.Number, // en kb
		required: [true, 'El tamaño del archivo es necesario']
	}
}, {
	timestamps: true,
	_id: false
})


const elementSchema = new Schema({
	index: {
		type: SchemaTypes.Number,
		default: 1
	},
	component_id: {
		type: SchemaTypes.ObjectId,
		ref: Component,
		required: [true, 'El componente del elemento es necesario']
	},
	is_hidden: {
		type: SchemaTypes.Boolean,
		default: false
	},
	content: {
		type: SchemaTypes.Mixed,
		required: true,
		validate: {
			validator: async (contents) => {
				// consultar el componente
				const component = await Component.findById(this.component_id, 'content_schema')
				const fields = component.content_schema

				this.feedbacks = [] // mensajes de no validacion
				const { REGEXS } = require('../../constants')

				const result = fields.forEach(field => {

					if (!field.validation || Object.keys(field.validation).length === 0) return // este campo no tiene validacion
					
					Object.entries(validation).map(([validationKey, validationValue]) => {
						const fieldValue = contents[field.name]
						let ex = null // se le asignará regex en caso de validacion de patrón

						// segun clave de validacion
						switch (validationKey) {
							case 'required':
								if (!fieldValue) {
									this.feedbacks.push(`${field.name}: obligatorio`)
								}
								break
							case 'pattern':
								ex = new RegExp(REGEXS[validationValue].expression)
								break
							case 'min':
								if (fieldValue > validationValue) {
									this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
								}
								break
							case 'max':
								if (fieldValue > validationValue) {
									this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
								}
								break
							case 'minlength':
								if (fieldValue > validationValue) {
									this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
								}
								break
							case 'maxlength':
								if (fieldValue > validationValue) {
									this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
								}
								break
						}
						// comprobar patrón
						if (ex && !ex.test(fieldValue)) {
							this.feedbacks.push(`${field.name}: ${REGEXS[validationValue].message}`)
						}
					})
				})

				return result // boleano
			}, // fin de validator
			message: props => this.feedbacks
		}
	},
	media: [mediaSchema]
}, {
	timestamps: true
})


// MIDDLEWARES //////////////////////////////////////////////////////////////////

// UTILS
const updateMediaLog = async (media, increment) => {
	const totalSize = media.reduce((acu, file) => acu += file.size, 0)
	const projectId = media[0].path.substring(0, file.path.index0f('/'))

	await Project.findByIdAndUpdate(
		projectId, 
		{
			metrics: {
				media: {
					files: { $inc: increment 
						? totalSize 
						: totalSize * -1 
					},
					total_kb: { $inc: increment 
						? totalSize 
						: totalSize * -1 
					}
				}
			}
		}
	)
}

// antes de crear/actualizar elementos
elementSchema.pre('save', async (next) => {
	try {
		// 1. Asignar indice si es un documento nuevo
		if (this.isNew) {
			if (this.index < 0) { // 1 => primero, -1 => ultimo
				const count = await this.constructor.find(
					{ component_id: this.component_id }
				).countDocuments()
				this.index = ++count
			}
		}

		// 2. Actualizar registro de medios en el documento del proyecto
		await updateMediaLog(this.media, true)

	} catch (error) {
		return next(error)
	}

	next()
})

// después de eliminar
elementSchema.post('remove', async (doc, next) => {
	try {
		// 1. Actualizar registro de medios del proyecto
		if (doc?.media.length > 0) {
			const totalSize = doc.media.reduce((acu, file) => acu += file.size, 0)
			const projectId = doc.media[0].path.substring(0, file.path.index0f('/'))

			await Project.findByIdAndUpdate(
				projectId, 
				{
					metrics: {
						media: {
							files: { $inc: - media.length },
							total_kb: { $inc: - totalSize }
						}
					}
				}
			)
		}

		// 2. Reordenar indices
		const deletedIndex = doc.index
		await this.constructor.updateMany(
			{
				component_id: doc.component_id,
				index: { $gt: deletedIndex }
			},
			{ $inc: { index: -1 } }
		)

	} catch (error) {
		return next(error)
	}
	next()
})

// método estatico para cambiar index (se necesita el índice previo) 
// se usa en drag and drop
/* elementSchema.statics.changeIndex = async (id, origin, newIndex) => {
	try {
		await findByIdAndUpdate(id, { index: newIndex })

		const elements = await this.find({}, '_id index').sort('index')
		elements.map(doc => doc._id = doc._id.toHexSchemaTypes.String())

		for (let i = 0; i < elements.length; i++) {
			// reordenar solo docs diferentes al doc modificado
			if (elements[i]._id !== id) {
				if (
					// caso 1: elemento retrasado
					origin < newIndex &&
					// adelantar los que estan entre el origen y el destino
					elements[i].index <= newIndex && elements[i].index > origin
				) {
					elements[i].index--

				} else if (
					// caso 2: elemento adelantado 
					origin > newIndex &&
					// retrasar los que estan entre el origen y el destino
					elements[i].index < origin && elements[i].index >= newIndex
				) {
					elements[i].index++
				}
				await elements[i].save()
			}
		}
	} catch (error) {
		throw error
	}
} */


// crear modelo
const Element = model('Element', elementSchema)


module.exports = Element
