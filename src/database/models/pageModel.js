const { Schema, model, SchemaTypes } = require('mongoose')

const pageSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    project_id: {
        type: SchemaTypes.ObjectId,
        ref: 'Project',
        required: true
    },
    components: {
        type: [{
            type: SchemaTypes.ObjectId,
            ref: 'Component'
        }]
    }
}, {
    timestamps: true
})

const Page = model('Page', pageSchema)

module.exports = Page