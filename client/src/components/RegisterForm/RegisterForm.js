import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { useState, useEffect } from 'react'
import API from '../../utils/API';

export default function RegisterForm() {

    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const [readyForErrors, setReadyForErrors] = useState(false)

    useEffect(() => {
        setReadyForErrors(true)
    }, [errors])

    const registerUser = async e => {
        e.preventDefault()
        try {
            const response = await API.registerUser(info)
            console.log(response)
            window.location.href = '/login'
        }
        catch (error) {
            console.log(error.response.data)
            setErrors(error.response.data)
        }  
    }

    return (
        <Form size='large' onSubmit={registerUser}>
            <Form.Field 
                placeholder='Enter First Name' 
                style={{height: '40px'}} 
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })} 
                name='firstName' 
                control={Input} 
                label='First Name'
                className='form-field' 
                error={readyForErrors ? errors['firstName'] : ''}
            />
            <Form.Field 
                name='lastName' 
                control={Input} 
                label='Last Name' 
                error={readyForErrors ? errors['lastName'] : ''}
                className='form-field'
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })}
                style={{height: '40px'}} 
                placeholder='Enter Last Name'
            />
            <Form.Field 
                name='email' 
                control={Input} 
                label='Email' 
                error={readyForErrors ? errors['email'] : ''}
                className='form-field'
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })}
                style={{height: '40px'}}
                placeholder='Enter Email Address'
            />
            <Form.Field 
                control={Input} 
                label='Password' 
                error={readyForErrors ? errors['password'] : ''}
                className='form-field'
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })}
                name='password'
                placeholder='Enter Password'
            />
            <Button style={{width: '100%', marginTop: '20px'}} size='large' color='orange' type='submit'>Register</Button>
        </Form>
    )
}