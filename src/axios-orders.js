import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-4cf30.firebaseio.com/'
});

export default instance;