var cloudinary = require('cloudinary').v2

const dotenv = require('dotenv').config()
if (dotenv.error) {
    throw result.error
}
console.log(process.env.API_KEY)

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

module.exports = cloudinary