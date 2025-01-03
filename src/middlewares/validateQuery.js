/*
 * CADENA DE MIDDLEWARES DE VALIDACIÓN DE CONSULTAS
 */

const { ALLOWED_FIELDS } = require('../utils/constants')
const { param, query, validationResult } = require('express-validator')

// middleware final para comprobar los resultados de las validaciones
const validateResult = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const customErrors = {} // nombre del campo y mensaje de error
		errors.array().forEach((error) => customErrors[error.param] = error.msg )
		return res.status(400).json({ errors: customErrors})
	}
	next()
}

// middleware propio para validar filtros
const validateFilters = (req) => {
    const filters = Object.keys(req.query).filter(item => !['sort', 'limit', 'cursor'].includes(item))
	const allowedFilters = ALLOWED_FIELDS.get(req.params.id).filterable
	
	// si hay filtros, se comprueba la clave y el valor de cada filtro
	if (filters.length) {
		for (const field of filters) {
			const value = req.query[field]
			if (!allowedFilters) {
				req.validationErrors.push({
					param: field,
					msg: `El filtro ${field} no existe o no es un filtro`,
					value
				})
			}
			if (!allowedFilters.includes(value)) {
				req.validationErrors.push({
					param: field,
					msg: `El filtro "${field}" no admite el valor "${value}"`,
					value
				})
			}
		}
	}
	// si no hay errores en la consulta, se añaden los filtros a req para usarlo en el controlador 
	if (!req.validationErrors.length) {
		req.query.filters = filters
	}
}

// middleware propio para validar el campo de ordenación
const validateSortField = (req) => {
	if (!req.query?.sort) {
		req.query.sort = 'index_asc' // valor por defecto
	}
	const sortField = req.query.sort.split('_')[0]
	if (sortField !== 'index' && !ALLOWED_FIELDS[req.params.id].sortable.includes(sortField)) {
		req.validationErrors.push({
			param: 'sort',
			msg: `El campo "${sortField}" no existe o no es un índice de ordenación`,
			value
		})
	}
}

const validateAllowedFields = (req, res, next) => {
	req.validationErrors ??= []
	// validar campo de ordenación si la cadena es correcta
	if (!req.validationErrors.some(validation => validation.param === 'sort')) {
		validateSortField(req)
	}
	// validar filtros
	validateFilters(req)

	next()
}

exports.validateGetElements = [
	param('id')
		.exists().withMessage('El ID del componente es obligatorio')
		.isMongoId().withMessage('El ID no es válido'),
	query('sort')
		.optional()
		.matches(/^[a-zA-Z0-9]+_(asc|desc)$/).withMessage('El campo "sort" debe ser una cadena con el patrón <campo>_<asc|desc>'),
	query('limit')
		.optional()
		.isInt({ min: 0, max: 30 }).withMessage('El campo "limit" debe ser un número entero positivo'),
	query('cursor')
		.optional()
		.isString().withMessage('El cursor debe ser una cadena válida'),
	validateAllowedFields,
	validateResult
]