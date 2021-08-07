const express = require('express')
const router = express.Router()
const db = require('../../models');
const errorHandler = require('./errorHandler');
const fileUploader = require('../../utils/fileUpload');
const cloudinary = require('../../utils/cloudinary');
const axios = require('axios')
const fs = require('fs')

// export default axios.create({
//     baseURL: 'https://api.unsplash.com',
//     headers: {
//         Authorization: 'Client-ID df308ab04419a6fab1080bb6a1ad07a725dc5bd36b6bc21e2c7837da6274da34'
//     }
// })

router.post('/', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.unsplash.com/search/photos`, {
            headers: {
                Authorization: 'Client-ID df308ab04419a6fab1080bb6a1ad07a725dc5bd36b6bc21e2c7837da6274da34'
            },
            params: {
                query: req.body.genre
            }
        })
        const randomImage = getRandom(data.results, req.body.genre)
        req.body.imageUrl = randomImage.urls.regular
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
        console.log(err.message)
        console.log(errorHandler(err))
        res.status(400).json(errorHandler(err))
    }
})

function getRandom(imageArr, genre) {
    const relevantImages = imageArr.filter(image => {
        const relevantTags = image.tags.filter(tag => 
            tag.title === 'music' || tag.title === genre
        )
        if (relevantTags.length) {
            return true
        }
    })
    return relevantImages[Math.floor(Math.random() * relevantImages.length)]
}


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

router.put('/uploadSongs/:id', async (req, res) => {
    try {
        let uploadRes = []
        console.log(req.body.files)
        let multiSongUpload = new Promise(async (resolve, reject) => {
            for (let i = 0; i < req.body.files.length; i++) {
                console.log(req.body.files[i])
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
                                filePath: result.secure_url,
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
        console.log(upload)
        const finishedPlaylist = await db.Playlist.findOneAndUpdate({
            _id: req.params.id
        }, {
           finalized: true,
           filesToUpload: []
        })
        res.status(200).json(finishedPlaylist)
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
