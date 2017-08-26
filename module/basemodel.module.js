'use strict';

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
 * Fills dataValues of result in Data Object
 * 
 * @private
 * @memberof BaseModel
 * @param {object} d 1 Result Entry
 * @param {integer} i Index of Result Entry
 * @param {array} data Resultset
 */
const _fillData = function (d, i, data) {
    data[i] = d.dataValues;
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
        this.rawData = null;
        this.joins = null;
        if (joins && joins.length > 0) {
            joins.forEach(j => {
                j.model = _getModel(j.model).schema(j.schema);
                delete j.schema;
            });
            this.joins = joins;
        }
    }

    /**
     * fill the Model with Data
     * 
     * @param {object} data the Object data
     * @memberof BaseModel
     */
    create (data) {
        this.rawData = this.model.build(data).dataValues;
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
            data.forEach(_fillData.bind(this));
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
        try {
            await this.model.create(this.rawData, {
                validate: true,
                returning: false
            });
            this.rawData = this.model.build(this.rawData).dataValues;
        } catch (err) {
            _consoleOutput.bind(this)(err);
        }
    }

    /**
     * delete the current Model Instance from Database
     * 
     * @async
     * @memberof BaseModel
     */
    async delete () {
        try {
            await this.model.destroy({where:{id:this.rawData.id}});
            this.rawData = null;
        } catch (err) {
            _consoleOutput.bind(this)(err);
        }
    }
}
module.exports = BaseModel;