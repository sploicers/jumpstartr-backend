/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('../../config/db');

exports.getAll = (start, count, done) => {
    db.get().query('SELECT * FROM Project', (err, rows) => {
        if (err) return done({"ERROR" : "Error selecting from database"});

        if (!isNaN(start)) {
            rows = rows.slice(start);

        } if (!isNaN(count)) {
            rows = rows.slice(0, count);

        } return done(rows);
    });
};


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
        console.log(rows);

        if (err) return done(err);

        return done(rows);
    });
};


exports.create = (title, subtitle, description, imgUri, target, done) => {
    let values = [title, subtitle, description, imgUri, target];

    db.get().query("INSERT INTO Project(title, subtitle, description, imgUri, target) values ?", [[values]], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.addCreators = (values, done) => {
    db.get().query("INSERT INTO ProjectOwner values ?", [values], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.alter = (project_id, open, done) => {
    db.get().query("UPDATE Project SET open = ? WHERE project_id = ?", [open, project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.remove = (project_id, done) => {
    db.get().query("DELETE FROM Project WHERE project_id = ?", [project_id], (err, rows) => {
        if (err) return done(err);

        return done(rows);
    });
};


exports.pledge = (values, auth_token, done) => {
    let project_id = values[0];
    let amount = values[3];

    db.get().query("INSERT INTO ProjectBacker(project_id, user_id, anonymous, amount) VALUES (?)", [values], (err, rows) => {
        console.log(rows);

        if (err) return done(err);

        let user_id = values[1];

        db.get().query("INSERT IGNORE INTO PaymentMethod values (?, ?)", [user_id, auth_token], (err, rows) => {
            if (err) return done(err);

            console.log(amount);

            db.get().query("UPDATE Project SET total_raised = total_raised + ? WHERE project_id = ?", [amount, project_id], (err, rows) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }

                console.log(rows);
                return done(rows);
            });
        });
    });
};


exports.setImg = (project_id, imgUri, done) => {
    db.get().query("UPDATE Project SET imgUri = ? WHERE project_id = ?", [imgUri, project_id], (err, rows) => {
        if (err) {
            console.log(err);

        } else return done(rows);


    });
};



