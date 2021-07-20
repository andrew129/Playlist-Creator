import React from 'react';
import { Table, Button, Header } from 'semantic-ui-react';

export default function SongTable(props) {

    const convertDuration = (duration) => {
        const decimalTime = (duration / 60).toFixed(2)
        return decimalTime.replace('.', ':')
    }
    console.log(props.songs)
        const songs = props.songs.map(song => {
            const indexOfDot = song.fileName
                .split('')
                .reverse()
                .indexOf('.')
            console.log(indexOfDot)
            const slicePoint = (song.fileName.length - indexOfDot) - 1
            console.log(slicePoint)
            return (
                <Table.Row>
                    <Table.Cell>{song.fileName.slice(0, slicePoint)}</Table.Cell>
                    <Table.Cell>{song.artist}</Table.Cell>
                    <Table.Cell>{song.fileType}</Table.Cell>
                    <Table.Cell>{convertDuration(song.duration)}</Table.Cell>
                </Table.Row>
            )
        })
    return (
        <>
            <>
            {(props.readyForErrors && props.songError) &&
                <Header style={{marginBottom: '30px'}} color='red' as='h2'>
                    {props.songError}
                </Header>
            }
            <div style={{width: '75%', display: 'flex', justifyContent: 'space-around', marginBottom: '30px'}}>
                <Button onClick={props.enable} style={{width: '45%'}} color='blue'>Add More Songs</Button>
                <Button onClick={props.finalize} style={{width: '45%'}} color='blue'>Finalize</Button>
            </div>
            <Table color='orange' inverted celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Song Title</Table.HeaderCell>
                        <Table.HeaderCell>Artist</Table.HeaderCell>
                        <Table.HeaderCell>FileType</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {songs}
                </Table.Body>
            </Table>
            </>
        </>
    )
}

