/*imports*/
const express = require('express')
const mongoose = require('mongoose')
const rotaSorvetes = require('../routes/Sorvetes')
require('dotenv').config

const app = express()
app.use('/sorvetes', rotaSorvetes)
const port = 3000

/*Config responsividade do json*/
app.use(express.json());

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.2stzryg.mongodb.net/?retryWrites=true&w=majority`).then( ()=> {
  console.log('Conectado ao banco de dados')
  app.listen(port, () => {
    console.log(`Porta ${port} aberta!`)
  })
}).catch(erro => {
  console.log('Erro ao conectar ao banco de dados: ', erro)
});