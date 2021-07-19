const db = require('../models')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'Email',
		passwordField: 'Password',
	},
	function(Email, Password, done) {
		console.log("line 13" + Email)
    	console.log(Password)
		db.User.findOne({ Email: Email }, (err, user) => {
			console.log(user)
			if (err) {
        		console.log('normal error')
				return done(err)
			}

			if (!user) {
        		console.log("user doesn't exist")
				return done(null, false)
      		}
      
      		if (!user.checkPassword(Password)) {
				console.log('no match')
				console.log(user.checkPassword(Password))
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
