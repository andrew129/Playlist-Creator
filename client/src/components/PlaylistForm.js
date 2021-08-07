import React, {useState, useEffect} from 'react';
import { Button, Header, Segment, Form, Input, Select } from 'semantic-ui-react';
import GenreOptions from './pages/Playlist/genreOptions.json'

const fieldNames = ['Name', 'Genre', 'Tags']


export default function PlaylistForm(props) {

    const [formData, setFormData] = useState({
        name: 'chicken',
        tags: 'chicken',
        genre: 'chicken'
    })

       

    const handleChange = e => 
        setFormData({...formData, [e.target.name]: e.target.value})

    const selectGenre = (e, data) => 
        setFormData({...formData, genre: data.value})
    
    return (
        <Segment raised>
            <Header as='h1' color='blue'>Create a New Playlist</Header>
                <Form size='large' onSubmit={(e) => props.createPlaylist(e, formData)}>
                    {fieldNames.map((fieldName, i) => (
                        <Form.Field 
                            control={i === 1 ? Select : Input}
                            label={`Playlist ${fieldName}`} 
                            className='form-field'
                            onChange={i === 1 ? selectGenre : handleChange}
                            options={i === 1 ? GenreOptions : ''}
                            name={fieldName.toLowerCase()}
                            placeholder= {`Enter Playlist ${fieldName}...`}
                            error={props.readyForErrors ? props.errors[fieldName.toLowerCase()] : ''}
                        />
                    ))}
                    <Button color='orange' type='submit' style={{width: '100%', fontSize: '15px'}}>Create Playlist</Button>
                </Form>
        </Segment>
    )
}
