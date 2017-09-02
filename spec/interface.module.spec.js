describe('Interface Specs', function () {
    const { DatabasePool, Configuration } = require('./../index');
    const PATH = require('path');
    const User = require('./models/user.model');

    beforeEach(function () {
        Configuration.setDefinitionPath(PATH.join(__dirname, 'definitions'));
        DatabasePool.addConnection('test', {
            dbname: 'demo',
            user: 'postgres',
            password: 'postgres',
            options: {
                dialect: 'postgres',
                host: 'localhost',
                port: 5432
            }
        });
        DatabasePool.connectTo('test');
    });

    afterEach(function () {
        DatabasePool.removeConnection('test');
    });

    it('define Interface', function (done) {
        new User().load({})
            .then(d => {
                console.info(d);
                done();
            }).catch(console.error);
    });
});