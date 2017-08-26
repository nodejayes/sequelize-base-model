describe('Definition Core Specs', function () {
    const PATH = require('path');
    const DefinitionCore = require('./../index').DefinitionCore;
    const DatabasePool = require('./../index').DatabasePool;

    beforeEach(function () {
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
    });

    afterEach(function () {
        DatabasePool.removeConnection('connection1');
    });

    it('can setup cache', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        expect(_core).not.toBe(null);
    });

    it('can find model', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        let selectedModel = _core.getModel('public.demo1');
        expect(selectedModel).not.toBe(null);
    });

    it('null model when not found', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        let selectedModel = _core.getModel('xyz');
        expect(selectedModel).toBe(null);
    });
});