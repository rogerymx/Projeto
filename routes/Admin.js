const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_JWT
require('../models/User')
const User = mongoose.model('users')
const verifAdmin = require('../Auth/VerificarAdmin')

router.post('/register', verifAdmin, (req, res) => {
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
        isAdmin: 1
    }
    new User(novoUser).save().then(() => {
        res.status(201).json({ message: 'Administrador cadastrado com sucesso' })
    }).catch((error) => {
        res.status(500).json({ message: 'Erro interno no servidor: ', error })
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

    User.findOne({ nome: nome }).then((user) => {
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

// Rota para deletar um usuário (verificação de administrador dentro da função)
router.delete('/delete/:nome', verifAdmin, (req, res) => {
    // Verifica se o nome do usuário a ser excluído é fornecido
    if (!req.params.nome) {
        return res.status(400).json({ message: 'O nome do usuário é obrigatório.' });
    }

    // Procura o usuario com o nome que foi passado por parametro
    User.findOne({ nome: req.params.nome }).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se o usuário é um administrador (isAdmin = 1)
        if (user.isAdmin === 1) {
            return res.status(403).json({ message: 'Não é permitido excluir um administrador.' });
        }

        // Procede com a exclusão do usuário se não for um administrador
        User.deleteOne({ nome: req.params.nome }).then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: 'Usuário deletado com sucesso' });
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        }).catch((error) => {
            res.status(500).json({ message: 'Erro interno no servidor', error });
        });
    }).catch((error) => {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    });
});

/* Rota para um usuário excluir a própria conta */
router.delete('/delete-myself', verifAdmin, (req, res) => {
    const userIdFromToken = req.user._id;

    User.deleteOne({ _id: userIdFromToken }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Conta excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    }).catch((error) => {
        res.status(500).json({ message: 'Erro interno no servidor', error });
    });
});

module.exports = router