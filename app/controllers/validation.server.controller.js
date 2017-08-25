/**
 * Created by jwt52 on 18/08/17.
 */
const Validator = require('ajv');
const User = require('../models/user.server.model');
const Project = require('../models/project.server.model');


exports.isValidId = (req, res, next) => {
    let id = req.params.id;
    let uri = req.route['path'];

    if (isNaN(id)) {
        res.status(400).send('Invalid id supplied');

    } else {
        //query the User or Project tables ensuring the id specified in the path actually exists in the database

        if (uri.includes('projects')) { //id should be treated as a project id
            Project.getOne(id, rows => {
                if (rows.length > 0) {
                    req['projectData'] = rows[0];
                    next();

                } else res.status(404).send("Not found");
            });

        } else { //id should be treated as a user id
            User.getOne(id, rows => {
                if (rows.filter(user => user['active']).length > 0 ) {
                    req['userData'] = rows[0];
                    req['tokenOwnerCheck'] = true; //need to pass knowledge down the middleware chain

                    next();

                } else res.status(404).send("Not found");
            });
        }
    }
};


exports.isValidJSON = (req, res, next) => {
    const v = new Validator();
    let schema;

    switch (req.route['path']) {
        case '/api/v1/projects' :
            v.addSchema(ProjectRewardSchema, '/ProjectReward');
            v.addSchema(ProjectCreatorSchema, '/ProjectCreator');

            schema = ProjectSchema;
            break;

        case '/api/v1/projects/:id' :
            schema = ProjectUpdateSchema;
            break;

        case '/api/v1/projects/:id/pledge' :
            v.addSchema(CardSchema, '/Card');
            schema = ProjectPledgeSchema;
            break;

        case '/api/v1/projects/:id/rewards' :
            schema = ProjectRewardSchema;
            break;

        case '/api/v1/users' :
        case '/api/v1/users/:id':
            v.addSchema(UserSchema, '/User');
            schema = UserPlusPasswordSchema;
            break;

    } let invalidSyntax;


    try {
        JSON.parse(req.body);
        invalidSyntax = false;

    } catch (e) {
        invalidSyntax = true;

    } finally {
        if (v.validate(schema, req.body) || !invalidSyntax) {
            next();

        } else res.status(400).send("Malformed request");
    }
};


const ProjectSchema = {
    "id" : "/ProjectModel",
    "type" : "object",
    "properties" : {
        "title": {"type" : "string"},
        "subtitle": {"type" : "string"},
        "description": {"type" : "string"},
        "imageUri": {"type" : "string"},
        "target": {"type" : "integer"},
        "creators" : {
            "type" : "array",
            "items" : {"$ref" : "/ProjectCreator"}
        },
        "rewards" : {
            "type" : "array",
            "items" : {"$ref" : "/ProjectReward"}
        }
    },
    "required" : ["title","subtitle","description","target","creators","rewards"]
};

const ProjectCreatorSchema = {
    "id" : "/ProjectCreator",
    "type" : "object",
    "properties" : {
        "id" : {"type" : "integer"},
        "name" : {"type" : "string"}
    },
    "required" : ["id", "name"]
};

const ProjectRewardSchema = {
    "id" : "/ProjectReward",
    "type" : "object",
    "properties" : {
        "id" : {"type" : "integer"},
        "amount" : {"type" : "integer"},
        "description" : {"type" : "string"}
    },
    "required" : ["id", "amount", "description"],
    "minProperties" : 3
};

const ProjectPledgeSchema = {
    "id" : "/ProjectPledge",
    "type" : "object",
    "properties" : {
        "id" : {"type" : "integer"},
        "amount" : {"type" : "integer"},
        "anonymous" : {"type" : "boolean"},
        "card" : {"$ref" : "/Card"}
    },
    "required" : ["id", "amount", "anonymous", "card"]
};

const ProjectUpdateSchema = {
    "id" : "/ProjectUpdate",
    "type" : "object",
    "properties" : {
        "open" : {"type" : "boolean"}
    },
    "required" : ["open"]
};

const UserPlusPasswordSchema = {
    "id" : "/UserPlusPassword",
    "type" : "object",
    "properties" : {
        "user" : {"$ref" : "/User"},
        "password" : {"type" : "string"}
    },
    "required" : ["user", "password"]
};

const UserSchema = {
    "id" : "/User",
    "type" : "object",
    "properties" : {
        "id" : {"type" : "integer"},
        "username" : {"type" : "string"},
        "location" : {"type" : "string"},
        "email" : {"type" : "string"}
    },
    "required" : ["id", "username", "location", "email"]
};

const CardSchema = {
    "id" : "/Card",
    "type" : "object",
    "properties" : {
        "authToken" : {"type" : "string"}
    },
    "required" : ["authToken"]
};












