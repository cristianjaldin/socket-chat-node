const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers")
const { ChatMensajes } = require("../models")

const chatMensajes = new ChatMensajes(); //Hay una sola instancia

const socketController = async (socket = new Socket(), io) => {
    //console.log('cliente conectado', socket.id);
    //console.log(socket);
    //console.log(socket.handshake.headers['x-token']);
    const token = socket.handshake.headers['x-token']

    const usuario = await comprobarJWT(token);

    if (!usuario) {
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);


    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    //Emitimos para todos los socket
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensaje', chatMensajes.ultimos10);

    // Conectarlo a una sala especial
    socket.join(usuario.id); // sala global, socket.id y sala por el usuario.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if (uid) {
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    });





}

module.exports = {
    socketController
}