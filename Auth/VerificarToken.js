const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')

function verifToken(req, res, next) {
    const token = req.headers.authorization;

    console.log(token)
    if (!token) {
        return res.status(401).json({ message:'Acesso negado!'});
    }

    const secret = process.env.SECRET_JWT;

    jwt.verify(token, secret, (erro, decoded) => {
        if (erro) {
            return res.status(401).json({ message:'Token inválido!'});
        }

        User.findOne({ _id: decoded.userid }).then((usuarioEncontrado) => {
            if (!usuarioEncontrado) {
                return res.status(401).json({ message:'Usuário não encontrado!'});
            }
            req.user = usuarioEncontrado;
            next();
        });
    });
}

module.exports = verifToken