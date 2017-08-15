//Created by jwt52 on 10/08/17.
const projects = require('../controllers/project.server.controller');

module.exports = (app) => {
    app.route('/api/v1/projects')
        .get(projects.list)
        .post(projects.create);

    app.route('/api/v1/projects/:id')
        .get(projects.read)
        .put(projects.update)
        .delete(projects.delete);

    app.route('/api/v1/projects/:id/image')
        .get(projects.getImg)
        .put(projects.setImg);

    app.route('/api/v1/projects/:id/pledge')
        .post(projects.give);
};
