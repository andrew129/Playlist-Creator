import axios from 'axios';

export default {
    loginUser: function(data) {
        return axios.post('/api/users/login', data)
    },
    registerUser: function(data) {
        return axios.post('/api/users/register', data)
    },
    getUserInfo: function() {
        return axios.get('/api/users/info')
    },
    logoutUser: function() {
        return axios.get('/api/users/logout')
    },
    createPlaylist: function(data) {
        return axios.post('/api/playlists', data)
    }
}