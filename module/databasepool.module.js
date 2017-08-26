'use strict';

const Sequelize = require('sequelize');

const VALIDMAINKEYS    = ['dbname', 'user', 'password', 'options'];
const VALIDOPTIONSKEYS = ['dialect', 'host', 'port', 'storage', 'pool'];
const VALIDPOOLKEYS    = ['min', 'max', 'idle'];
const VALIDDIALECTS    = ['postgres', 'sqlite', 'mssql', 'mysql'];

/**
 * the Configuration
 * 
 * @private
 * @memberof DatabasePool
 * @const {object} CFG Sequelize Configuration Object
 */
const CFG = {};

/**
 * check a object for valid keys
 * 
 * @param {object} cfg Object to check
 * @param {array} validKeys Array of String valid Keys
 */
const _checkKeys = function (obj, validKeys) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (validKeys.indexOf(key) === -1) {
                return false;
            }
        }
    }
    return true;
};

/**
 * allow only dialect and storage when storage is set when not allow the others and validate pool
 * 
 * @private
 * @memberof DatabasePool
 * @param {object} options Sequelize Connection Options
 */
const _validateOptions = function (options) {
    if (typeof options !== 'object' || options === null) {
        return false;
    }
    if (typeof options.storage === 'undefined') {
        return _checkKeys(options, ['host', 'port', 'dialect', 'pool']) &&
               typeof options.host === 'string' && options.host.length > 0 &&
               !isNaN(options.port) && VALIDDIALECTS.indexOf(options.dialect) !== -1 &&
               (typeof options.pool !== 'undefined' ? _hasValidPool(options.pool) : true);
    }
    return _checkKeys(options, ['dialect', 'storage']) && 
           VALIDDIALECTS.indexOf(options.dialect) !== -1 &&
           typeof options.storage === 'string' && options.storage.length > 0;
};

/**
 * validate the pooling settings
 * 
 * @param {object} pool Sequelize Pooling Object
 */
const _hasValidPool = function (pool) {
    return _checkKeys(pool, VALIDPOOLKEYS) && !isNaN(pool.max) && !isNaN(pool.min) && !isNaN(pool.idle);
};

/**
 * validate the Sequelize COnfig Object
 * 
 * @param {object} cfg Sequelize COnfig Object
 */
const _validateSequelizeConfig = function (cfg) {
    return _checkKeys(cfg, VALIDMAINKEYS) && _checkKeys(cfg.options, VALIDOPTIONSKEYS) && _validateOptions(cfg.options);
};

/**
 * Holds the Sequelize Instance
 * 
 * @class DatabasePool
 */
class DatabasePool {
    /**
     * add a Database Connection
     * 
     * @static
     * @param {object} cfg Sequelize Connection Info
     * @param {string} name Name of the Connection
     * @memberof DatabasePool
     */
    static addConnection (name, cfg) {
        if (typeof name !== 'string' || name.length < 1) {
            throw new Error('invalid connection name');
        }
        if (!cfg) {
            throw new Error('empty config object');
        }
        if (typeof cfg !== 'object' || !_validateSequelizeConfig(cfg)) {
            throw new Error('invalid config object')
        }
        CFG[name] = {
            configuration: cfg,
            connected: false,
            instance: null
        };
    }

    /**
     * closes and remove a Database Connection
     * 
     * @static
     * @param {string} name Name of the Connection
     * @memberof DatabasePool
     */
    static removeConnection (name) {
        if (!CFG.hasOwnProperty(name)) {
            return;
        }
        if (CFG[name].instance !== null) {
            CFG[name].instance.close();
        }
        delete CFG[name];
    }

    /**
     * connect to the Database
     * 
     * @static
     * @memberof DatabasePool
     * @param {string} name Name of the Connection
     */
    static connectTo (name) {
        if (!CFG.hasOwnProperty(name)) {
            throw new Error('connection not found');
        }
        if (!CFG[name].connected || CFG[name].instance === null) {
            CFG[name].instance = new Sequelize(
                CFG[name].configuration.dbname, 
                CFG[name].configuration.user, 
                CFG[name].configuration.password, 
                CFG[name].configuration.options
            );
        }
        CFG[name].connected = true;
    }

    /**
     * Get the current Database Instance
     * 
     * @static
     * @memberof DatabasePool
     * @param {string} name Name of the Connection
     * @returns {object} Sequelize Instance
     */
    static getInstance (name) {
        if (!CFG.hasOwnProperty(name)) {
            throw new Error('connection not found');
        }
        return CFG[name].instance;
    }
}
module.exports = DatabasePool;