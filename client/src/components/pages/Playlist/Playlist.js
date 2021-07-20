import React from 'react';
import { useEffect, useState } from 'react';
import API from '../../../utils/API';
import UserContext from '../../../utils/UserContext';
import { Button, Header, Grid, Segment, Form, Input, } from 'semantic-ui-react';
import { useContext, useRef } from 'react'
import SongTable from '../../SongTable/SongTable';
import PlaylistForm from '../../PlaylistForm';
import axios from 'axios';

export default function PlaylistCreator() {
    const user = useContext(UserContext)
    const focusPoint = useRef(null)
    const [showPlaylistForm, setShowPlaylistForm] = useState(false)
    const [showSongForm, setShowSongForm] = useState(false)
    const [songs, setSongs] = useState([])
    const [readyForErrors, setReadyForErrors] = useState(false)
    const [errors, setErrors] = useState({})
    const [songError, setSongError] = useState('')
    const [chooseSong, setChooseSong] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [songAdded, setSongAdded] = useState(false)
    const [songData, setSongData]= useState({
        playlistId: '',
        artist: ''
    })
    const [loading, setLoading] = useState(false)
    const [showAddButton, setShowAddButton] = useState(false)

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
    }, [errors, songError, loading])
    
    useEffect(() => {
        if (selectedFile && songData.playlistId && songData.artist) {
            createSong()
            setSongData({
                playlistId: '',
                artist: ''
            })
        }
        else if (songData.artist) {
            setChooseSong(true)
        }
    }, [selectedFile, songData])

    const addSong = e => {
        e.preventDefault()
        console.log(localStorage.getItem('playlistId'))
        setSongData({...songData, playlistId: localStorage.getItem('playlistId')})
        setSongs([...songs, songData])
        setSongAdded(true)
        setShowAddButton(true)
        setChooseSong(false)
    }

    const createSong = async () => {
        console.log('heelo')
        setLoading(true)
        let songFormObj = new FormData()
        songFormObj.append("song", selectedFile)
        songFormObj.append("artist", songData.artist)
        songFormObj.append("playlistId", songData.playlistId)
        try {
            const { data } = await axios.get('/api/playlists/' + localStorage.getItem('playlistId'))
            if (data) {
                const totalDuration = sum(data.songs.map(({ duration }) => duration))
                songFormObj.append("totalDuration", totalDuration)
            }
            await axios.post('/api/playlists/songs', songFormObj)
            setLoading(false)
            console.log(response)
        }
        catch(error) {
            console.log(error.response.data)
            setLoading(false)
            setSongError(error.response.data)
        }
    }

    const sum = numberArr => {
        let sum = 0;
        for (let i = 0; i < numberArr.length; i++) {
            sum += numberArr[i]
        }
        return sum
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
        }
        catch (error) {
            console.log(error.response.data)
            setErrors(error.response.data)
        }
    }

    const finalize = () => {
        console.log('finalize')
    }

    const enable = () => {
        setSongError('')
        setChooseSong(false)
        setShowAddButton(false)
    }

    const fileChange = e => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setShowAddButton(true)
        }
        else return;
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
                            <PlaylistForm
                                createPlaylist={createPlaylist} 
                                readyForErrors={readyForErrors}
                                errors={errors}
                            />
                        }
                        {(!showPlaylistForm && showSongForm) &&
                            <Segment raised>
                                <Header as='h1' color='blue'>Add Songs to your Playlist</Header>
                                <Form size='large'>
                                        <>
                                            <Form.Field 
                                                control={Input}
                                                label='Artist Name' 
                                                className='form-field'
                                                onChange={e => setSongData({...songData, 
                                                artist: e.target.value})}
                                                placeholder= 'Enter Artist Name...'
                                                disabled={showAddButton ? 'disabled' : ''}
                                                value={songData.artist}
                                            />
                                        </>
                                    {(chooseSong) &&
                                    <>
                                        <Button
                                            style={{width: '50%'}}
                                            size='large'
                                            content="Choose Song"
                                            labelPosition="left"
                                            icon="file"
                                            onClick={() => focusPoint.current.click()}
                                            disabled={chooseSong ? '' : 'disabled'}
                                        />
                                        <Form.Field
                                            error={readyForErrors ? errors['songChoice'] : ''}
                                        >
                                            <input type='file' onChange={fileChange} ref={focusPoint}/>
                                        </Form.Field>
                                        {(showAddButton) &&
                                            <Button style={{width: '100%'}} onClick={addSong}>Add Song</Button>
                                        }
                                        </>
                                    }
                                </Form>
                            </Segment>
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
                            <p>loading...</p>
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