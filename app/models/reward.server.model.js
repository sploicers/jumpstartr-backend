/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');

exports.getAll = (project_id, done) => {
    db.get().query("SELECT * FROM ProjectReward WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.alter = (project_id, values, done) => {
    db.get().query("DELETE FROM ProjectReward", (err, rows) => {
        this.create(values, done => {
            if (err) return done(err);

            return done(rows);
        });
    });
};

exports.create = (values, done) => {
    db.get().query("INSERT INTO ProjectReward(project_id, amount, description) VALUES ?", [values], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};





