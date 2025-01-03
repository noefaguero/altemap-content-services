const { Schema, model, SchemaTypes } = require('mongoose')
const Component = require('./componentModel')
const { addElementReference, removeElementReference } = require('../../services/componentServices')

// SCHEMA /////////////////////////////////////////////////////////////////////////////
const elementSchema = new Schema({
	index: {
		type: SchemaTypes.Number,
		default: 1
	},
	component_id: {
		type: SchemaTypes.ObjectId,
		ref: 'Component',
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
			validator: async function (contents) {
				// consultar el componente
				const component = await Component.findById(this.component_id) 
				const schema = component.toObject().content_fields

				this.feedbacks = [] // mensajes de no validacion
				const { REGEXS } = require('../../utils/constants')
				
				// iterar sobre los campos del schema
				schema.forEach((fieldSchema) => {

					if (!fieldSchema?.validation || Object.keys(fieldSchema.validation).length === 0) {
						return // este campo no tiene validacion
					}

					const fieldValue = contents[fieldSchema.key]
					Object.entries(fieldSchema.validation).forEach(([validationKey, validationValue]) => {
						let ex = null // se le asignará regexp en caso de validacion de patrón
						// segun clave de validacion
						switch (validationKey) {
							case 'required':
								if (!fieldValue) {
									this.feedbacks
										.push(`${fieldSchema.key}: obligatorio`)
								}
								break
							case 'pattern':
								ex = new RegExp(REGEXS[validationValue].expression)
								break
							case 'min':
								if (fieldValue < validationValue) {
									this.feedbacks
										.push(`${fieldSchema.key}: mínimo ${validationValue}`)
								}
								break
							case 'max':
								if (fieldValue > validationValue) {
									this.feedbacks
										.push(`${fieldSchema.key}: mínimo ${validationValue}`)
								}
								break
							case 'minlength':
								if (fieldValue.length < validationValue) {
									this.feedbacks
										.push(`${fieldSchema.key}: mínimo ${validationValue}`)
								}
								break
							case 'maxlength':
								if (fieldValue.length > validationValue) {
									this.feedbacks
										.push(`${fieldSchema.key}: mínimo ${validationValue}`)
								}
								break
						}
						// comprobar patrón
						if (ex && !ex.test(fieldValue)) {
							this.feedbacks
								.push(`${fieldSchema.key}: ${REGEXS[validationValue].message}`)
						}
					})
					return this.feedbacks.length === 0 // si no hay errores, devuelve true
				})
			}, // fin de validator
			message: props => this.feedbacks
		}
	}
}, {
	timestamps: true
})


// MIDDLEWARES ///////////////////////////////////////////////////////////////////////
// NOTA: no usar next() en funciones asíncronas. En su lugar lanzar errores.
// se ejecuta antes de crear un elemento
elementSchema.pre('save', async function () {
	try {
		// asignar valor del indice
		if (this.index < 0) { // 1 => primero, -1 => ultimo
			let count = await this.constructor.find(
				{ component_id: this.component_id }
			).countDocuments()
			this.index = ++count
		}

		// añadir referencia en el componente
		await addElementReference(this._id.toString(), this.component_id.toString())

	} catch (error) {
		throw error
	}
})


// se ejecuta después de eliminar un elemento
elementSchema.post('findOneAndDelete', async function (doc) {
	try {
		// reordenar los indices de los elementos posteriores
		const deletedIndex = doc.index
		await doc.constructor.updateMany(
			{
				component_id: doc.component_id.toString(),
				index: { $gt: deletedIndex }
			},
			{ $inc: { index: -1 } }
		)

		// eliminar referencia en el componente
		await removeElementReference(doc._id.toString(), doc.component_id.toString())

	} catch (error) {
		throw error
	}
})


// STATIC FUNCTIONS //////////////////////////////////////////////////////////////////

// para cambiar index (se necesita el índice previo) 
// se usa en drag and drop
/* elementSchema.statics.changeIndex = async function (id, origin, newIndex) {
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
