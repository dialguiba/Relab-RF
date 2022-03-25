const express = require('express');
const router = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth');

router.get('/',isNotLoggedIn, (req,res) => {
    res.render('public/index');
})
router.get('/acercade',isNotLoggedIn, (req,res) => {
    res.render('public/acercade');
})
router.get('/contacto',isNotLoggedIn, (req,res) => {
    res.render('public/contacto');
})

router.get('/inicio',isLoggedIn, (req,res) => {
    res.render('private/general/inicio');
})

router.get('/noticias',isLoggedIn, (req,res) => {
    res.render('private/general/noticias');
})

module.exports = router;