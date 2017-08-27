'use strict';

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
 * create a instance of Model for each Sequelize Model that includes
 * 
 * @param {object} data Sequelize Model
 */
const _constructRecursive = function (data) {
    let i = 0;
    while (i < data._options.include.length) {
        let key = data._options.include[i].as;
        if (data[key] && data[key].length > 0) {
            // handle Array
            let j = 0;
            while (j < data[key].length) {
                let inst = new this.architects[key]();
                inst.create(data[key][j]);
                data[key][j] = inst;
                j++;
            }
        } else {
            // handle Object
            let inst = new this.architects[key]();
            inst.create(data[key]);
            data[key] = inst;
        }
        i++;
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
            joins.forEach(j => {
                j.model = _getModel(j.model).schema(j.schema);
                this.architects[j.as] = j.architect;
                delete j.schema;
                delete j.architect;
            });
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
        return this.instance !== null ? this.instance.dataValues : null;
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
        if (!isnew && data._options.include) {
            _constructRecursive.bind(this)(data);
        }
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