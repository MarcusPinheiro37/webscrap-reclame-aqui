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
    async upsertRegistro(dadosRegistro) {
        const [instance, created] = await db[this.model].upsert(dadosRegistro, {
            // fields: camposChave,
            returning: true,
        });
        return {
            instance,
            created, // verdadeiro se uma nova instancia for criada, falso se uma nova foi atualizada
        };
    }
}

export default Services;