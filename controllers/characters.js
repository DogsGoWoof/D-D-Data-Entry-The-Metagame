const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        res.render('characters/index.ejs', {
            characters: currentUser.characters,
        });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.characters.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/characters`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/new', async (req, res) => {
    res.render('characters/new.ejs');
});

router.get('/:characterId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
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
        const currentUser = await User.findById(req.session.user._id);
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
        const currentUser = await User.findById(req.session.user._id);
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
        const currentUser = await User.findById(req.session.user._id);
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
