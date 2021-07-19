const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
// define the User model schema
const UserSchema = new Schema({
    "First Name": {
        type: String,
        required: [true, 'First Name is required'],
        trim: true
    },
    "Last Name": {
        type: String,
        required: [true, 'Last Name is required'],
        trim: true
    },
    "Email": {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'an account with this email already exists'],
        trim: true,
        validate: {
            validator: function(input) {
              return /^[^\s@]+@[^\s@]+$/.test(input);
            },
            message: 'Please enter a valid email address'
        },
    },
    "Password": {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [6, 'Password is too short'],
        maxLength: [128, 'Password is too long']
    },
    createdPlaylists: [
        {
          type: Schema.Types.ObjectId,
          ref: "Playlist"
        }
    ]
});

UserSchema.methods = {
  checkPassword: function(inputPassword) {
    console.log("line 45" + inputPassword)
    console.log(this.Password)
    return bcrypt.compareSync(inputPassword, this.Password);
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10);
  }
};

// Define hooks for pre-saving
UserSchema.pre("save", function(next) {
  if (!this.Password) {
    console.log("models/user.js =======NO PASSWORD PROVIDED=======");
    next();
  } else {
    console.log("models/user.js hashPassword in pre save");
    this.Password = this.hashPassword(this.Password);
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;