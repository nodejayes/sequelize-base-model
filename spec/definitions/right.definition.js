'use strict';

const Sequelize = require('sequelize');
const Db        = require('./../../module/databasepool.module').getInstance('demo');

const Group = require('./group.definition');
const GroupRight = require('./lt_group_right.definition');

let model = Db.define('right', {
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

model.belongsToMany(Group, { through: GroupRight });

module.exports = model;