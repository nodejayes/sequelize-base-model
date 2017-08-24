'use strict';

const PATH = require('path');
const FS   = require('fs');

let DEFS = {};

/**
 * read all Sequelize Model definitions
 * 
 * @private
 * @memberof DefinitionCore
 * @param {string} path 
 */
const _readModels = function (path) {
    let entries = FS.readdirSync(path);
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let fullpath = PATH.join(path, entry);
        let stat = FS.statSync(fullpath);
        if (stat.isDirectory()) {
            _readModels(fullpath);
        } else {
            if (entry.endsWith('.definition.js')) {
                let definition = require(fullpath);
                DEFS[definition.name] = definition;
            }
        }
    }
};

/**
 * Search the Model and do the sync
 * 
 * @private
 * @memberof DefinitionCore
 * @param {string} model 
 * @param {boolean} force 
 */
const _sync = function (model, force) {
    let tmp = DefinitionCore.getModel(model);
    if (tmp !== null) {
        tmp.sync({force: force});
    }
};

/**
 * try to sync Models into a Database.
 * 
 * @private
 * @memberof DefinitionCore
 * @param {array} models Model Names to Sync 
 * @param {boolean} force drop the data
 */
const _syncModels = function (models, force) {
    force = force === true ? true : false;
    if (!models || models.length < 1) {
        for (let key in DEFS) {
            if (DEFS.hasOwnProperty(key)) {
                DEFS[key].sync({force: force});
            }
        }
    } else {
        models.forEach(_sync);
    }
};

/**
 * Definition Core Module
 * 
 * @class DefinitionCore
 */
class DefinitionCore {
    constructor (folder) {
        _readModels(folder);
    }

    /**
     * get the Model by Name
     * 
     * @static
     * @memberof DefinitionCore
     * @param {string} name Model Name 
     * @return {object} model
     */
    getModel(name) {
        return DEFS[name] || null;
    }

    /**
     * Syncronize the Models to Database
     * 
     * @static
     * @memberof DefinitionCore
     * @param {array} models Model Names in a Array
     * @param {boolean} force delete existing Data !!!!!
     */
    sync(models, force) {
        _sync(models, force);
    }
}
module.exports = DefinitionCore;