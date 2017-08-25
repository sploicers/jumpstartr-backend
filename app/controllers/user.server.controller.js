//Created by jwt52 on 10/08/17.
const User = require('../models/user.server.model');
const auth = require('../controllers/auth.server.controller');
const url = require('url').URL;

exports.create = (req, res) => {
    let data = req['body'];
    let userData = data['user'];

    let username = userData['username'];
    let location = userData['location'];
    let email = userData['email'];
    let password = data['password'];

    User.create(username, location, email, password, statusCode => {
        res.sendStatus(statusCode);
    });
};


exports.read = (req, res) => {
    let user = req['userData'];
    delete user['password'];

    res.status(200).json(user);
};


exports.update = (req, res) => {
    let user_id = req.params.id;
    let user = req.body;

    let username = user['user']['username'];
    let location = user['user']['location'];
    let email = user['user']['email'];
    let password = user['password'];

    let values = [username, location, email, password, user_id];

    User.getBy('username', username, rows => {
        if (rows.length > 0) {
            res.status(400).send("Malformed request - username already in use");

        } else {
            User.modify(values, result => {
                console.log(result);
                res.sendStatus(200);
            });
        }
    });
};

exports.delete = (req, res) => {
   let user_id = req.params.id;

   User.delete(user_id, result => {
       auth.logout(req, res, result => {
           res.status(200).send("User deleted");
       });
   });
};


