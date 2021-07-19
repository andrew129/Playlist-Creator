import React from 'react';
import { useEffect, useState } from 'react';
import API from '../../../utils/API';
import UserContext from '../../../utils/UserContext';
import { Button, Header, Grid, Segment, Form, Input, Select, Ref } from 'semantic-ui-react';
import { useContext, useRef } from 'react'
import GenreOptions from './genreOptions.json';
import SongTable from '../../SongTable/SongTable';
import axios from 'axios'
export default function PlaylistCreator() {
    const user = useContext(UserContext)
    console.log(user)
    const focusPoint = useRef(null)
    const [showPlaylistForm, setShowPlaylistForm] = useState(false)
    const [showSongForm, setShowSongForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        tags: '',
        genre: ''
    })
    const [songs, setSongs] = useState([])
    const [readyForErrors, setReadyForErrors] = useState(false)
    const [errors, setErrors] = useState({})
    const [chooseSong, setChooseSong] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [songData, setSongData]= useState({
        playlistId: '',
        artist: ''
    })
    const [songAdded, setSongAdded] = useState(false)
    const [showAddButton ,setShowAddButton] = useState(false)

    useEffect(() => {
        if (errors) {
            setReadyForErrors(true)
        }
        else {
            setReadyForErrors(false)
        }
    }, [errors])

    useEffect(() => {
        console.log(songData.playlistId)
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
        let songFormObj = new FormData()
        songFormObj.append("song", selectedFile)
        songFormObj.append("artist", songData.artist)
        songFormObj.append("playlistId", songData.playlistId)
        try {
            const updatedPlaylist = await axios.post('/api/playlists/songs', songFormObj)
            console.log(updatedPlaylist)
        }
        catch(error) {
            console.log(error.response.data)
        }
    }

    const revealForm = () => setShowPlaylistForm(true)

    const createPlaylist = async (e) => {
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
        setChooseSong(false)
        setShowAddButton(false)
    }

    const selectGenre = (e, data) => setFormData({...formData, genre: data.value})

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
                            <Segment raised>
                                <Header as='h1' color='blue'>Create a New Playlist</Header>
                                <Form size='large' onSubmit={createPlaylist}>
                                    <Form.Field 
                                        control={Input}
                                        label='Playlist Name' 
                                        className='form-field'
                                        onChange={e => setFormData({...formData, 
                                        name: e.target.value})}
                                        placeholder= 'Enter Playlist Name...'
                                        error={readyForErrors ? errors['name'] : ''}
                                    />
                                    <Form.Field
                                        control={Select}
                                        style={{marginBottom: '15px'}} 
                                        className='form-field' 
                                        onChange={selectGenre} 
                                        placeholder='Select the genre'
                                        label='Genre'
                                        options={GenreOptions}
                                        error={readyForErrors ? errors['genre'] : ''}
                                    />
                                    <Form.Field 
                                        className='form-field'
                                        error={readyForErrors ? errors['tags'] : ''}
                                        onChange={e => setFormData({...formData, 
                                        tags: e.target.value})}
                                        label='Playlist Tags'
                                        labelPosition= 'right'
                                        control={Input}
                                        icon='tags'
                                        iconPosition='left'
                                        placeholder='Enter tags seperated by a space ex. (tag1 tag2)'
                                    />
                                    <Button color='orange' type='submit' style={{width: '100%', fontSize: '15px'}}>Create Playlist</Button>
                                </Form>
                            </Segment>
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
                                                error={readyForErrors ? errors['artist'] : ''}
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
                        {(songAdded) && 
                            <SongTable 
                                finalize={finalize} 
                                songs={songs} 
                                enable={enable}
                            />
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