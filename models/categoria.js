const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obigatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default:true,
        required: true
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

//Sobre escribimos el to json.
CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...categoria } = this.toObject();
    categoria.uid = _id;
    return categoria;
}


module.exports = model('Categoria', CategoriaSchema);

