'use strict';

const { BaseModel, Interface } = require('./../../index');

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
        ], new Interface({
            firstname: 'name',
            lastname: 'surname',
            groups: new Interface({
                name: 'groupname',
                rights: new Interface({
                    name: 'rightname'
                })
            })
        }));
    }
}
module.exports = User;