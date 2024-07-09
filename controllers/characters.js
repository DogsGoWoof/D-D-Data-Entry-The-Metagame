const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        res.render('characters/index.ejs', {
            user: currentUser, // res.local.user only contains username key-value object
                                // findOne async necessary to retrieve and use _id property of user
            characters: currentUser.characters,
        });
        // res.render('characters/index.ejs');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        currentUser.characters.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/characters`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/new', async (req, res) => {
    const currentUser = await User.findOne(req.session.user);
    res.render('characters/new.ejs', {
        user: currentUser,
    });
});

router.get('/:characterId', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        const character = currentUser.characters.id(req.params.characterId);
        res.render('characters/show.ejs', {
            character: character,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.delete('/:characterId', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        currentUser.characters.id(req.params.characterId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/characters`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/:characterId/edit', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        const character = currentUser.characters.id(req.params.characterId);
        res.render('characters/edit.ejs', {
            character: character,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.put('/:characterId', async (req, res) => {
    try {
        const currentUser = await User.findOne(req.session.user);
        const character = currentUser.characters.id(req.params.characterId);
        character.set(req.body);
        await currentUser.save();
        res.redirect(
            `/users/${currentUser._id}/characters/${req.params.characterId}`
        );
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

module.exports = router;
