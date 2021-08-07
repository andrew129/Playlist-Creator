import React, {useContext} from 'react';
import { Menu, Icon, Header, Button, Dropdown } from 'semantic-ui-react';
import UserContext from '../../utils/UserContext';
import {useHistory} from 'react-router-dom';
import './style.css'
import API from '../../utils/API';

export default function MainMenu() {
    const user = useContext(UserContext)
    const history = useHistory()

    const logout = () => {
      API.logoutUser().then(() => window.location.reload())
    }

    return (
      <Menu className='main-menu' borderless size='massive'>
        <Menu.Item>
            <Header style={{color: 'white'}} as='h3'>
                <Icon name='magic' />
                <Header.Content style={{fontWeight: 'bolder'}}>Playlist Creator</Header.Content>
            </Header>
        </Menu.Item>
        <Menu.Menu position='right'>
          {(!user) &&
          <>
            <Menu.Item fitted>
            <Button style={{height: '42px', display: 'flex', alignItems: 'center'}} href='/login' icon color='blue' circular>
              <Icon name='sign-in' /> Login
            </Button>
        </Menu.Item>
        <Menu.Item style={{paddingLeft: '12px'}}>
            <Button style={{height: '42px', display: 'flex', alignItems: 'center'}} href='/register' icon color='blue' circular>
              <Icon name='signup' /> Register
            </Button>
        </Menu.Item>
        </>
          }
          {(user) &&
            <Menu.Item>
              <Dropdown
              style={{color: 'white'}} 
              pointing 
              text={`
              ${user.data['First Name'].slice(0, 1).toUpperCase()}${user.data['First Name'].slice(1)}
              ${user.data['Last Name'].slice(0, 1).toUpperCase()}${user.data['Last Name'].slice(1)}`} 
              >
              <Dropdown.Menu>
                <Dropdown.Item 
                  onClick={() => 
                  history.push(`/users/${user.data['First Name']}
                  -${user.data['Last Name']}-${user.data._id}/createdPlaylists`)} 
                  text='My Playlists' 
                />
                <Dropdown.Item onClick={logout} text='Logout' />
              </Dropdown.Menu>
            </Dropdown>
            </Menu.Item>
          }
        </Menu.Menu>
      </Menu>
    )
}



