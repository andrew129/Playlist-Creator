const express = require('express')
const router = express.Router()
const db = require('../../models');
const errorHandler = require('./errorHandler');
const fileUploader = require('../../utils/fileUpload');
const cloudinary = require('../../utils/cloudinary');

router.post('/', async (req, res) => {
    try {
        const createdPlaylist = await db.Playlist.create(req.body)
        const updatedUser = await db.User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $push: {
                createdPlaylists: createdPlaylist._id
            }},
            { new: true, runValidators: true }
        )
        console.log(updatedUser)
        res.json(createdPlaylist)
    }
    catch (err) {
        console.log(errorHandler(err))
        res.status(400).json(errorHandler(err))
    }
})

router.post('/songs', fileUploader.single('song'), async (req, res, next) => {
    console.log(req.file)
    // cloudinary.v2.uploader.upload(file, options, callback);
    const uploadedFile = await cloudinary.uploader.upload(req.file.path, 
    {resource_type: 'video', public_id: req.file.originalName})
    const newSong = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: uploadedFile.secure_url,
        artist: req.body.artist,
        duration: uploadedFile.duration
    }
    try {
        const createdSong = await db.Song.create(newSong)
        const updatedPlaylist = await db.Playlist.findOneAndUpdate({
            _id: req.body.playlistId
        }, {
            $push: {
                songs: createdSong._id
            }},
            { new: true, runValidators: true }
        )
        res.status(200).json(updatedPlaylist)
    }
    catch(err) {
        console.log(err)
        res.status(400).json(errorHandler(err))
    }
})


module.exports = router;