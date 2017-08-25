//Created by jwt52 on 10/08/17.
const Reward = require('../models/reward.server.model');
const Project = require('../models/project.server.model');

exports.list = (req, res) => {
    let project_id = req.params.id;

    Reward.getAll(project_id, rewards => {
        res.status(200).json(rewards.map(reward => {
            return {
                "id" : reward['reward_id'],
                "amount" : reward['amount'],
                "description" : reward['description'],
            };
        }));
    });
};


exports.update = (req, res) => {
    let rewards = req.body;
    let project_id = req.params.id;

    Reward.alter(rewards, project_id, result => {
        res.sendStatus(200);
    });
};

