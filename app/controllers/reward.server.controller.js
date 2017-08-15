//Created by jwt52 on 10/08/17.
const Reward = require('../models/reward.server.model');
const Project = require('../models/project.server.model');

exports.list = (req, res) => {
    let project_id = req.params.id;

    Project.getOne(project_id, result => {
        if (result.length > 0) {
            Reward.getAll(project_id, rewards => {
                res.status(200).json(rewards.map(reward => {
                    return {
                        "id" : reward['reward_id'],
                        "amount" : reward['amount'],
                        "description" : reward['description'],
                    };
                }));
            });

        } else res.sendStatus(404);
    });
};


exports.update = (req, res) => {
    return null;
};

