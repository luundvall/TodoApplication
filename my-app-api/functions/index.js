const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authenticateHandlerMaker = require('./handlers/authenticateHandler/authenticateHandler');
const listHandlerMaker = require('./handlers/listHandler/listHandler');
const app = express();
const PORT = process.env.PORT || 8000;
const admin = require('firebase-admin');

const serviceAccount = require('./my-app-api-e9b90-firebase-adminsdk-g271c-b29db097c4');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://my-app-api-e9b90.firebaseio.com'
});
let db = admin.firestore();

const authenticateHandler = authenticateHandlerMaker({db});
const listHandler = listHandlerMaker({db});
// DEV
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// PROD
app.use(cors({credentials: true, origin: 'https://my-app-f5fb8.web.app'}));
app.use(bodyParser.json());
app.use(cookieParser());

// Endpoints login etc
app.post('/signin', authenticateHandler.signIn);
app.post('/logout', authenticateHandler.logout);
app.post('/refresh', authenticateHandler.refresh);
app.get('/verifyjwt', authenticateHandler.verifyJwt);

//Endpoints list
app.post('/getlists', listHandler.getLists);
app.post('/updatelist', listHandler.updatelist);
app.post('/createlist', listHandler.createList);
app.post('/deletelist', listHandler.deletelist);
app.post('/updatelistname', listHandler.updateListName);

// Needs this line to run the app in prod, exports the whole app....
exports.app = functions.https.onRequest(app);

/*app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT + '!')
});*/

