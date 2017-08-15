/**
 * Created by jwt52 on 10/08/17.
 */
const mysql = require('mysql');


const state = {
    pool : null
};

exports.connect = (done) => {
    state.pool = mysql.createPool({
        host : process.env.SENG365_MYSQL_HOST || 'localhost',
        user : 'root',
        password : 'secret',
        port : process.env.SENG365_MYSQL_PORT || 6033,
        database : 'assignment'

    }); done();

};

exports.get = () => {
    return state.pool;
};
