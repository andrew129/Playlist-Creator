import React, {useRef, useEffect, useState} from 'react';
import { Button, Header, Segment, Form, Input } from 'semantic-ui-react';

export default function SongForm(props) {
    const focusPoint = useRef(null)
    const [songData, setSongData]= useState({
        playlistId: '',
        artist: '',
        duration: '',
        selectedFile: null
    })
    const [showAddButton, setShowAddButton] = useState(false)
    const [chooseSong, setChooseSong] = useState(false)
    const [songErr, setSongErr] = useState('')
    useEffect(() => {
        if (songData.playlistId && songData.artist && songData.selectedFile && songData.duration) {
            props.createSong(songData)
            setChooseSong(false)
            setShowAddButton(true)
            setSongData({
                playlistId: '',
                artist: '',
                selectedFile: null
            })
        }
        else if (songData.artist) {
            setChooseSong(true)
        }
    }, [songData])

    const fileChange = e => {
        if (e.target.files[0]) {

            const file = e.target.files[0];
            const reader = new FileReader();
        
            reader.onload = function (event) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
                audioContext.decodeAudioData(event.target.result, function(buffer) {
                    const duration = buffer.duration;
                    
                    setSongData({...songData, duration, selectedFile: file})
                });
            };
        
            // In case that the file couldn't be read
            reader.onerror = function (event) {
                console.error("An error ocurred reading the file: ", event);
            };
        
            reader.readAsArrayBuffer(file);
            props.revealButton(true)
            setShowAddButton(true)
        }
        else {
            return;
        }
    }

    const addSong = () => {
        console.log(songData.selectedFile.type.includes('wav')) 
        if (songData.selectedFile.type.includes('mp3') || songData.selectedFile.type.includes('wav')) {
            console.log(songData.selectedFile.type)
            setSongData({...songData, playlistId: localStorage.getItem('playlistId')})
            setSongErr('')
        }
        else {
            setSongErr('Only mp3 and wav files are accepted')
            return;
        }
    }
    return (
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
                        <Form.Field>
                            <input type='file' onChange={fileChange} ref={focusPoint}/>
                        </Form.Field>
                        {(showAddButton && props.showAddButton) &&
                            <Button style={{width: '100%'}} onClick={addSong}>Add Song</Button>
                        }
                    </>
                }
                {(songErr) &&
                    <Header as='h3' color='red'>{songErr ? songErr : ''}</Header>
                }
            </Form>
        </Segment>
    )
}