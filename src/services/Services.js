import db from '../database/models/index.cjs'; //const ds = require('../database/models');

class Services{
    constructor(nomeModel){
        this.model = nomeModel;
    }
    async getRegistros(where = {}){
        return db[this.model].findAll({where: { ...where }});
    }
    async postRegistros(dadosRegistro){
        return db[this.model].create(dadosRegistro);
    }
}

export default Services;