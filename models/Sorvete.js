const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sorvete = new Schema({
    sabor: {
        type: String,
        required: true
    },
    tamanho: {
        type: Number,
        required: true
    },
    cobertura: {
        type: String,
        required: true
    },
    fruta: {
        type: String,
        required: true
    }
})

mongoose.model('Sorvetes', Sorvete);
