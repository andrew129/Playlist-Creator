import React from 'react';
import {Segment, Header, Button, Reveal, Image} from 'semantic-ui-react';

export default function PlaylistDisplay(props) {
    console.log(props)
    const playlists = props.playlists.filter(playlist => 
        props.finalized === playlist.finalized
    ).map((playlist, i) => 
            !playlist.finalized ?
            <Segment style={{marginRight: '20px', marginBottom: '20px', marginTop: 0}} stacked color='blue'> 
                <Header style={{margin: '0px, 0px, 5px, 0px', padding: 0}} dividing color='orange' size='large'>Finished Playlist {`${i + 1}`}</Header>
                <Header style={{margin: '8px', margin: 0, padding: 0}} as='h4'>{playlist.filesToUpload.length} Song(s) ready to be uploaded</Header>
                <Button compact color='blue' size='large'>Click Here to Finish Your Playlist</Button>
            </Segment>
            :  
            <Reveal style={{background: 'red'}} animated='fade'>
                <Reveal.Content visible>
                    <div style={{width: '250px', height: '250px', boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)', borderRadius: '15px'}}>
                        <img style=
                        {{height: '100%', 
                        width: '100%',
                        borderRadius: '15px',
                        filter: 'brightness(70%)'
                        }}
                    src={playlist.imageUrl} />
                        <div 
                        style=
                        {{width: '100%', 
                        height: '20%', 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}>
                        <Header as='h1' style={{color: 'white'}}>{playlist.name}</Header>
                        <p style={{color: 'white'}}>{playlist.songs.length} songs in playlist</p>
                        </div>
                        <p style={{position: 'absolute', top: '90%', left: '50%', transform: 'translateX(-50%)', color: 'white'}}>{playlist.genre.toUpperCase()}</p>
                    </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                <div style={{width: '250px', height:  '250px', borderRadius: '15px', boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)'}}>
                        <img style=
                        {{height: '100%', 
                        width: '100%',
                        borderRadius: '15px'
                        }} 
                    src={playlist.imageUrl} />
                        <div 
                        style=
                        {{width: '100%', 
                        height: '20%', 
                        opacity: 0.7,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}>
                        <Header as='h1' color='orange'>{playlist.name}</Header>
                        <Button style={{marginTop: '10px'}} size='large' color='blue'>Listen To this Playlist</Button>
                        </div>
                    </div>
                </Reveal.Content>
            </Reveal>
        )
    return <div style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
        {playlists}
    </div>
}