'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let UserGroups = Db.define('lt_user_groups', {}, {underscored:true});

module.exports = UserGroups;