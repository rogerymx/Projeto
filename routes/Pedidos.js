const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("../models/Pedido");
const Pedido = mongoose.model("pedidos");
const verifToken = require("../Auth/VerificarToken");
const verifAdmin = require("../Auth/VerificarAdmin");
const limites = [5, 10, 30];

router.get("/", (req, res) => {
  const limite = parseInt(req.query.limite) || 5;
  const pagina = parseInt(req.query.pagina) || 1;
  const skip = (pagina - 1) * limite;

  Pedido.find()
    .skip(skip)
    .limit(limite)
    .then((pedidos) => {
      if (pedidos.length === 0) {
        res.status(404).json({ message: "Nenhum pedido cadastrado!" });
      }
      res.status(200).json({
        message: `Dados dos pedidos cadastrados (limite=${limite}, página=${pagina}):`,
        pedidos,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/", verifToken, verifAdmin, (req, res) => {
  const novoPedido = {
    idVenda: req.body.idVenda,
    sorvetes: req.body.sorvetes,
    observacao: req.body.observacao,
  };

  new Pedido(novoPedido)
    .save()
    .then(() => {
      res.status(201).json({ message: "Pedido adicionado com sucesso" });
    })
    .catch((error) => {
      console.error("Erro ao criar o pedido:", error);
      res.status(500).json({ message: "Erro interno no servidor", error });
    });
});

router.put("/:id", verifToken, verifAdmin, (req, res) => {
  Pedido.findOne({ _id: req.params.id }).then((pedido) => {
    pedido.idVenda = req.body.idVenda;
    pedido.sorvetes = req.body.sorvetes;
    pedido.observacao = req.body.observacao;
    pedido
      .save()
      .then(() => {
        res.status(201).json({ message: "Pedido editado com sucesso!" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Erro interno no servidor!", error });
      });
  });
});

module.exports = router;
