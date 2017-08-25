/**
 * Created by jwt52 on 10/08/17.
 */
const rewards = require('../controllers/reward.server.controller');
const projects = require('../controllers/project.server.controller');
const auth = require('../controllers/auth.server.controller');
const validator = require('../controllers/validation.server.controller');

module.exports = (app) => {
    app.route('/api/v1/projects/:id/rewards')
        .get(validator.isValidId, rewards.list)
        .put(validator.isValidId, auth.isLoggedIn, projects.isProjectOwner, rewards.update);
};
