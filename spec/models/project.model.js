'use strict';

const { BaseModel } = require('./../../index');

const User = require('./user.model');

class Project extends BaseModel {
    constructor () {
        super('project');
    }
}
module.exports = Project;