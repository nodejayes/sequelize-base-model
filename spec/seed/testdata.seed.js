'use strict';

const PATH = require('path');
const { BaseModel, DefinitionCore, DatabasePool, Configuration } = require('./../../index');

class Right extends BaseModel {
    constructor () {
        super('right');
    }
}

class Group extends BaseModel {
    constructor () {
        super('group');
    }
}

class User extends BaseModel {
    constructor () {
        super('user');
    }
}

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

console.info('build schema');
_core.sync(['group', 'user', 'right', 'ltgroupright'], true)
    .then(async () => {
        console.info('insert data');
        await insertRights();
        await insertGroups();
        await insertUsers();
    });

