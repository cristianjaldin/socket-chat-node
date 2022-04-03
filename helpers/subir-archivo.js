const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'pdf'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        console.log('files >>>', files);
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        console.log(nombreCortado);
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`);
        }
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve(nombreTemp);
        });
    });
}

module.exports = {
    subirArchivo
}