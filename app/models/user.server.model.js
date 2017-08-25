/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');
const auth = require('./auth.server.model');

exports.getOne = (user_id, done) => {
    db.get().query("SELECT * FROM User WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.getBy = (field, values, done) => {
    if (values.length === 0) {
        return done(values);

    } else {
        db.get().query(`SELECT * FROM User WHERE ${field} in (?)`, [values], (err, rows) => {
            console.log(rows);

            if (err) return done(err);

            return done(rows);
        });
    }
};

exports.create = (username, location, email, password, done) => {
    let values = [username, location, email, password];

    this.getBy('username', username, (result) => {
        if (result.length > 0) { // i.e username already exists
            return done(400);

        } else {
            db.get().query("INSERT INTO User(username, user_location, email, password) VALUES(?);", [values], (err, rows) => {
                if (err) return done(400);

                return done(200);
            });
        }
    });
};

exports.modify = (values, done) => {
    db.get().query("UPDATE User SET username = ?, user_location = ?, email = ?, password = ? WHERE user_id = ?", values, (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.delete = (user_id, done) => {
    db.get().query("UPDATE User SET active = 0 WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

