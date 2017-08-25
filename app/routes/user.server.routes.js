//Created by jwt52 on 10/08/17.
const users = require('../controllers/user.server.controller');
const auth = require('../controllers/auth.server.controller');
const validator = require('../controllers/validation.server.controller');

module.exports = (app) => {
    app.route('/api/v1/users').post(validator.isValidJSON, users.create);

    app.route('/api/v1/users/:id')
        .get(validator.isValidId, users.read)
        .put(validator.isValidJSON, validator.isValidId, auth.isLoggedIn, users.update)
        .delete(validator.isValidId, auth.isLoggedIn, users.delete);

    app.route('/api/v1/users/login').post(auth.correctCredentials, auth.login);
    app.route('/api/v1/users/logout').post(auth.isLoggedIn, auth.logout);
};
