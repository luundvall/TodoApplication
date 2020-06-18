import './index.css';
import appMaker from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './util/styling/main.scss';
import Elq from 'elq';
import axios from 'axios';

const elq = new Elq();
const env = process.env.NODE_ENV;
const url = env === 'development' ? 'http://localhost:8000/' : 'https://us-central1-my-app-api-e9b90.cloudfunctions.net/app/';

appMaker({
    url,
    elq,
    axios
});
