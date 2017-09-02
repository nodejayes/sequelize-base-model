'use strict';

const _ = require('underscore');

/**
 * check the Interface definition and throws errors when it was invalid.
 * 
 * @param {object} def 
 */
const _checkInterface = function (def) {
    if (!_.isObject(def)) {
        throw new Error(`invalid parameter ${def}`);
    }
    for (let key in def) {
        if (def.hasOwnProperty(key)) {
            if (!_.isString(def[key]) && !(def[key] instanceof Interface)) {
                throw new Error('definition keys only allow string or instance of interface');
            }
        }
    }
    return true;
}

/**
 * holds a Instance of a Interface definition
 * 
 * @example {sourceproperty: targetname, sourceproperty: interfaceinstance}
 * @class Interface
 */
class Interface {
    /**
     * Creates an instance of Interface.
     * 
     * @param {object} definition 
     * @memberof Interface
     */
    constructor (definition) {
        this.definition = null;
        if (_checkInterface(definition)) {
            this.definition = definition;
        }
    }
}
module.exports = Interface;