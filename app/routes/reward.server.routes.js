/**
 * Created by jwt52 on 10/08/17.
 */
const rewards = require('../controllers/reward.server.controller');

module.exports = (app) => {
    app.route('/api/v1/projects/:id/rewards')
        .get(rewards.list)
        .put(rewards.update);
};
