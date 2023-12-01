const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/Sorvete')
const Sorvete = mongoose.model('Sorvetes')

router.get("/",(req, res) => {
    Sorvete.find().then(sorvetes => {
        if(sorvetes.length == 0){
            res.status(404).json({message:'Nenhum sorvete cadastrado!'})
        }
        res.status(200).json({message:'Sorvetes encontrados!',sorvetes})
        
    }).catch(error => {
        res.status(500).json(error)
    })
})

router.post("/", (req, res) => {
    if(!req.body.sabor || req.body.sabor == null || typeof req.body.sabor == undefined){
        res.status(422).json({message:'Sabor inválido!'})
    }
    if(!req.body.tamanho || req.body.tamanho == null || typeof req.body.tamanho == undefined){
        res.status(422).json({message:'Tamanho inválido!'})
    }
    if(!req.body.tamanho > 3 || req.body.tamanho < 1){
        res.status(422).json({message:'Não existe este tamanho de sorvete!'})
    }
    if(!req.body.cobertura || req.body.cobertura == null || typeof req.body.cobertura == undefined){
        res.status(422).json({message:'Cobertura inválida!'})
    }
    if(!req.body.fruta || req.body.fruta == null || typeof req.body.fruta == undefined){
        res.status(422).json({message:'Fruta inválida!'})
    }
    
    const novoSorvete = {
        sabor : req.body.sabor,
        tamanho : req.body.tamanho,
        cobertura : req.body.cobertura,
        fruta : req.body.fruta
    }
    new Sorvete(novoSorvete).save().then(() => {
        res.status(201).json({message:'Sorvete adicionado com sucesso'})
    }).catch((error) => {
        res.status(500).json({message:'Erro interno no servidor: ', error})
    })
})

router.put('/:id', (req, res) => {
    Sorvete.findOne({_id:req.params.id}).then(sorvete => {
        sorvete.sabor = req.body.sabor
        sorvete.tamanho = req.body.tamanho
        sorvete.cobertura = req.body.cobertura
        sorvete.fruta = req.body.fruta

        sorvete.save().then(() => {
            res.status(201).json({message:'Sorvete editado com sucesso!'})
        }).catch((error) => {
            res.status(500).json({message:'Erro interno no servidor!', error})
        })
    })
})

router.delete('/:id', (req, res) => {
    Sorvete.deleteOne({_id:req.params.id}).then(sorvete => {
        res.status(200).json({message:'Sorvete deletado com sucesso', idsorvete:sorvete._id})
    }).catch((error) => {
        res.status(500).json({message:'Erro interno no servidor', error})
    })
})

module.exports = router