'use strict';

class SequelizeBasicModel {
    static get DatabasePool () {
        return require('./module/database.module');
    }
    static get DefinitionCore () {
        return require('./module/definitioncore.module');
    }
    static get BaseModel () {
        return require('./module/basemodel.module');
    }
}
module.exports = SequelizeBasicModel;