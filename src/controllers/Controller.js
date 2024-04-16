export default class Controller{
    constructor(entidadeService){
        this.entidadeService = entidadeService;
    }
    async getDados(where = {}){
        const listaDados = await this.entidadeService.getRegistros(where);
        return listaDados;
    }
    async postDados(dados) {
        if (Object.keys(dados).length !== 0) {
            const dadosInseridos = await this.entidadeService.postRegistros(dados);
            return {message: 'Dados inseridos com sucesso', dadosInseridos };
        } else {
            throw new Error('Dados para post são inválidos ou campo chave não fornecidos');
        }
    }
    async upsertDados(dados) {
        if (Object.keys(dados).length !== 0) {
            const { instance, created } = await this.entidadeService.upsertRegistro(dados);
            
            if (created) {
                return { message: 'Novo registro criado com sucesso', instance };
            } else {
                return { message: 'Registro existente atualizado com sucesso', instance };
            }
        } else {
            throw new Error('Dados para upsert são inválidos ou campos chave não fornecidos.');
        }
    }
}