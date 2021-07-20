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
        res.json(createdPlaylist)
    }
    catch (err) {
        console.log(errorHandler(err))
        res.status(400).json(errorHandler(err))
    }
})

router.post('/songs', fileUploader.single('song'), async (req, res, next) => {

    const uploadedFile = await cloudinary.uploader.upload(req.file.path, 
    {resource_type: 'video', public_id: req.file.originalName})

    if (uploadedFile.duration + req.body.totalDuration >2000) {
        return res.status(400).send('Playlists are Limited to One Hour')
    }

    else {
        try {
            const newSong = {
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: uploadedFile.secure_url,
                artist: req.body.artist,
                duration: uploadedFile.duration
            }
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
            res.status(400).json(errorHandler(err))
        }
    }
})

router.get('/:id', async (req, res) => {
    console.log("id" + req.params.id)
   const foundPlaylist = await db.Playlist.findById(req.params.id)
   .populate('songs')
   res.json(foundPlaylist)
})


module.exports = router;