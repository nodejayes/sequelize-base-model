'use strict';

class SequelizeBasicModel {
    static get Configuration () {
        return require('./module/config.module');
    }
    static get DatabasePool () {
        return require('./module/databasepool.module');
    }
    static get DefinitionCore () {
        return require('./module/definitioncore.module');
    }
    static get BaseModel () {
        return require('./module/basemodel.module');
    }
    static get Interface () {
        return require('./module/interface.module');
    }
}
module.exports = SequelizeBasicModel;