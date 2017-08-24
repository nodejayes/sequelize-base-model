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
 * @memberof Database
 * @prop {object} _cfg Sequelize Configuration Object
 */
let _cfg = {};

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
 * @memberof Database
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
 * @class Database
 */
class Database {
    constructor () {}

    /**
     * add a Database Connection
     * 
     * @param {object} cfg Sequelize Connection Info
     * @param {string} name Name of the Connection
     * @memberof Database
     */
    addConnection (name, cfg) {
        if (typeof name !== 'string' || name.length < 1) {
            throw new Error('invalid connection name');
        }
        if (!cfg) {
            throw new Error('empty config object');
        }
        if (typeof cfg !== 'object' || !_validateSequelizeConfig(cfg)) {
            throw new Error('invalid config object')
        }
        _cfg[name] = {
            configuration: cfg,
            connected: false,
            instance: null
        };
    }

    /**
     * closes and remove a Database Connection
     * 
     * @param {string} name Name of the Connection
     * @memberof Database
     */
    removeConnection (name) {
        if (!_cfg.hasOwnProperty(name)) {
            return;
        }
        if (_cfg[name].instance !== null) {
            _cfg[name].instance.close();
        }
        delete _cfg[name];
    }

    /**
     * connect to the Database
     * 
     * @memberof Database
     * @param {string} name Name of the Connection
     */
    connectTo (name) {
        if (!_cfg.hasOwnProperty(name)) {
            throw new Error('connection not found');
        }
        if (!_cfg[name].connected || _cfg[name].instance === null) {
            _cfg[name].instance = new Sequelize(
                _cfg[name].configuration.dbname, 
                _cfg[name].configuration.user, 
                _cfg[name].configuration.password, 
                _cfg[name].configuration.options
            );
        }
        _cfg[name].connected = true;
    }

    /**
     * Get the current Database Instance
     * 
     * @memberof Database
     * @param {string} name Name of the Connection
     * @returns {object} Sequelize Instance
     */
    getInstance (name) {
        if (!_cfg.hasOwnProperty(name)) {
            throw new Error('connection not found');
        }
        return _cfg[name].instance;
    }
}
module.exports = Database;