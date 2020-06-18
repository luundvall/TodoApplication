const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const uri = 'mongodb://karllundvall:kalle123@ds217809.mlab.com:17809/my-todo-app';

const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 30000;

const signIn = (req, res) => {
    const { email, password } = req.body;
    const obj = {};
    mongodb.MongoClient.connect(uri, function(err, client) {
        if(err) throw err;
        let db = client.db('my-todo-app');
        let users = db.collection('users');
        return users.findOne({email: email, password: password}).then(function (result) {
            if (result) {
                // Create a new token with the email in the payload
                // and which expires 300 seconds after issue
                const token = jwt.sign({ email }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds,
                });
                console.log('token:', token);

                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds, so we multiply by 1000
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
                obj.success = true;
                res.send(JSON.stringify(obj));
                res.end();
            } else {
                obj.error = {
                    code: '11',
                    message: 'invalid details'
                };
                res.send(JSON.stringify(obj));
            }
        }).catch(function (error) {

        });
    });
};

const helloWorld = (req, res) => {
    mongodb.MongoClient.connect(uri, function(err, client) {
        if(err) throw err;
        let db = client.db('my-todo-app');
        let users = db.collection('users');
        return users.findOne({email: 'a@a.se', password: '123'}).then(function (result) {
            res.send(result);
        }, function (err) {
            res.send(err);
        }).finally(function () {

        });
    });
}


const welcome = (req, res) => {
    // We can obtain the session token from the requests cookies, which come with every request
    const token = req.cookies.token;

    // if the cookie is not set, return an unauthorized error
    if (!token) {
        return res.status(401).end()
    }

    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }

    // Finally, return the welcome message to the user, along with their
    // email given in the token
    res.send(`Welcome ${payload.email}!`)
    return null;
};

const refresh = (req, res) => {
    // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).end()
    }

    var payload;
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }

    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign({ email: payload.email }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds,
    });

    // Set the new token as the users `token` cookie
    res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 });
    res.end();
    return null;
};

const verifyJwt = (req, res) => {
    const obj = {validSession: false};
    const token = req.cookies.token;
    if (token) {
        obj.validSession = true;
        res.send(JSON.stringify(obj));
    } else {
        obj.validSession = false;
        res.send(JSON.stringify(obj));
    }
};

const logout = (req, res) => {
    const oldToken = req.cookies.token;
    if (oldToken) {
        res.cookie('token', oldToken, {maxAge: 10});
    }
    res.end();
};

module.exports = {
    signIn,
    logout,
    welcome,
    refresh,
    verifyJwt,
    helloWorld
};
