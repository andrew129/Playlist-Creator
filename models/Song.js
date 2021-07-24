const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// define the User model schema
const SongSchema = new Schema({
    fileName: {
       type: String,
       trim: true,
    //    unique: [true, 'Filename has already been Taken!! Try another']
    },
    filePath: {
        type: String,
        trim: true,
        default: ''
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
