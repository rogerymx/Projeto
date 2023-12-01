const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/User')
const User = mongoose.model('users')

/* Registro */
router.post("/", async(req, res) => {
    const {nome, email, senha, confSenha} = req.body

    /* Validacoes */
    if(!nome || nome == null || typeof nome == undefined){
        res.status(422).json({message:'Nome está em branco ou é inválido!'})
    }
})

module.exports = router