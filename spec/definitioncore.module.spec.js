const ASSERT = require('assert');

describe('Definition Core Specs', function () {
    const PATH = require('path');
    const DefinitionCore = require('./../index').DefinitionCore;
    const DatabasePool = require('./../index').DatabasePool;

    before(function () {
        DatabasePool.addConnection('demo', {
            dbname: 'demo',
            user: 'postgres',
            password: 'postgres',
            options: {
                dialect: 'postgres',
                host: 'localhost',
                port: 5432
            }
        });
        DatabasePool.connectTo('demo');
    });

    afterEach(function () {
        DatabasePool.removeConnection('demo');
    });

    it('can setup cache', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        ASSERT.notEqual(_core, null, 'Definition Core is null');
    });

    it('can find model', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        let selectedModel = _core.getModel('public.demo1');
        ASSERT.notEqual(selectedModel, null, 'Testmodel not exists');
    });

    it('null model when not found', function () {
        let _core = new DefinitionCore(PATH.join(__dirname, 'definitions'));
        let selectedModel = _core.getModel('xyz');
        ASSERT.equal(selectedModel, null, 'not exist model is found');
    });
});