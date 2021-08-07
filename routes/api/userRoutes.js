const express = require('express')
const router = express.Router()
const passport = require('../../passport/index')
const User = require('../../models/User')
const errorHandler = require('./errorHandler');

router.post("/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
    console.log("line 9" + req.user)
});

router.post('/register', async (req, res) => {
    try {
        await new User(req.body).save()
        res.status(200).send({message: 'Authenticated'})
    }
    catch (error) {
        console.log(error)
        res.status(400).json(errorHandler(error))
    }
})

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get('/info', function(req, res) {
    console.log('user' + req.user)
    if (req.user) {
        User.findOne(
            {
                _id: req.user._id
            }
        ).populate({
            path: 'createdPlaylists',
            populate: {
                path: 'songs',
                model: 'Song'
            }
        }).then(dbUser => {
            console.log("line 42" + dbUser)
            res.json(dbUser)
        })
    }
})

router.get('/playlistData/:id', async function(req, res) {
    console.log(req.params.id)
    try {
        const userPlaylistData = await User.findOne(
            {
               _id: req.params.id 
            }
        ).populate({
            path: "createdPlaylists",
            populate: {
               path: "songs" 
            }
        })
        console.log(userPlaylistData)
        res.status(200).json(userPlaylistData)
    }
    catch (err) {
        console.log(err.message)
    }
})

module.exports = router



   

