'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let User = Db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: Sequelize.TEXT
    },
    lastname: {
        type: Sequelize.TEXT
    }
}, {
    underscored: true
});

User.belongsToMany(require('./group.definition'), {through: require('./lt_user_groups.definition')});
User.belongsToMany(require('./project.definition'), {through: require('./lt_user_projects.definition')});

module.exports = User;