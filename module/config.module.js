'use strict';

const FS = require('fs');

/**
 * holds the Path to Definitions
 */
const CACHE = {
    definitionpath: null
};

/**
 * Global COnfiguration Class
 * 
 * @class Configuration
 */
class Configuration {
    /**
     * set the Path to the Definitions
     * 
     * @static
     * @param {string} folder 
     * @memberof Configuration
     */
    static setDefinitionPath (folder) {
        if (!FS.existsSync(folder)) {
            throw new Error('invalid definitionpath');
        }
        CACHE.definitionpath = folder;
    }

    /**
     * get the Path of the Definitions
     * 
     * @static
     * @returns {string} path to the definitions
     * @memberof Configuration
     */
    static getDefinitionPath () {
        return CACHE.definitionpath;
    }
}
module.exports = Configuration;