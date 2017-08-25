/**
 * Created by jwt52 on 16/08/17.
 */
const Auth = require('../models/auth.server.model');
const User = require('../models/user.server.model');

exports.isLoggedIn = (req, res, next) => {
    Auth.validateToken(req.get('X-Authorization'), rows => {
        if (rows.length > 0) {
            let authTokenOwner = rows[0];

            if (req['tokenOwnerCheck']) {
                let incomingUser = req['userData'];

                if (authTokenOwner['user_id'] === incomingUser['user_id']) {
                    next();

                } else res.status(403).send('Forbidden - account not owned');

            } else {
                req['userData'] = authTokenOwner;
                next();
            }

        } else res.status(401).send('Unauthorized - not logged in');
    });
};


exports.correctCredentials = (req, res, next) => {
    let username = req.query['username'];
    let password = req.query['password'];

    if ([username, password].includes(undefined)) {
        res.status(400).send("Invalid username/password supplied");

    } else {
        User.getBy('username', username, result => {
            if (result.filter(user => user['active']).length > 0) {
                let current_user = result[0];
                let user_id = current_user['user_id'];

                if (current_user['password'] === password) {
                    req['userData'] = current_user;
                    next();

                } else res.status(400).send("Invalid username/password supplied");

            } else res.status(400).send("Invalid username/password supplied");
        });
    }
};


exports.login = (req, res) => {
    let username = req.query['username'];
    let password = req.query['password'];
    let user_id = req['userData']['user_id'];

    let token = (user_id + username).toString().split('').reverse().join('');

    Auth.sessionBegin(user_id, token, result => {
        if (result) {
            res.status(200).json({
                "id" : user_id,
                "token" : token
            });
        }
    });
};


exports.logout = (req, res) => {
    Auth.sessionEnd(req.get('X-Authorization'), result => {
        console.log(result);
        console.log("Logout success");

        res.sendStatus(200);
    });
};

