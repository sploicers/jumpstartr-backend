/**
 * Created by jwt52 on 10/08/17.
 */
const db = require('./config/db');
const express = require('./config/express');

const app = express();

//connect to MYSQL on start
db.connect((err) => {
    if (err) {
        console.log('Unable to connect to MYSQL.');
        process.exit(1);

    } else {
        let port = process.env.SENG365_PORT || 3000;

        app.listen(port, () => {
            console.log(`Listening on ${port}`);
        });

        app.use((req, res, done) => {
            res.sendStatus(404);
            done();
        });
    }
});

