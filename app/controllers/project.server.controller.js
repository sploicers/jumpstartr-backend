/**
 * Created by jwt52 on 10/08/17.
 */
const Project = require('../models/project.server.model');
const User = require('../models/user.server.model');
const Reward = require('../models/reward.server.model');


exports.list = (req, res) => {
    let start = req.query['startIndex'];
    let count = req.query['count'];

    Project.getAll(start, count, result => {
        if (result["ERROR"]) {
            console.log(result);

        } else {
            res.status(200).json(result.filter(project => project['open']).map(project => {
                return {
                    "id" : project["project_id"],
                    "title" : project["title"],
                    "subtitle" : project["subtitle"],
                };
            }));
        }
    });

};


exports.read = (req, res) => {
    let project_id = req.params.id;
    let project = req['projectData'];

    let result = {
        "project" : {
            "id" : project['project_id'],
            "creationDate" : project['created_on'].getTime(),
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
                "numberOfBackers" : 0
            }
        }
    };

    Project.getCreators(project_id, creators => {
        let user_ids = creators.map(creator => creator["user_id"]);

        User.getBy('user_id', user_ids, users => {
            let active_users = users.filter(user => user['active']);

            result["project"]["data"]["creators"] = active_users.map(user => {
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

                Project.getBackers(project_id, backers => {
                    result["project"]["progress"]["numberOfBackers"] += backers.length;

                    let backer_amounts = {};
                    backers = backers.filter(backer => !backer['anonymous']);

                    for (let backer of backers) {
                        backer_amounts[backer['user_id']] = backer; //*** overwriting currently in case of multiple pledges from same person - fix
                    }

                    User.getBy('user_id', backers.map(backer => backer['user_id']), backers => {
                        console.log("backers:");
                        console.log(backers);


                        result['project']['backers'] = backers.map(backer => {
                            return {
                              "name" : backer['username'],
                              "amount" : backer_amounts[backer['user_id']]['amount']
                            };
                        });

                        res.status(200).json(result);
                    });
                });
            });
        });
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

    let creator_ids = creators.map(creator => creator['id']);

    User.getBy('user_id', creator_ids, result => {
        if (result.filter(user => user['active']).length === creator_ids.length) { // all specified creators actually exist in the database
            console.log("All specified creators exist!");

            Project.create(title, subtitle, description, imgUri, target, result => {
                let project_id = result['insertId'];
                let logged_in_user = req['userData'];

                if (!creator_ids.includes(logged_in_user['user_id'])) {
                    res.status(400).send("Malformed project data - logged in user not included in specified project creators");

                } else {
                    Project.addCreators(creator_ids.map(creator_id => [project_id, creator_id]), result => {
                        let rewardData = rewards.map(reward => [project_id, reward['amount'], reward['description']]);

                        Reward.create(rewardData, result => {
                            res.json(result);
                        });
                    });
                }
            });

        } else res.status(400).send("Malformed project data - one or more specified project creators do not exist");
    });
};


exports.update = (req, res) => {
    let open = req.body.open;
    let project_id = req.params.id;

    Project.alter(project_id, open, result => {
        console.log(result);
        res.sendStatus(200);
    });
};


exports.delete = (req, res) => {
    let project_id = req.params.id;

    Project.remove(project_id, result => {
        res.json(result);
    });
};


exports.setImg = (req, res) => {
    let imgUri = req.file.path;
    let project_id = req['projectData']['project_id'];

    console.log("test");

    Project.setImg(project_id, imgUri, result => {
        res.json(result);
    });
};


exports.getImg = (req, res) => {
    console.log(req['projectData']);

    let imgUri = req['projectData']['imgUri'];
    res.header("Content-Type", `images/${imgUri.includes('jpg') ? 'jpg' : 'png'}`);
    res.status(200).sendFile(imgUri, {root : "./"});
};


exports.give = (req, res) => {
    let project_id = req['projectData']['project_id'];
    let pledge_amount = req.body['amount'];
    let anonymous = req.body['anonymous'];
    let auth_token = req.body['card']['authToken'];

    req['isPledgeAttempt'] = true;

    this.isProjectOwner(req, res, () => {
        if (!req['projectOwner']) {
            let user_id = req['userData']['user_id'];

            Project.pledge([project_id, user_id, anonymous, pledge_amount], auth_token, result => {
                console.log(result);

                res.json(result);
            });

        } else res.status(403).send(`Forbidden - cannot pledge to own project - this is fraud!`);
    });
};


exports.isProjectOwner = (req, res, next) => {
    let user_id = req['userData']['user_id'];
    let project_id = req.params.id;

    Project.getCreators(project_id, rows => {
        if (rows.length > 0) {
            let creators = rows.map(creator => creator['user_id']);

            if (creators.includes(user_id)) req['projectOwner'] = true;

            if (req['projectOwner'] || req['isPledgeAttempt']) {
              next();

            } else res.status(403).send(`Forbidden - unable to update a project you do not own`);

        } else res.status(400).send("Malformed request");
    });
};








