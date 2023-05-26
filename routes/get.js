const router = require("express").Router();
const verify = require('../verifyToken');
const User = require('../model/User');

router.get('/', verify, async (req, res) => {
    res.render('home', {title: "СЬЛРЖАЛСЧ чат"});
});

router.get('/registration', (req, res) => {
    res.render('registration', {title: "Registration"});
});

router.get('/login', (req, res) => {
    res.render('login', {title: "Login"});
});

module.exports = router;