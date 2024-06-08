const { Schema, model, SchemaTypes } = require('mongoose')

const progSchema = new Schema({ // esquema de cambios programados
    requests: {
      type: SchemaTypes.Array,
      required: true
    },
    exec_date: {
        type: SchemaTypes.Date,
        validate: {
            validator: (value) => value > new Date(),
            message: (props) => 'La fecha debe ser superior al momento actual'
        }
    },
    createdAt: { 
        type: SchemaTypes.Date,
        default: Date.now 
    }
})

const Prog = model('Prog', progSchema)

module.exports = Prog