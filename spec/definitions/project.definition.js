'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let Project = Db.define('project', {
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

module.exports = Project;