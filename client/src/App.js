import './App.css';
import React from 'react';
import Menu from './components/Menu/Menu';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import {useState, useEffect, useMemo} from 'react';
import API from './utils/API';
import UserContext from './utils/UserContext';
import PlaylistCreator from './components/pages/Playlist/Playlist';

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const userInfo = await API.getUserInfo()
    console.log("line 21" + userInfo)
    setUser(userInfo)
  }

  return (
    <div className="App">
        <Router>
          <UserContext.Provider value={user} >
            <Menu />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            {/* <Route exact path='/:name/createdPlaylists' /> */}
            <Route path='/' component={PlaylistCreator} exact />
          </UserContext.Provider>
        </Router>
    </div>
  );
}

export default App;
// add playlist and then ask for user to upload songs