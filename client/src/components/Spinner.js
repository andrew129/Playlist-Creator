import React from 'react';
import {Loader} from 'semantic-ui-react';


export default function Spinner() {
    return (
        <Loader style={{marginTop: '15px'}} size='big' active inline='centered'>
            Uploading Song
        </Loader>
    )
}