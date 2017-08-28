'use strict';

const PATH = require('path');
const { BaseModel, DefinitionCore, DatabasePool, Configuration } = require('./../../index');

let _cfg = {
    dbname: 'demo',
    user: 'postgres',
    password: 'postgres',
    options: {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
    }
};
let _defPath = PATH.join(__dirname, '..', 'definitions');
Configuration.setDefinitionPath(_defPath);
DatabasePool.addConnection('demo', _cfg);
DatabasePool.connectTo('demo');
let _core = new DefinitionCore(_defPath);

const Right = require('./../models/right.model');
const Group = require('./../models/group.model');
const User  = require('./../models/user.model');

const LtUserGroups = require('./../definitions/lt_user_groups.definition');
const LtGroupRights = require('./../definitions/lt_group_rights.definition');

function newRight (obj) {
    let r = new Right();
    r.create(obj);
    return r.save();
}

function newGroup (obj) {
    let g = new Group();
    g.create(obj);
    return g.save();
}

function newUser (obj) {
    let u = new User();
    u.create(obj);
    return u.save();
}

function insertRights () {
    return Promise.all([
        newRight({id: 1, name: 'recht1'}),
        newRight({id: 2, name: 'recht2'}),
        newRight({id: 3, name: 'recht3'}),
        newRight({id: 4, name: 'recht4'})
    ]);
}

function insertGroups () {
    return Promise.all([
        newGroup({id: 1, name: 'Administrator'}),
        newGroup({id: 2, name: 'User'})
    ]);
}

function insertUsers () {
    return Promise.all([
        newUser({
            id: 1,
            firstname: 'Max',
            lastname: 'Mustermann'
        }),
        newUser({
            id: 2,
            firstname: 'Paul',
            lastname: 'Tester'
        })
    ])
}

function insertLtUserGroups () {
    return Promise.all([
        LtUserGroups.create({user_id: 1, group_id: 1}),
        LtUserGroups.create({user_id: 2, group_id: 2})
    ]);
}

function insertLtGroupRights () {
    return Promise.all([
        LtGroupRights.create({group_id: 1, right_id: 1}),
        LtGroupRights.create({group_id: 1, right_id: 2}),
        LtGroupRights.create({group_id: 1, right_id: 3}),
        LtGroupRights.create({group_id: 1, right_id: 4}),
        LtGroupRights.create({group_id: 2, right_id: 1}),
        LtGroupRights.create({group_id: 2, right_id: 2})
    ]);
}

console.info('build schema');
_core.sync([
    'right', 'group', 'user', 'project', 
    'lt_group_rights', 'lt_user_groups', 'lt_user_projects'], true)
    .then(async () => {
        console.info('insert data');
        await insertRights();
        await insertGroups();
        await insertUsers();

        await insertLtUserGroups();
        await insertLtGroupRights();

        let users = await new User().load({});
        console.info(users[0].rawData);

        process.exit(0);
    });

