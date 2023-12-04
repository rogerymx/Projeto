const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pedido = new Schema({
    idVenda: {
        type: Number,
        required: true
    },
    sorvete: {
        type: Schema.Types.ObjectId,
        ref: 'sorvetes',
        required: true
    },
    observacao: {
        type: String,
        required: false
    },
    data: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('pedidos', Pedido);