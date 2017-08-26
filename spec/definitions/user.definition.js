'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

let model = Db.define('user', {
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

module.exports = model;