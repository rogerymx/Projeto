const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/Pedido')
const Pedido = mongoose.model('pedidos')
const verifToken = require('../Auth/VerificarToken')
const verifAdmin = require('../Auth/VerificarAdmin')

router.get("/", (req, res) => {
    Pedido.find().then(pedidos => {
        if (pedidos.length == 0) {
            res.status(404).json({ message: 'Nenhum pedido cadastrado!' })
        }
        res.status(200).json({ message: 'Dados dos pedidos cadastrados: ', pedidos })
    }).catch(error => {
        res.status(500).json(error)
    })
})

router.post("/", verifToken, verifAdmin, (req, res) => {
    console.log('Dados recebidos na requisição:', req.body);

    const novoPedido = {
        idVenda: req.body.idVenda,
        sorvetes: req.body.sorvetes,
        observacao: req.body.observacao
    };

    console.log('Novo pedido a ser salvo:', novoPedido);

    new Pedido(novoPedido).save().then(() => {
        res.status(201).json({ message: 'Pedido adicionado com sucesso' });
    }).catch((error) => {
        console.error('Erro ao criar o pedido:', error);
        res.status(500).json({ message: 'Erro interno no servidor', error });
    });
});

router.delete('/:id', (req, res) => {
    Pedido.deleteOne({ _id: req.params.id }).then(pedido => {
        res.status(200).json({ message: 'Pedido deletado com sucesso', idPedido: pedido._id });
    }).catch((error) => {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    });
});

module.exports = router