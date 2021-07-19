import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import './style.css';
import { useState } from 'react';
import {useHistory} from 'react-router-dom'
import API from '../../utils/API';
import axios from 'axios';

export default function LoginForm(props) {
    const history = useHistory()

    const [info, setInfo] = useState({
        email: '',
        password: ''
    })

    const LoginUser = async e => {
        e.preventDefault()
        try {
            const response = await API.loginUser(info)
            console.log(response)
            history.push('/')
            window.location.reload()
        }
        catch (error) {
            console.log('status', error.response.status)
            error.response.status === 401 ? props.errorHandler('Invalid Email or Password')
                : props.errorHandler(error.message)
        }
    }

    return (
        <Form size='large' onSubmit={LoginUser}>
            <Form.Field className='form-field'>
                <label>Email Address</label>
                <input name='email' style={{height: '40px'}} onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })} placeholder='Enter Email Address' />
            </Form.Field>
            <Form.Field className='form-field'>
                <label>Password</label>
                <input name='password' onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })} placeholder='Enter Password' type='password' />
            </Form.Field>
            <Button style={{width: '100%', marginTop: '20px'}} size='large' color='orange' type='submit'>Login</Button>
        </Form>
    )
}