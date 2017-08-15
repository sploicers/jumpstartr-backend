/**
 * Created by jwt52 on 10/08/17.
 */
const Project = require('../models/project.server.model');
const User = require('../models/user.server.model');
const Reward = require('../models/reward.server.model');


exports.list = (req, res) => {
    Project.getAll((result) => {
        if (result["ERROR"]) {
            console.log(result);

        } else {
            res.status(200).json(result.map((row) => {
                return {
                    "id" : row["project_id"],
                    "title" : row["title"],
                    "subtitle" : row["subtitle"],
                };
            }));
        }
    });
};

exports.read = (req, res) => {
    let project_id = req.params.id;

    Project.getOne(project_id, projects => {
        if (projects.length > 0) { //i.e if there exists a project with the specified id
            let project = projects[0];

            let result = {
                "project" : {
                    "id" : project['project_id'],
                    "creationDate" : project['created_on'],
                    "data" : {
                        "title" : project['title'],
                        "subtitle" : project['subtitle'],
                        "description" : project['description'],
                        "imageUri" : project['imageUri'],
                        "target" : project['target']
                    },
                    "progress" : {
                        "target" : project['target'],
                        "currentPledged" : project['total_raised'],
                    }
                }
            };

            Project.getCreators(project_id, (creators) => {
                let user_ids = creators.map(creator => {
                    return creator["user_id"];
                });

                User.getBy('user_id', user_ids, (users) => {
                    result["project"]["backers"] = users.map(user => {
                        return {
                            "name" : user["username"]
                        };
                    });

                    result["project"]["data"]["creators"] = users.map(user => {
                        return {
                            "id" : user["user_id"],
                            "name" : user["username"]
                        };
                    });

                    Reward.getAll(project_id, rewards => {
                        result["project"]["data"]["rewards"] = rewards.map(reward => {
                            return {
                                "id" : reward["reward_id"],
                                "amount" : reward["amount"],
                                "description" : reward["description"]
                            };
                        });

                        Project.getBackers(project_id, (backers) => {
                            result["project"]["backers"] = backers.filter(backer => !backer['anonymous']).map(backer => {
                                return {
                                    "name" : result["project"]["backers"]["name"],
                                    "amount" : backer["amount"]
                                };

                            }); result["project"]["progress"]["numberOfBackers"] += backers.length;

                            res.status(200).json(result);
                        });
                    });
                });
            });

        } else res.sendStatus(404);
    });
};

exports.create = (req, res) => {
    let data = req['body'];

    let title = data['title'];
    let subtitle = data['subtitle'];
    let description = data['description'];
    let imgUri = data['imageUri'];
    let target = data['target'];

    let creators = data['creators'];
    let rewards = data['rewards'];

    //field validation
    if (!([creators, rewards].includes(undefined))) {
        //pull all of the fields out of creator and reward to check they aren't undefined
        let creatorData = creators.map(creator => {
            return [creator['id'], creator['name']];

        }).reduce((a, b) => a.concat(b), []);

        let rewardData = rewards.map(reward => {
            return [reward['id'], reward['amount'], reward['description']];

        }).reduce((a, b) => a.concat(b), []);

        let expected = [title, subtitle, description, imgUri, target].concat(creatorData).concat(rewardData);


        if (expected.includes(undefined)) {
            res.sendStatus(400);

        } else {
            let creator_ids = creators.map(creator => creator['id']);

            User.getBy('user_id', creator_ids, result => {
                if (result.length === creator_ids.length) { // all specified creators actually exist in the database
                    Project.create(title, subtitle, description, imgUri, target, result => {
                        console.log(result);

                        let project_id = result['insertId'];
                        let rewardData = rewards.map(reward => [reward['project_id'], reward['amount'], reward['description']]);


                        Reward.create(rewardData, result => {
                            res.json(result);
                        });
                    });

                } else res.sendStatus(400);
            });
        }

    } else res.sendStatus(400);
};

exports.update = (req, res) => {
    let open = req.body.open;
    let project_id = req.params.id;
    let token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (open == null) {
        res.status(400).send("malformed request");

    } else {
        Project.getOne(project_id, result => {
            if (result.length > 0) {
                Project.alter(project_id, open, result => {
                    res.status(200).json(result); //**** re-check this later *****
                });

            } else res.status(404).send("Nonexistent project ID");
        });
    }
};

exports.delete = (req, res) => {
    let project_id = req.params.id;

    Project.remove(project_id, result => {
        res.json(result);
    });
};

exports.setImg = (req, res) => {
    Project.setImg(img, (result) => {
        res.json(result);
    });
};

exports.getImg = (req, res) => {
    Project.getImg(result => {
        res.json(result);
    });
};

exports.give = (req, res) => {
    let project_id = req.body['id'];
    let pledge_amount = req.body['amount'];
    let anonymous = req.body['anonymous'];
    let auth_token = req.body['card']['authToken'];

    Project.pledge(project_id, pledge_amount, anonymous, auth_token, result => {
        res.json(result);
    });
};








