import React from 'react';
import {Grid, Header} from 'semantic-ui-react'
import RegisterForm from '../../RegisterForm/RegisterForm';

export default function Register() {
    return (
        <div>
            <Grid>
                <Grid.Column width={5}>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Header style={{fontSize: '40px', marginBottom: '35px'}} as='h1' color='blue'>
                        Create An Account
                    </Header>
                    <RegisterForm />
                </Grid.Column>
                <Grid.Column width={5}>
                </Grid.Column>
            </Grid>
        </div>
    )
}