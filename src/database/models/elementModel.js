const { Schema, model, SchemaTypes } = require('mongoose')
const { findByIdAndUpdate } = require('./projectModel')

const elementSchema = new Schema({
  index: {
    type: SchemaTypes.Number,
  },
  component_id: {
    type: SchemaTypes.ObjectId,
    required: true
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
        const fields = await Component.findById(this.component_id, 'content_schema')
        

        this.feedbacks = [] // mensajes de no validacion
        const { REGEXS } = require('../../constants')

        const result = forEach(fields).forEach(field => {
          if (!field.validations || field.validations.length === 0) return // este campo no tiene validacion
          
          const [validationKey, validationValue] = field.validations.split('=')
          const fieldValue = contents[field.name]
          
          let ex = null // se le asignará regex en caso de validacion de patrón
          // segun clave de validacion
          switch (validationKey) {
            case 'accept':
              return 
            case 'required':
              if (!fieldValue) {
                this.feedbacks.push(`${field.name}: obligatorio`)
              }
              break;
            case 'accept': // ejemplo accept="image/jpeg". En este punto el campo debe proporcionar la ruta del archivo cargado 
              ex = new RegExp(REGEXS.url.expression)
              break;
            case 'pattern':
              ex = new RegExp(REGEXS[validationValue].expression)
              break;
            case 'min':
              if (fieldValue > validationValue) {
                this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
              }
              break;
            case 'max':
              if (fieldValue > validationValue) {
                this.feedbacks.push(`${field.name}: mínimo ${validationValue}`)
              }
              break;
          }
          // comprobar patrón
          if (ex && !ex.test(fieldValue)) {
            this.feedbacks.push(`${field.name}: ${REGEXS[validationValue].message}`)
          }
        })

        return result // boleano
      }, // fin de validator
      message: props => this.feedbacks
    }
  }
}, {
    timestamps: true
})

// middleware para creaciones o actualizaciones de elementos
elementSchema.pre('save', async (doc, next) => {
  // si se está creando un elemento nuevo se asigna como indice la ultima posicion
  if (this.isNew) {
    try {
      const count = await this.constructor.countDocuments()
      this.index = count + 1
    } catch (error) {
      return next(error)
    }
  }
  next()
})

// middleware para reordenar indices ante una eliminacion
elementSchema.post('remove', async (doc, next) => {
  try {
    const elements = await this.constructor.find().sort('index')
    const deletedIndex = doc.index
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].index > deletedIndex) {
        elements[i].index-- // disminuir indice de los elementos posteriores al eliminado
        await elements[i].save()
      }
    }
  } catch (error) {
    return next(error)
  }
  next()
})

// método estatico para cmbiar el index (se necesita el indice previo). Se usará directamente en el servicio 
elementSchema.statics.changeIndex = async (id, origin, newIndex) => {
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
}

// crear modelo
const Element = model('Element', elementSchema)

module.exports = Element
