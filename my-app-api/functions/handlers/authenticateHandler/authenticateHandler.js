const _ = require('lodash');
const jwt = require('jsonwebtoken');
const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 30000;

function authenticateHandler({db}) {
    const signIn = (req, res) => {
        const { username, password } = req.body;
        const obj = {};
        let users = db.collection('users');
        users.where('email', '==', username).where('password', '==', password).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    obj.error = {
                        code: '11',
                        message: 'invalid details'
                    };
                    res.send(JSON.stringify(obj));
                }

                const token = jwt.sign({ username }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds,
                });

                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds, so we multiply by 1000
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
                obj.success = true;
                res.send(JSON.stringify(obj));
                res.status(200).end();
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.send(JSON.stringify(err));
                res.status(405).end();
            });
    };

    const refresh = (req, res) => {
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

    return {
        signIn,
        logout,
        refresh,
        verifyJwt
    };

}

module.exports = authenticateHandler;

