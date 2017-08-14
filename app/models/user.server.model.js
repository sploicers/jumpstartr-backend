/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');

exports.getOne = (user_id, done) => {
    db.get().query("SELECT * FROM User WHERE user_id = ?", [user_id], (err, rows) => {

        if (err) return done(err);

        return done(rows);
    });
};

exports.getBy = (field, value, done) => {
    db.get().query(`SELECT * FROM User WHERE ${field} = ?`, [value], (err, rows) => {

        if (err) return done(err);

        return done(rows);
    });
};

exports.create = (user_id, username, location, email, password, done) => {
    let values = [user_id, username, location, email, password];

    this.getBy('username', username, (result) => {
        if (result.length > 0) { // i.e username already exists
            return done({
                'code' : 400,
                'message' : 'Username already in use'
            });

        } else {
            db.get().query("INSERT INTO User values ?", [values], (err, rows) => {
                if (err) return done(err);

                return done({
                    'code' : 200,
                    'message' : 'OK'
                });
            });
        }
    });
};

exports.session = (user_id, done) => {




};