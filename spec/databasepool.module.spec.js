const ASSERT = require('assert');

describe('Database Modul Specs', function () {
    const DatabasePool = require('./../index').DatabasePool;

    let _validConfig = {
        dbname: 'demo',
        user: 'postgres',
        password: 'postgres',
        options: {
            dialect: 'postgres',
            host: 'localhost',
            port: 5432
        }
    };

    it('can connect and get instance', function () {
        DatabasePool.addConnection('connection1', _validConfig);
        DatabasePool.connectTo('connection1');
        ASSERT.notEqual(DatabasePool.getInstance('connection1'), null, 'test connection is null');
        DatabasePool.removeConnection('connection1');
    });

    it('can handle multiple connections', function () {
        DatabasePool.addConnection('connection1', _validConfig);
        DatabasePool.addConnection('connection2', _validConfig);
        DatabasePool.connectTo('connection1');
        DatabasePool.connectTo('connection2');
        DatabasePool.removeConnection('connection1');
        DatabasePool.removeConnection('connection2');
    });

    it('validate throws errors', function () {
        try {
            DatabasePool.addConnection(null);
            ASSERT.fail('no error throw!');
        } catch (err) { ASSERT.equal(err.message, 'invalid connection name', ''); }
        try {
            DatabasePool.addConnection('');
            ASSERT.fail('no error throw!');
        } catch (err) { ASSERT.equal(err.message, 'invalid connection name', ''); }
        try { 
            DatabasePool.addConnection('test', {});
            ASSERT.fail('no error throw!');
        } catch (err) { ASSERT.equal(err.message, 'invalid config object', ''); }
        try { 
            DatabasePool.addConnection('test', {});
            ASSERT.fail('no error throw!');
        } catch (err) { ASSERT.equal(err.message, 'invalid config object', ''); }
    });

    it('not found throws error', function () {
        DatabasePool.addConnection('connection1', _validConfig);
        DatabasePool.addConnection('connection2', _validConfig);
        try { 
            DatabasePool.connectTo('xyz');
            ASSERT.fail('throws no error');
        } catch (err) { ASSERT.equal(err.message, 'connection not found', ''); }
        try { 
            DatabasePool.getInstance('xyz');
            ASSERT.fail('throws no error');
        } catch (err) { ASSERT.equal(err.message, 'connection not found', ''); }
        DatabasePool.removeConnection('connection1');
        DatabasePool.removeConnection('connection2');
    });
});