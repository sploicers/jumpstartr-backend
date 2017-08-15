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
    let sql = `SELECT * FROM User WHERE ${field} in (${values})`;
    console.log(sql);

    db.get().query(`SELECT * FROM User WHERE ${field} in (?)`, [values], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.create = (username, location, email, password, done) => {
    let values = [username, location, email, password];

    this.getBy('username', username, (result) => {
        console.log(result);

        if (result.length > 0) { // i.e username already exists
            return done(400);

        } else {
            db.get().query("INSERT INTO User(username, User_location, email, password) VALUES(?);", [values], (err, rows) => {
                console.log(rows);

                if (err) return done(400);

                return done(200);
            });
        }
    });
};

exports.session = (user_id, token, done) => {
    db.get().query("SELECT * FROM Session WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return done(err);

        if (rows.length === 0) {
            db.get().query("INSERT INTO Session VALUES (?, ?)", [user_id, token], (err, rows) => {
                if (err) {
                    console.log(err);
                    return done(false);

                } return done(rows);
            });

        } return done(rows);
    });
};