'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let Group = Db.define('group', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT
    }
}, {
    underscored: true
});

Group.belongsToMany(require('./right.definition'), {through: require('./lt_group_rights.definition')});

module.exports = Group;