//Created by jwt52 on 10/08/17.
const User = require('../models/user.server.model');
const authenticator = require('../../config/auth');

exports.create = (req, res) => {
    let user = req.body.user;
    let password = req.body.password;

    let user_id = user.id;
    let username = user.username;
    let location = user.location;
    let email = user.email;

    let values = [user_id, username, location, email, password];

    if (values.includes(undefined)) {
        res.status(400).send("malformed user data");

    } else {
        User.create(user_id, username, location, email, password, (result) => {
            res.status(result['code']).send(result['message']);
        });
    }
};

exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.getBy('username', username, (result) => {
        if (result.length > 0) {



        } else res.status(400).send("Invalid username/password supplied");
    });
};

exports.logout = (req, res) => {
    return null;
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
            let user = result[0];
            delete user['password'];

            if (result.length > 0) {
                res.json(result);

            } else res.status(404).send("User not found");
        });
    }
};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {
    return null;
};


