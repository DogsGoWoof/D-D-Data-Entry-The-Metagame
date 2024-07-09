const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.render('users/index.ejs', {
            users: allUsers,
        });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.get('/:userId/roster', async (req, res) => {
    try {
        const userInDatabase = await User.findById(req.params.userId);
        res.render('users/characters.ejs', {
            user: userInDatabase,
        });
    } catch (error) {
        console.log(error)
        res.redirect('/users')
    }
});

module.exports = router;