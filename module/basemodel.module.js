'use strict';

const _ = require('underscore');
const Sequelize = require('sequelize');
const DefinitionCore = require('./definitioncore.module');
const { getDefinitionPath } = require('./config.module');

const CORE = {value:null};

/**
 * gets the Model with the Name from Definition Core Modul
 * 
 * @private
 * @memberof BaseModel
 * @param {string} name 
 * @return {object} Model
 */
const _getModel = function (name) {
    if (CORE.value === null) {
        CORE.value = new DefinitionCore(getDefinitionPath());
    }
    return CORE.value.getModel(name);
};

/**
 * Write a Error in Base Model to Console
 * 
 * @private
 * @memberof BaseModel
 * @param {object} err Error Object 
 */
const _consoleOutput = function (err) {
    console.info('##################################################################################');
    console.info('Error in model', this.name);
    console.error(err);
    console.info(this.rawData);
    console.info('##################################################################################');
    console.info('');
};

/**
 * destruct the sequelize model data to raw object
 * 
 * @param {object} obj 
 */
const _destructRaw = function (obj) {
    try {
        let tmp = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] instanceof Sequelize.Model) {
                    tmp[key] = _destructRaw(obj[key].dataValues);
                } else if (_.isArray(obj[key])) {
                    let tmpArr = [];
                    let i = 0;
                    while (i < obj[key].length) {
                        let arrItem = obj[key][i];
                        if (arrItem instanceof Sequelize.Model) {
                            tmpArr.push(_destructRaw(arrItem.dataValues));
                        } else {
                            tmpArr.push(arrItem);
                        }
                        i++;
                    }
                    tmp[key] = tmpArr;
                } else {
                    tmp[key] = obj[key];
                }
            }
        }
        return tmp;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Base Model
 * 
 * @class BaseModel
 * @required DefinitionCore
 */
class BaseModel {
    /**
     * Creates an instance of BaseModel.
     * 
     * @param {string} name name of the model 
     * @param {?string} schema name of a schema
     * @memberof BaseModel
     */
    constructor (modelname, joins) {
        this.name = modelname;
        this.model = _getModel(this.name);
        this.instance = null;
        this.joins = null;
        this.architects = {};
        if (joins && joins.length > 0) {
            this.joins = joins;
        }
    }

    /**
     * getter for Raw Data
     * 
     * @readonly
     * @memberof BaseModel
     */
    get rawData () {
        return this.instance !== null ? _destructRaw(this.instance.dataValues) : null;
    }

    /**
     * set a Property of the Model Instance
     * 
     * @param {string} key Name of the Property to set
     * @param {any} value Value to set
     * @memberof BaseModel
     */
    setProperty (key, value) {
        if (!this.instance || !this.instance[key]) {
            throw new Error(`cannot set property ${key} in model ${this.name}`);
        }
        this.instance[key] = value;
    }

    /**
     * fill the Model with Data
     * 
     * @param {object} data the Object data
     * @memberof BaseModel
     */
    create (data) {
        let isnew = !(data instanceof Sequelize.Model);
        this.instance = !isnew ? data : this.model.build(data);
        this.instance.isNewRecord = isnew;
    }

    /**
     * Load Model Data from Database uses the Filter
     * 
     * @async
     * @param {object} filter Sequelize Filter definition
     * @returns {array} data
     * @memberof BaseModel
     */
    async load (filter) {
        try {
            if (typeof filter !== 'object' || filter === null) {
                filter = {};
            }
            if (this.joins !== null) {
                filter.include = this.joins;
            }
            let data = await this.model.findAll(filter);
            let i = 0;
            while (i < data.length) {
                let newInstance = new this.constructor();
                newInstance.create(data[i]);
                data[i] = newInstance;
                i++;
            }
            return data;
        } catch (err) {
            _consoleOutput.bind(this)(err);
            return null;
        }
    }

    /**
     * Save the current Model Data into Database
     * 
     * @async
     * @memberof BaseModel
     */
    async save () {
        if (!this.instance) {
            console.warn(`there is no instance for model ${this.name} save has no effect`);
            return;
        }
        if (this.instance.isNewRecord !== true) {
            console.warn(`the instance is not a new Record update was invoked`);
            this.update();
            return;
        }
        await this.instance.save();
    }

    /**
     * update a model
     * 
     * @param {?array} fields list of fields to update
     * @memberof BaseModel
     */
    async update (fields) {
        if (!this.instance) {
            console.warn(`there is no instance for model ${this.name} update has no effect`);
            return;
        }
        if (!fields || typeof fields === 'string' || fields.length < 1) {
            fields = {};
            let i = 0;
            while (i < this.instance.attributes.length) {
                let key = this.instance.attributes[i];
                let hasChanged = this.instance._changed[key];
                if (hasChanged) {
                    fields[key] = this.instance.dataValues[key];
                }
                i++;
            }
        }
        await this.instance.update(fields);
    }

    /**
     * delete the current Model Instance from Database
     * 
     * @async
     * @memberof BaseModel
     */
    async delete () {
        if (!this.instance) {
            console.warn(`there is no instance for model ${this.name} delete has no effect`);
            return;
        }
        await this.instance.destroy();
        this.instance = null;
    }
}
module.exports = BaseModel;