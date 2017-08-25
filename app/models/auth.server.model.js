/**
 * Created by jwt52 on 13/08/17.
 */
const db = require('../../config/db');

exports.validateToken = (token, done) => {
    db.get().query("SELECT * FROM Session WHERE authtoken = ?", [token], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.sessionBegin = (user_id, token, done) => {
    db.get().query("SELECT * FROM Session WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return done(err);

        if (rows.length > 0) {
            return done(rows);

        } else {
            db.get().query("INSERT INTO Session VALUES (?, ?)", [user_id, token], (err, rows) => {
                if (err) {
                    return done(false);

                } return done(true);
            });
        }
    });
};

exports.sessionEnd = (token, done) => {
    db.get().query("DELETE FROM Session WHERE authtoken = ?", [token], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};



