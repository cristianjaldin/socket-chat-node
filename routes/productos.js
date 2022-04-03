const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validator');

const {crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');

const router = Router();

// Obtener todas las productos - publico
router.get('/', obtenerProductos);

// Obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

// Crear una producto - privado - cualquier persona con un token válido
router.post('/',
    [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ], crearProducto);

// Actualizar una producto - privado - cualquier persona con un token válido
router.put('/:id',
    [validarJWT,
        //check('categoria', 'No es un id de Mongo').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    actualizarProducto);

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],
    borrarProducto);

module.exports = router;