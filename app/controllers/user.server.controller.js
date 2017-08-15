//Created by jwt52 on 10/08/17.
const User = require('../models/user.server.model');

exports.create = (req, res) => {
    let data = req['body'];
    let userData = data['user'];

    if (userData != null) {
        let user_id = userData['id'];
        let username = userData['username'];
        let location = userData['location'];
        let email = userData['email'];
        let password = data['password'];

        if ([user_id, username, location, email, password].includes(undefined)) {
           res.sendStatus(400);

        } else {
            User.create(username, location, email, password, statusCode => {
                res.sendStatus(statusCode);
            });
        }

    } else res.sendStatus(400);
};

exports.login = (req, res) => {
    let username = req.body['username'];
    let password = req.body['password'];

    User.getBy('username', username, result => {
        if (result.length > 0) {
            let user = result[0];
            let user_id = user['user_id'];

            if (user['password'] == password) {
                let token = (user_id + username).toString().split("").reverse().join("");

                User.session(user_id, token, result => {
                    if (result) {
                        res.status(200).json({


                        });
                    }
                });

            } else res.status(400).send("Invalid username/password supplied");

        } else res.sendStatus(404);
    });
};

exports.logout = (req, res) => {
    return null;
};


exports.validate = (req, res, done) => {
    User.session()




};

exports.isLoggedIn = (req, res, done) => {
    let user_id = req.body.user_id;

    if (authenticator.isAuthorized(user_id, req.get('X-Authorization'))) {
        done();

    } else return res.status(401).json({message: 'Unauthorized user!'});
};

exports.read = (req, res) => {
    let user_id = req.params.id;

    if (isNaN(user_id)) {
        res.status(400).send("Invalid id supplied");

    } else {
        User.getOne(Number(user_id), (result) => {
            if (result.length > 0) {
                let user = result[0];
                delete user['password'];
                res.status(200).json(result);

            } else res.status(404).send("User not found");
        });
    }
};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {
    return null;
};


const validCredentials = (username, password) => {
    "use strict";



}


