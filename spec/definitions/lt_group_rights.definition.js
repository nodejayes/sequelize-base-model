'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let GroupRights = Db.define('lt_group_rights', {}, {underscored:true});

module.exports = GroupRights;