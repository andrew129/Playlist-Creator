const express = require('express')
const router = express.Router()
const db = require('../../models');
const errorHandler = require('./errorHandler');
const fileUploader = require('../../utils/fileUpload');
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs')

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

// router.post('/songs', fileUploader.single('song'), async (req, res, next) => {
//     const uploadedFile = await cloudinary.uploader.upload(req.file.path, 
//     {resource_type: 'video', public_id: req.file.originalName})

//     if (uploadedFile.duration + req.body.totalDuration > 2000) {
//         return res.status(400).send('Failed Upload: Total Length of Playlist must be no longer than an hour')
//     }

//     else {
//         try {
//             const newSong = {
//                 fileName: req.file.originalname.slice(0, 1).toUpperCase() + req.file.originalname.slice(1),
//                 fileType: req.file.mimetype,
//                 filePath: uploadedFile.secure_url,
//                 artist: req.body.artist.slice(0, 1).toUpperCase() + req.body.artist.slice(1),
//             }
//             const createdSong = await db.Song.create(newSong)
//             const updatedPlaylist = await db.Playlist.findOneAndUpdate({
//                 _id: req.body.playlistId
//             }, {
//                 $push: {
//                     songs: createdSong._id
//                 }},
//                 { new: true, runValidators: true }
//             )
//             res.status(200).json(updatedPlaylist)
//         }
//         catch(err) {
//             console.log(err)
//             res.status(400).json(errorHandler(err))
//         }
//     }
// })

router.post('/songs', fileUploader.single('song'), async (req, res) => {
    if (req.body.duration + req.body.totalDuration > 3600) {
        return res.status(400).send('Failed Upload: Total Length of Playlist must be no longer than an hour')
    }
    else {
        try {
            const newSong = {
                fileName: req.file.originalname.slice(0, 1).toUpperCase() + req.file.originalname.slice(1),
                fileType: req.file.mimetype,
                artist: req.body.artist.slice(0, 1).toUpperCase() + req.body.artist.slice(1),
                duration: req.body.duration
            }
            const createdSong = await db.Song.create(newSong)
            console.log(createdSong)
            const updatedPlaylist = await db.Playlist.findOneAndUpdate({
                _id: req.body.playlistId
            }, {
                $push: {
                    songs: createdSong._id,
                    filesToUpload: req.file
                },
                },
                { new: true, runValidators: true }
            )
            res.status(200).json(updatedPlaylist)
        }
        catch(err) {
            console.log(err.message)
            // res.status(400).json(errorHandler(err))
        }
    }
})

router.post('/uploadSongs', async (req, res) => {
    console.log(req.body.files)
    try {
        let uploadRes = []
        let multiSongUpload = new Promise(async (resolve, reject) => {
            for (let i = 0; i < req.body.files.length; i++) {
                const { path } = req.body.files[i]
                await cloudinary.uploader.upload_large(path, 
                    {resource_type: 'video'}
                    , async function(error, result) {
                    if (result) {
                        uploadRes.push(result)
                        await db.Song.findOneAndUpdate(
                            {
                                fileName: req.body.files[i].originalname.slice(0, 1).toUpperCase() +
                                req.body.files[i].originalname.slice(1)
                            }, {
                                filePath: result.secure_url
                            }
                        )
                        if (i === req.body.files.length - 1) {
                            resolve(uploadRes)
                        }
                    }
                    else if(error) {
                        reject(error)
                    }
                })
            }
        })
        let upload = await multiSongUpload
        res.status(200).json(upload)
    }
    catch(err) {
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})


router.get('/:id', async (req, res) => {
console.log("id" + req.params.id)
   const foundPlaylist = await db.Playlist.findById(req.params.id)
   .populate('songs')
   res.json(foundPlaylist)
})


module.exports = router;

// set complete to true in the database when you click on finalize otherwise complete is false
// display complete and incomplete playlists on users playlist page
// send files to be uploaded to server