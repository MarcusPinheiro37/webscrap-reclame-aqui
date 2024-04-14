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
            throw new Error();
        }
    }
}