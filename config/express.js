/**
 * Created by jwt52 on 10/08/17.
 */
const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));

    require('../app/routes/home.server.routes.js')(app);
    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/reward.server.routes.js')(app);
    require('../app/routes/project.server.routes.js')(app);

    return app;
};
