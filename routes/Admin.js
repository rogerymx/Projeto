const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_JWT
require('../models/User')
const User = mongoose.model('users')
const verifAdmin = require('../Auth/VerificarAdmin')

router.post('/register', verifAdmin, (req, res) => {
    const {nome, email, senha, confSenha} = req.body

    /* Validacoes */
    if(!nome || nome == null || typeof nome == undefined){
        res.status(422).json({message:'Nome está em branco ou é inválido!'})
    }
    if(!email || email == null || typeof email == undefined){
        res.status(422).json({message:'Email está em branco ou é inválido!'})
    }
    if(!senha || senha == null || typeof nome == undefined){
        res.status(422).json({message:'Senha está em branco ou é inválido!'})
    }
    if(senha !== confSenha){
        res.status(422).json({message:'Senha e confirmacao de senha nao batem'})
    }

    /* Atribuição dos dados recebidos */
    const novoUser = {
        email : email,
        nome : nome,
        senha : senha,
        isAdmin : 1
    }
    new User(novoUser).save().then(() => {
        res.status(201).json({message:'Administrador cadastrado com sucesso'})
    }).catch((error) => {
        res.status(500).json({message:'Erro interno no servidor: ', error})
    })
})

/* Rota para editar um usuário */
router.put('/alterar/:nome', verifAdmin, (req, res) => {
    const nome = req.params.nome
    const { novoNome, email, senha } = req.body

    if (!novoNome || novoNome == null || typeof novoNome == undefined) {
        res.status(422).json({ message: 'Nome está em branco ou é inválido!' })
        return  // Adicionando o return para evitar a execução do código abaixo em caso de erro
    }
    if (!email || email == null || typeof email == undefined) {
        res.status(422).json({ message: 'Email está em branco ou é inválido!' })
        return
    }
    if (!senha || senha == null || typeof senha == undefined) {
        res.status(422).json({ message: 'Senha está em branco ou é inválida!' })
        return
    }

    console.log(novoNome);
    User.findOne({ nome: nome }).then((user) => {
        console.log(nome)
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' })
            return
        }

        user.nome = novoNome
        user.email = email
        user.senha = senha

        user.save().then(() => {
            res.status(201).json({ message: 'Usuário editado com sucesso!' })
        }).catch((error) => {
            res.status(500).json({ message: 'Erro interno no servidor!', error })
        })
    })
})



module.exports = router