const express = require('express')
const router = express.Router()
const passport = require('../../passport/index')
const User = require('../../models/User')
const errorHandler = require('./errorHandler');

router.post("/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
    console.log(req.user)
});

// router.get('/info', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err); }
//       if (!user) { res.send({message: info.message}); }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         return res.json(user);
//       });
//     })(req, res, next);
// });


router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        await new User(req.body).save()
        res.status(200).send({message: 'Authenticated'})
    }
    catch (error) {
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
            res.json(dbUser)
        })
    }
})

module.exports = router



   

