//Created by jwt52 on 10/08/17.
const Reward = require('../models/reward.server.model');
const Project = require('../models/project.server.model');

const jwt = require('jsonwebtoken');


exports.list = (req, res) => {
    let project_id = req.params.id;

    Project.getOne(project_id, (result) => {
        if (result.length > 0) {
            Reward.getAll(project_id, (result) => {
                res.status(200).json(result.map((row) => {
                    return {
                        "id" : row.reward_id,
                        "amount" : row.amount,
                        "description" : row.description,
                    };
                }));
            });

        } else res.status(404).send('Not found - nonexistent project ID');
    });
};

exports.update = (req, res) => {
    return null;
};

