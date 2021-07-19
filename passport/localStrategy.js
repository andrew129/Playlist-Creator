const db = require('../models')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
    console.log(password)
		db.User.findOne({ email: email }, (err, user) => {
			if (err) {
        		console.log('normal error')
				return done(err)
			}

			if (!user) {
        		console.log("user doesn't exist")
				return done(null, false)
      		}
      
      		if (!user.checkPassword(password)) {
        		console.log('no match')
				return done(null, false)
			}
	
      		else {
        		console.log('success')
        		return done(null, user)
      		}
		})
	}
)

module.exports = strategy
