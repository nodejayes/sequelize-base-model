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
        expect(DatabasePool.getInstance('connection1')).not.toBe(null);
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
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid connection name'); }
        try {
            DatabasePool.addConnection('');
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid connection name'); }
        try { 
            DatabasePool.addConnection('test', {});
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid config object'); }
        try { 
            DatabasePool.addConnection('test', {});
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid config object'); }
    });

    it('not found throws error', function () {
        DatabasePool.addConnection('connection1', _validConfig);
        DatabasePool.addConnection('connection2', _validConfig);
        try { 
            DatabasePool.connectTo('xyz');
            fail('throws no error');
        } catch (err) { expect(err.message).toBe('connection not found'); }
        try { 
            DatabasePool.getInstance('xyz');
            fail('throws no error');
        } catch (err) { expect(err.message).toBe('connection not found'); }
        DatabasePool.removeConnection('connection1');
        DatabasePool.removeConnection('connection2');
    });
});