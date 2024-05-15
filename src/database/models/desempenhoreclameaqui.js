'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class desempenhoReclameAqui extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    desempenhoReclameAqui.init({
        1: DataTypes.STRING, // periodo
        2: DataTypes.DATE, // iniPeriodo
        3: DataTypes.DATE, // fimPeriodo
        4: DataTypes.NUMBER, // notaReputacao
        5: DataTypes.INTEGER, // qtdReclamacoes
        6: DataTypes.NUMBER, // percentualRespostas
        7: DataTypes.INTEGER, // reclamacoesPendentes
        8: DataTypes.INTEGER, // reclamacoesAvaliadas
        9: DataTypes.NUMBER, // mediaAvaliacao
        10: DataTypes.NUMBER, // porcentagemVoltaNegocio
        11: DataTypes.NUMBER, // porcentagemResolucao
        12: DataTypes.STRING // tempoMedioResposta
    }, {
        sequelize,
        modelName: 'desempenhoReclameAqui',
        tableName: 'tabela_999'
    });
    return desempenhoReclameAqui;
};