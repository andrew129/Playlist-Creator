import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {Grid, Header, Segment, Button} from 'semantic-ui-react';
import PlaylistDisplay from '../PlaylistDisplay';

export default function CreatedPlaylists() {
    const { name } = useParams()
    const id = name.split('-')[2]
    const [userData, setUserData] = useState([])

    useEffect(() => {
        getUserPlaylistData()
    }, [])


    const getUserPlaylistData = async () => {
        const { data } = await axios.get('/api/users/playlistData/' + id)
        const { createdPlaylists } = data
        if (data) setUserData(createdPlaylists)
    }

    return (
        <Grid style={{marginBottom: '150px'}}>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} width={12}>
                <Header style={{marginBottom: '30px'}} as='h1' color='black'>Unfinished Playlists</Header>
                <PlaylistDisplay playlists={userData} finalized={false} />
            </Grid.Column>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} width={12}>
                <Header style={{marginBottom: '30px'}} as='h1' color='black'>Finished Playlists</Header>
                <PlaylistDisplay playlists={userData} finalized={true} />
            </Grid.Column>
            <Grid.Column width={2}></Grid.Column>
        </Grid>
    )
}