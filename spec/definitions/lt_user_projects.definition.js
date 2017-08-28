'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let UserProjects = Db.define('lt_user_projects', {}, {underscored:true});

module.exports = UserProjects;