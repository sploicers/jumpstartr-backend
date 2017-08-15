/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');

exports.getAll = (done) => {
    db.get().query('SELECT * FROM Project', (err, rows) => {
        if (err) return done({"ERROR" : "Error selecting from database"});

        return done(rows);
    });
}


exports.getOne = (project_id, done) => {
    db.get().query("SELECT * FROM Project WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.getCreators = (project_id, done) => {
    db.get().query("SELECT * FROM ProjectOwner WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};

exports.getBackers = (project_id, done) => {
    db.get().query("SELECT * FROM ProjectBacker WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.create = (title, subtitle, description, imgUri, target, done) => {
    let values = [title, subtitle, description, imgUri, target];

    if(values.includes(undefined)) {
        return done({400 : "Malformed project data"});

    } else {
        db.get().query("INSERT INTO Project(title, subtitle, description, imgUri, target) values ?", [[values]], (err, rows) => {
            if (err) return done(err);

            return done(rows);
        });
    }
};



exports.alter = (project_id, open, done) => {
    db.get().query("UPDATE Projects_open SET open = ? WHERE project_id = ?", [open, project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.remove = (project_id, done) => {
    db.get().query("DELETE FROM Projects WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};




exports.pledge = (project_id, pledge_amount, auth_token, done) => {



};



