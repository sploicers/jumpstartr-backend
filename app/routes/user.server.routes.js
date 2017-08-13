/**
 * Created by jwt52 on 10/08/17.
 */
const users = require('../controllers/user.server.controller');

module.exports = (app) => {
    app.route('/api/v1/users').post(users.create);
    app.route('/api/v1/users/login').post(users.login);
    app.route('/api/v1/users/logout').post(users.logout);

    app.route('/api/v1/users/:id')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);
};
