const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pedido = new Schema({
  idVenda: {
    type: Number,
    required: true,
  },
  sorvetes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sorvetes",
      required: true,
    },
  ],
  observacao: {
    type: String,
    required: false,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("pedidos", Pedido);
