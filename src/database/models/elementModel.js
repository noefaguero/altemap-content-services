const { Schema, model } = require('mongoose')
const { findByIdAndUpdate } = require('./projectModel')

const elementSchema = new Schema({
  index: {
    type: Number,
  },
  hide: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

// middleware para autoincrementar el indice ante una insercion
elementSchema.pre('save', async (next) => {
  if (this.isNew) { // solo en inserciones
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

// método estatico para cmbiar el index de un elemento y reordenar
elementSchema.statics.changeIndex = async (id, origin, newIndex) => {
  try {
    
    await findByIdAndUpdate(id, { index: newIndex })

    const elements = await this.find({}, '_id index').sort('index')
    elements.map(doc => doc._id = doc._id.toHexString())
    
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
