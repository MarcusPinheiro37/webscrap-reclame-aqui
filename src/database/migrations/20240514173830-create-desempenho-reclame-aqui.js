'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tabela_999', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            1: { // periodo
                type: Sequelize.STRING
            },
            2: { // iniPeriodo
                type: Sequelize.DATE
            },
            3: { // fimPeriodo
                type: Sequelize.DATE
            },
            4: { // notaReputacao
                type: Sequelize.NUMBER
            },
            5: { // qtdReclamacoes
                type: Sequelize.INTEGER
            },
            6: { // percentualRespostas
                type: Sequelize.NUMBER
            },
            7: { // reclamacoesPendentes
                type: Sequelize.INTEGER
            },
            8: { // reclamacoesAvaliadas
                type: Sequelize.INTEGER
            },
            9: { // mediaAvaliacao
                type: Sequelize.NUMBER
            },
            10: { // porcentagemVoltaNegocio
                type: Sequelize.NUMBER
            },
            11: { // porcentagemResolucao
                type: Sequelize.NUMBER
            },
            12: { // tempoMedioResposta
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tabela_999');
    }
};