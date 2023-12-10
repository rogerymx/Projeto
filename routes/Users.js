const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_JWT
require('../models/User')
const User = mongoose.model('users')
const verifToken = require('../Auth/VerificarToken')
const verifAdmin = require('../Auth/VerificarAdmin')

/* Rota para registro */
router.post("/register", (req, res) => {
    const { nome, email, senha, confSenha } = req.body

    /* Validacoes */
    if (!nome || nome == null || typeof nome == undefined) {
        res.status(422).json({ message: 'Nome está em branco ou é inválido!' })
    }
    if (!email || email == null || typeof email == undefined) {
        res.status(422).json({ message: 'Email está em branco ou é inválido!' })
    }
    if (!senha || senha == null || typeof nome == undefined) {
        res.status(422).json({ message: 'Senha está em branco ou é inválido!' })
    }
    if (senha !== confSenha) {
        res.status(422).json({ message: 'Senha e confirmacao de senha nao batem' })
    }

    /* Atribuição dos dados recebidos */
    const novoUser = {
        email: email,
        nome: nome,
        senha: senha,
        isAdmin: 0
    }

    /* Criação do administrador */
    User.find().then((usuarios) => {
        if (usuarios.length === 0) {
            novoUser.isAdmin = 1
            new User(novoUser).save().then(() => {
                res.status(201).json({ message: 'Administrador cadastrado com sucesso' });
            }).catch((error) => {
                res.status(500).json({ message: 'Erro interno no servidor: ', error });
            });
        } else {
            User.findOne({ email: email }).then((usuarioExistente) => {
                if (usuarioExistente) {
                    res.status(422).json({ message: 'Email já cadastrado!' });
                } else {
                    new User(novoUser).save().then(() => {
                        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
                    }).catch((error) => {
                        res.status(500).json({ message: 'Erro interno no servidor: ', error });
                    })
                }
            })
        }
    })
})

/* Rota para login pública */
router.post("/login", (req, res) => {
    const { email, senha } = req.body;

    /* Validacoes */
    if (!email) {
        return res.status(422).json({ message: 'Email está em branco ou é inválido!' });
    }
    if (!senha) {
        return res.status(422).json({ message: 'Senha está em branco ou é inválida!' });
    }

    /* Verificação se o usuário existe */
    User.findOne({ email: email, senha: senha }).then((usuario) => {
        console.log(usuario)
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não existente!' });
        }

        /* Criação do token */
        const token = jwt.sign({ userid: usuario._id, isAdmin: usuario.isAdmin }, SECRET);
        return res.status(201).json({ message: 'Login realizado com sucesso!', token });
    }).catch((error) => {
        return res.status(500).json({ message: 'Erro interno no servidor', error });
    });
});

/* Rota alteração de usuário */
router.put('/alterar', verifToken, (req, res) => {
    const idUser = req.user._id
    User.findOne({ _id: idUser }).then((user) => {
        user.nome = req.body.nome
        user.email = req.body.email
        user.senha = req.body.senha

        user.save().then(() => {
            res.status(201).json({ message: 'Usuário editado com sucesso!' })
        }).catch((error) => {
            res.status(500).json({ message: 'Erro interno no servidor!', error })
        })
    })
})


module.exports = router