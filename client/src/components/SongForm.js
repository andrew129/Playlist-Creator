import React, {useRef, useEffect, useState} from 'react';
import { Button, Header, Segment, Form, Input } from 'semantic-ui-react';

export default function SongForm(props) {
    const focusPoint = useRef(null)
    const [songData, setSongData]= useState({
        playlistId: '',
        artist: '',
        selectedFile: null
    })
    const [showAddButton, setShowAddButton] = useState(false)
    const [chooseSong, setChooseSong] = useState(false)
    useEffect(() => {
        if (songData.playlistId && songData.artist && songData.selectedFile) {
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
            setSongData({...songData, selectedFile: e.target.files[0]})
            props.revealButton(true)
            setShowAddButton(true)
        }
        else return;
    }

    const addSong = () => {
        setSongData({...songData, playlistId: localStorage.getItem('playlistId')})
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
                        disabled={showAddButton && props.showAddButton ? 'disabled' : ''}
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
            </Form>
        </Segment>
    )
}