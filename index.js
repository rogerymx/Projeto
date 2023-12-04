/* Verificação se as dependências estão instaladas */
const fs = require('fs');
var path = require('path');
const { execSync } = require('child_process');

const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));

if (!nodeModulesExists) {
  console.log('Instalando dependências, por favor aguarde...');
  execSync('npm install --force-sync');
}

/* Imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const rotaSorvetes = require('./routes/Sorvetes')
const rotaUsers = require('./routes/Users')
const rotaPedidos = require('./routes/Pedidos')
const rotaInstall = require('./routes/Install')
const rotaAdmin = require('./routes/Admin')
const bodyparser = require('body-parser')
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

const app = express()
const port = 3000

/*Config responsividade do json*/
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.json());

/* Rotas */
app.use('/sorvetes', rotaSorvetes)
app.use('/users', rotaUsers)
app.use('/pedidos', rotaPedidos)
app.use('/install', rotaInstall)
app.use('/admin', rotaAdmin)

/* Conexao e abertura da porta 3000 */
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.2stzryg.mongodb.net/?retryWrites=true&w=majority`).then( ()=> {
  console.log('Conectado ao banco de dados!')
  app.listen(port, () => {
    console.log(`Porta ${port} aberta!`)
  })
}).catch(erro => {
  console.log('Erro ao conectar ao banco de dados: ', erro)
});