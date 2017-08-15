/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');

exports.getAll = (project_id, done) => {
    db.get().query("SELECT * FROM ProjectReward WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done({"ERROR" : "Error selecting from database"});

        return done(rows);
    });
};

exports.alter = (project_id, done) => {


};

exports.create = (project_id, amount, description, done) => {
    let values = [project_id, amount, description];

    db.get().query("INSERT INTO ProjectReward(project_id, amount, description) VALUES ?", [values], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};





