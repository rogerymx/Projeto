const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/User')
const User = mongoose.model('users')

router.get("/",(req, res) => {
    
})

module.exports(router)