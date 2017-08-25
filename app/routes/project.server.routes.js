//Created by jwt52 on 10/08/17.
const projects = require('../controllers/project.server.controller');
const auth = require('../controllers/auth.server.controller');
const validator = require('../controllers/validation.server.controller');
const multer = require('multer');
const imgUploader = multer({dest : './projectImg'});

module.exports = (app) => {
    app.route('/api/v1/projects')
        .get(projects.list)
        .post(validator.isValidJSON, auth.isLoggedIn, projects.create);

    app.route('/api/v1/projects/:id')
        .get(validator.isValidId, projects.read)
        .put(validator.isValidJSON, validator.isValidId, auth.isLoggedIn, projects.isProjectOwner, projects.update)
        .delete(validator.isValidJSON, validator.isValidId, auth.isLoggedIn, projects.isProjectOwner, projects.delete);

    app.route('/api/v1/projects/:id/image')
        .get(validator.isValidId, projects.getImg)
        .put(validator.isValidId, auth.isLoggedIn, projects.isProjectOwner, imgUploader.single("image"), projects.setImg);

    app.route('/api/v1/projects/:id/pledge')
        .post(validator.isValidJSON, validator.isValidId, auth.isLoggedIn, projects.give);
};
