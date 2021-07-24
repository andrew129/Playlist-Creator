import React from 'react';
import { useEffect, useState, useContext } from 'react';
import API from '../../../utils/API';
import UserContext from '../../../utils/UserContext';
import { Button, Header, Grid } from 'semantic-ui-react';
import SongTable from '../../SongTable/SongTable';
import PlaylistForm from '../../PlaylistForm';
import SongForm from '../../SongForm';
import Spinner from '../../Spinner';
import axios from 'axios';

export default function PlaylistCreator() {
    const user = useContext(UserContext)
    const [showPlaylistForm, setShowPlaylistForm] = useState(false)
    const [showSongForm, setShowSongForm] = useState(false)
    const [songs, setSongs] = useState([])
    const [readyForErrors, setReadyForErrors] = useState(false)
    const [errors, setErrors] = useState({})
    const [songError, setSongError] = useState('')
    const [songAdded, setSongAdded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showAddButton, setShowAddButton] = useState(true)
    const [complete, setComplete] = useState(false)

    useEffect(() => {
        if (errors) {
            setReadyForErrors(true)
        }
        else if (songError) {
            setReadyForErrors(true)
        }
        else {
            setReadyForErrors(false)
        }
    }, [errors, songError])

    useEffect(() => {
        if (!loading && songAdded) {
            getPlaylist()
        }
    }, [loading, songAdded])

    useEffect(() => {
        if (complete) {
            uploadSongs()
        }
    }, [complete])

    const getPlaylist = async () => {
        const playlist = await axios.get('/api/playlists/' + localStorage.getItem('playlistId'))
        const playlistSongs = playlist.data.songs
        if (playlistSongs.length > 0) {
            setSongs(playlistSongs)
        }
        else {
            return;
        }
    }

    const uploadSongs = async () => {
        const { data } = await axios.get('/api/playlists/' + localStorage.getItem('playlistId'))
        const uploadSongs = await axios.post('/api/playlists/uploadSongs', {files: data.filesToUpload})
        console.log(uploadSongs)
    }

    const createSong = async (songData) => {
        setSongAdded(true)
        setLoading(true)
        let songFormObj = new FormData()
        songFormObj.append("song", songData.selectedFile)
        songFormObj.append("artist", songData.artist)
        songFormObj.append("playlistId", songData.playlistId)
        songFormObj.append("duration", songData.duration.toFixed(2))
        try {
            const { data } = await axios.get('/api/playlists/' + localStorage.getItem('playlistId'))
            if (data) {
                const totalDuration = data.songs.reduce((acc, song) => acc + song.duration, 0)
                songFormObj.append("totalDuration", totalDuration)
            }
            await axios.post('/api/playlists/songs', songFormObj)
            setLoading(false)
        }
        catch(error) {
            setLoading(false)
            setSongError(error.response.data)
        }
    }

    const revealForm = () => setShowPlaylistForm(true)

    const createPlaylist = async (e, formData) => {
        e.preventDefault()
        try {
            const { data } = await API.createPlaylist(formData)
            if (data) {
                setShowSongForm(true)
                setShowPlaylistForm(false)
                localStorage.setItem('playlistId', data._id)
            }
            setErrors({})
        }
        catch (error) {
            setErrors(error.response.data)
        }
    }

    const finalize = () => {
        console.log('finalize')
        setComplete(true)
    }

    const revealButton = (value) => {
        setShowAddButton(value)
    }

    const enable = () => {
        setSongError('')
        setShowAddButton(false)
    }

    return (
        <div>
            {(user) &&
                <Grid>
                    <Grid.Column width={4}>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {(user.data.createdPlaylists.length === 0 && !showPlaylistForm && !showSongForm) &&
                            <>
                                <Header style={{fontSize: '34px'}} as='h1'>No Playlists here yet, Create your first</Header>
                                <Button onClick={revealForm} size='huge' style={{width: '50%'}} color='orange'>Create New Playlist</Button>
                            </>
                        }
                        {(user.data.createdPlaylists.length > 0 && !showPlaylistForm && !showSongForm) &&
                            <>
                                <h1>What Would You like to do?</h1>
                                <div style={{width: '100%', display: 'flex'}}>
                                    <Button onClick={revealForm} size='huge' style={{width: '50%'}} color='orange'>Create New Playlist</Button>
                                    <Button 
                                        size='huge' 
                                        style={{width: '50%'}} 
                                        color='blue' 
                                        href={`/users/${user.data.firstName}-${user.data.lastName}/playlists`}
                                    >
                                    View My Playlists
                                    </Button>
                                </div>
                            </>
                        }
                        {(showPlaylistForm && !showSongForm) &&
                            <>
                                <PlaylistForm
                                    createPlaylist={createPlaylist} 
                                    readyForErrors={readyForErrors}
                                    errors={errors}
                                />
                            </>
                        }
                        {(!showPlaylistForm && showSongForm) &&
                            <>  
                                <h3 style={{color: 'red'}}>Note: You Can't Upload more than an hour worth of songs!!</h3>
                                <SongForm createSong={createSong} revealButton={revealButton} showAddButton={showAddButton}  />
                            </>
                        }
                    </Grid.Column>
                    <Grid.Column width={4}>
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={12} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px'}}>
                        {(!loading && songAdded) && 
                            <>
                                <SongTable 
                                    finalize={finalize} 
                                    songs={songs} 
                                    enable={enable}
                                    readyForErrors={readyForErrors}
                                    songError={songError}
                                />
                            </>
                        }
                        {(loading && songAdded) &&
                            <Spinner />
                        }
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                </Grid>
            }
            {(!user) &&
                <>
                    <Header as='h1' style={{fontSize: '40px'}}>You need to login or create an account to view this content</Header>
                    <Button style={{width: '75%'}} size='huge' href='/login' color='red'>Login</Button>
                </>
            }
        </div>
    )
}