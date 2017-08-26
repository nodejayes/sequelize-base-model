'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/database.module');

let schema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name1: {
        type: Sequelize.TEXT
    },
    name2: {
        type: Sequelize.TEXT
    },
    myday: {
        type: Sequelize.DATEONLY
    },
    mytime: {
        type: Sequelize.TIME
    },
    mydatetime: {
        type: Sequelize.DATE
    },
    value1: {
        type: Sequelize.DOUBLE
    },
    value2: {
        type: Sequelize.INTEGER
    }
};

let model = DB.define('public.demo1', schema, {
    tableName: 'demo1',
    timestamps: false
});

module.exports = model;