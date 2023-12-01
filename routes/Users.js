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
        isAdmin : 0
    }

    /* Criação do administrador */
    User.find().then((usuarios) => {
        if(usuarios.length === 0) {
            novoUser.isAdmin = 1;
            new User(novoUser).save().then(() => {
                res.status(201).json({message:'Administrador cadastrado com sucesso'});
            }).catch((error) => {
                res.status(500).json({message:'Erro interno no servidor: ', error});
            });
        } else {
            User.findOne({ email: email }).then((usuarioExistente) => {
                if(usuarioExistente) {
                    res.status(422).json({message:'Email já cadastrado!'});
                } else {
                    new User(novoUser).save().then(() => {
                        res.status(201).json({message:'Usuário cadastrado com sucesso'});
                    }).catch((error) => {
                        res.status(500).json({message:'Erro interno no servidor: ', error});
                    });
                }
            });
        }
    });

    /* Checagem no banco se o usuário já existe */
    // User.findOne({ email: email }).then((usuarioExistente) => {
    //     if(usuarioExistente) {
    //         res.status(422).json({message:'Email já cadastrado!'})
    //     }
    //     new User(novoUser).save().then(() => {
    //         res.status(201).json({message:'Usuário cadastrado com sucesso'})
    //     }).catch((error) => {
    //         res.status(500).json({message:'Erro interno no servidor: ', error})
    //     })
    // })

})

module.exports = router