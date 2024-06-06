const { Schema, model, SchemaTypes } = require('mongoose')

const automationSchema = new Schema({
    requests: {
      type: SchemaTypes.Mixed, // array de JSON variable
      required: true
    },
    exec_date: {
        type: Date,
        validate: {
            validator: (value) => value > new Date(),
            message: (props) => 'La fecha debe ser superior al momento actual'
        }
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    }
})

const Automation = model('Automation', automationSchema)

module.exports = Automation