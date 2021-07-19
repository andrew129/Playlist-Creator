import React, {useState} from 'react';
import {Grid, Header} from 'semantic-ui-react'
import LoginForm from '../../LoginForm/LoginForm';

export default function Login() {
    const [message, setMessage] = useState('')
    function errorHandler(error) {
        setMessage(error)
    }
    return (
        <div>
            <Grid>
                <Grid.Column width={5}>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Header style={{fontSize: '40px', marginBottom: '35px'}} as='h1' color='blue'>
                        Welcome Back!!
                    </Header>
                    <LoginForm errorHandler={errorHandler} />
                    <Header color='red' as='h3x'>{message}</Header>
                </Grid.Column>
                <Grid.Column width={5}>
                </Grid.Column>
            </Grid>
        </div>
    )
}