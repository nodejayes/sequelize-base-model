'use strict';

const { BaseModel } = require('./../../index');

const Group = require('./group.model');
const Right = require('./right.model');
const Project = require('./project.model');

class User extends BaseModel {
    constructor () {
        super('user', [
            {model: new Group().model, as: 'groups', include: [
                {model: new Right().model, as: 'rights'}
            ]},
            {model: new Project().model, as: 'projects'}
        ]);
    }
}
module.exports = User;