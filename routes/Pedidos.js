const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/Pedido')
const Pedido = mongoose.model('pedidos')
const verifToken = require('../Auth/VerificarToken')
const verifAdmin = require('../Auth/VerificarAdmin')

router.get("/",(req, res) => {
    Pedido.find().then(pedidos => {
        if(pedidos.length == 0){
            res.status(404).json({message:'Nenhum pedido cadastrado!'})
        }
        res.status(200).json({message:'Dados dos pedidos cadastrados: ',pedidos})        
    }).catch(error => {
        res.status(500).json(error)
    })
})

router.post("/", verifToken, verifAdmin, (req, res) => {
    const novoPedido = {
        idVenda : req.body.idVenda,
        sorvete : req.body.sorvete,
        observacao : req.body.observacao
    }
    new Pedido(novoPedido).save().then(() => {
        res.status(201).json({message:'Pedido adicionado com sucesso'})
    }).catch((error) => {
        res.status(500).json({message:'Erro interno no servidor: ', error})
    })
})

module.exports = router