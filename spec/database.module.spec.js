describe('Database Modul Specs', function () {
    const DatabasePool = require('./../index').DatabasePool;

    let _db = null;
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

    beforeEach(function () {
        _db = new DatabasePool();
    });

    it('can connect and get instance', function () {
        _db.addConnection('connection1', _validConfig);
        _db.connectTo('connection1');
        expect(_db.getInstance('connection1')).not.toBe(null);
        _db.removeConnection('connection1');
    });

    it('can handle multiple connections', function () {
        _db.addConnection('connection1', _validConfig);
        _db.addConnection('connection2', _validConfig);
        _db.connectTo('connection1');
        _db.connectTo('connection2');
        _db.removeConnection('connection1');
        _db.removeConnection('connection2');
    });

    it('validate throws errors', function () {
        try {
            _db.addConnection(null);
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid connection name'); }
        try {
            _db.addConnection('');
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid connection name'); }
        try { 
            _db.addConnection('test', {});
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid config object'); }
        try { 
            _db.addConnection('test', {});
            fail('no error throw!');
        } catch (err) { expect(err.message).toBe('invalid config object'); }
    });

    it('not found throws error', function () {
        _db.addConnection('connection1', _validConfig);
        _db.addConnection('connection2', _validConfig);
        try { 
            _db.connectTo('xyz');
            fail('throws no error');
        } catch (err) { expect(err.message).toBe('connection not found'); }
        try { 
            _db.getInstance('xyz');
            fail('throws no error');
        } catch (err) { expect(err.message).toBe('connection not found'); }
    });
});