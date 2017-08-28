'use strict';

const { BaseModel } = require('./../../index');

const Right = require('./right.model');

class Group extends BaseModel {
    constructor () {
        super('group', [
            {model: new Right().model, as: 'rights'}
        ]);
    }
}
module.exports = Group;