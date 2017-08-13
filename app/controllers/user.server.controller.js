/**
 * Created by jwt52 on 10/08/17.
 */
const User = require('../models/user.server.model');

const jwt = require('jsonwebtoken');


exports.create = (req, res) => {
    let user = req.body.user;
    let password = req.body.password;

    let user_id = user.id;
    let username = user.username;
    let location = user.location;
    let email = user.email;

    let values = [user_id, username, location, email, password];

    if (values.includes(undefined)) {
        res.json({400 : "malformed user data"});

    } else {
        User.create(user_id, username, location, email, password, (result) => {
            res.json(result);



        });

    }
};

exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.getBy('username', username, (result) => {
        if (result.length > 0) {




        } else res.json({400 : "Invalid username/password supplied"});
    });
};

exports.logout = (req, res) => {
    return null;
};

exports.read = (req, res) => {
    let user_id = req.params.id;

    if (isNaN(user_id)) {
        res.json({400 : "Invalid id supplied"});

    } else {
        User.getOne(Number(user_id), (result) => {
            let user = result[0];
            delete user['password'];

            res.json(result.length > 0 ? result : {404 : "User not found"});
        });
    }
};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {
    return null;
};


