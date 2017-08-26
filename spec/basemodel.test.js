'use strict';
const PATH = require('path');
const { BaseModel, DatabasePool, Configuration, DefinitionCore } = require('./../index');

Configuration.setDefinitionPath(PATH.join(__dirname, 'definitions'));
DatabasePool.addConnection('connection1', {
    dbname: 'demo',
    user: 'postgres',
    password: 'postgres',
    options: {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
    }
});
DatabasePool.connectTo('connection1');

class User extends BaseModel {
    constructor () {
        super('user');
    }
}

async function start () {
    console.info(await new Demo1().load());
    DatabasePool.removeConnection('connection1');
    process.exit(0);
}
start();