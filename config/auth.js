/**
 * Created by jwt52 on 13/08/17.
 */
const jwt = require('jwt-simple');
const db = require('../../config/db');

exports.isAuthorized = (user_id, token) => {
    db.get().query("SELECT ? FROM User WHERE ? = ?", ["user_id", "user_id", user_id], (result) => {
        if (result.length > 0) { //user_id exists
            console.log(result);

            db.get().query("SELECT * FROM Session WHERE ? = ? AND ? = ?", ["auth_token", token, "user_id", user_id], (result) => {
                console.log(result);

                //if the query comes back empty, there is no association between the user and the provided token
                return result.length > 0;
            });

        } return false;
    });
};

exports.key = new Buffer('7468697320697320612074c3a97374', 'hex');

