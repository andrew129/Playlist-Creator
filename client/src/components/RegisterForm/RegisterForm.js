import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { useState, useEffect } from 'react'
import API from '../../utils/API';

const fieldNames = ['First Name', 'Last Name', 'Email', 'Password']

export default function RegisterForm() {

    const [info, setInfo] = useState({
        "First Name": '',
        "Last Name": '',
        "Email": '',
        "Password": ''
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
            {fieldNames.map(fieldName => (
                <Form.Field 
                    placeholder={`Enter ${fieldName}`} 
                    style={{height: '40px'}} 
                    onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })} 
                    name={fieldName} 
                    control={Input} 
                    label={fieldName}
                    className='form-field' 
                    error={readyForErrors ? errors[fieldName] : ''}
                />
            ))}
            <Button style={{width: '100%', marginTop: '20px'}} size='large' color='orange' type='submit'>Register</Button>
        </Form>
    )
}