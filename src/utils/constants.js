const { NODE_ENV, UPLOAD_PATH } = process.env
const path = require('path')
const componentController = require('../controllers/management/componentController')

exports.UPLOADS_URI = (() => {
    return NODE_ENV !== 'development'
        ? UPLOAD_PATH // ruta absoluta
        : path.join(__dirname, '../../../uploads') // ruta relativa
    }
)()

exports.REGEXS = {
    url: {
        expression: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/',
        message: 'URL no válida'
    }
}


// clase e instancia para cargar el mapa de campos permitidos de cada componente
// -> set(componentId, { sortable: <fieldName>, filterable: [{<fieldName>: [<fieldValues>]}] } )
class AllowedFieldsMap extends Map {
    constructor() {
        super()
    }

    // cargar los campos permitidos de cada componente
    async load() {
        try {
            const components = await componentController.getAllComponents()

            for (const component of components) {
                const allowedFields = { sortable: [], filterable: {} }
                // sortable types: text, number
                // filterable types: select
                component.content_fields.forEach(field => {
                    if (['text', 'number'].includes(field.type)) {
                        allowedFields.sortable.push(field.key)
                    } else if (field.type === 'select') {
                        allowedFields.filterable[field.key] = field.options // posibles valores de cada filtro
                    }
                })
                // cargar en el mapa
                this.set(component._id.toHexString(), allowedFields)
            }
        } catch (error) {
            console.error('Error al cargar los filtros permitidos:', error)
        }
    }
}

exports.ALLOWED_FIELDS = new AllowedFieldsMap()