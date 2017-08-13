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
        app.listen(4941, () => {
            console.log(`Listening on port: 3000`);
        });
    }
});

