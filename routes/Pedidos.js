const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/Pedido')
const Pedido = mongoose.model('Pedidos')

router.get("/",(req, res) => {
    Sorvete.find().then(pedidos => {
        if(pedidos.length == 0){
            res.status(404).json({message:'Nenhum pedido cadastrado!'})
        }
        res.status(200).json({message:'Dados dos pedidos cadastrados: ',pedidos})
        
    }).catch(error => {
        res.status(500).json(error)
    })
})
