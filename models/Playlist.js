const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// define the User model schema
const PlaylistSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'name is already taken'],
        trim: true,
        required: [true, 'name field cannot be blank']
    },
    tags: {
        type: String,
        required: [true, 'tags field cannot be blank'],
        trim: true,
        validate: {
            validator: function(input) {
                let trimmedInput = input.trim()
                return trimmedInput.match(' ')
            },
            message: 'You must have a space between each word ex. (tag1 tag2 tag3)'
        }
    },
    genre: {
        type: String,
        required: [true, 'genres field cannot be blank'],
    },
    filesToUpload: {
        type: Array,
        default: []
    },
    songs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Song"
        }
    ]
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;