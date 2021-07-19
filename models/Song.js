const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// define the User model schema
const SongSchema = new Schema({
    fileName: {
       type: String,
       trim: true
    },
    filePath: {
        type: String,
        trim: true 
    },
    fileType: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        trim: true,
        min: [10, 'Song must be at least 10 seconds long'],
        max: [600, "Song can't be longer than 10 mins"]
    },
    artist: {
        type: String,
        trim: true,
        required: [true, 'artist field cannot be blank']
    }
});

const Playlist = mongoose.model('Song', SongSchema);

module.exports = Playlist;

// cloudinary.v2.uploader.upload("sample_spreadsheet.xls", 
//   { resource_type: "auto" }, 
//   function(error, result) {console.log(result, error); });