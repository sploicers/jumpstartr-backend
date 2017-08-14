/**
 * Created by jwt52 on 10/08/17.
 */
const Project = require('../models/project.server.model');
const User = require('../models/user.server.model');
const Reward = require('../models/reward.server.model');


exports.list = (req, res) => {
    Project.getAll((result) => {
        res.status(200).json(result.map((row) => {
            return {
                "id" : row.project_id,
                "title" : row.title,
                "subtitle" : row.subtitle,
            };
        }));
    });
};

exports.read = (req, res) => {
    let project_id = req.params.id;

    Project.getOne(project_id, (result) => {
        if (result.length > 0) {
            //console.log(result);
            res.status(200).json(result);

        } else res.status(404).send("Nonexistent project ID");
    });
};

exports.create = (req, res) => {
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let description = req.body.description;
    let imgUri = req.body.imgUri;
    let target = req.body.target;

    let creators = req.body.creators;
    let rewards = req.body.rewards;

    User.getBy('user_id', user_id, (result) => {
        if (result.length > 0) {
            Project.create(title, subtitle, description, imgUri, target, (result) => {
                let data = result[0]; //check this

                for (let reward of rewards) {
                    Reward.create(reward.id, project_id, reward.amount, reward.description, (result) => {
                        console.log(result);
                        res.json(result);
                    });
                }
            });

        } else res.status(400).send("Unauthorized - create account to create project");
    });
};

exports.update = (req, res) => {
    let open = req.body.open;
    let project_id = req.params.id;
    let token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (open == null) {
        res.status(400).send("malformed request");

    } else {
        Project.getOne(project_id, (result) => {
            if (result.length > 0) {
                Project.alter(project_id, open, (result) => {
                    res.status(200).json(result); //**** re-check this later *****
                });

            } else res.status(404).send("Nonexistent project ID");
        });
    }
};

exports.delete = (req, res) => {
    let project_id = req.params.id;

    Project.remove(project_id, (result) => {
        res.json(result);
    });
};

exports.setImg = (req, res) => {
    Project.setImg(img, (result) => {
        res.json(result);
    });
};

exports.getImg = (req, res) => {
    Project.getImg((result) => {
        res.json(result);
    });
};

exports.give = (req, res) => {
    let project_id = req.body['id'];
    let pledge_amount = req.body['amount'];
    let anonymous = req.body['anonymous'];
    let auth_token = req.body['card']['authToken'];

    Project.pledge(project_id, pledge_amount, anonymous, auth_token, (result) => {
        res.json(result);
    });
};








