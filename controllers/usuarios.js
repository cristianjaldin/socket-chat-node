const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {
    //const { nombre, edad } = req.body;
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //guarda en DB
    await usuario.save();

    res.status(201).json({
        //msg: 'post API - controlador',
        //nombre,
        //edad,
        usuario
    });
}

const usuariosPut = async (req, res) => {

    //const id = req.params.id;
    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    /*
    res.status(200).json({
        msg: 'put API - controlador',
        usuario
    });*/
    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;
    
    res.json({usuario, usuarioAutenticado});

}

module.exports = {
    usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete
}