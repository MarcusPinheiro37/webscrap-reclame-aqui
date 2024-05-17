import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';

export default async function convertePlanilha(dados) {
    const { dadosPlanilha, nomePlanilha, caminhoPlanilha } = dados;
    const filePath = path.join(caminhoPlanilha, `${nomePlanilha}.xlsx`);
    
    let existingData = [];

    // Verifica se o arquivo já existe
    if (fs.existsSync(filePath)) {
        // Lê o arquivo existente
        const file = xlsx.readFile(filePath);
        const sheetName = file.SheetNames[0];
        const worksheet = file.Sheets[sheetName];
        existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    }

    // Adiciona os títulos das colunas se não existirem
    if (existingData.length === 0) {
        const titulos = Object.keys(dadosPlanilha[0]);
        existingData.push(titulos);
    }

    // Adiciona as novas linhas aos dados existentes
    dadosPlanilha.forEach(dado => {
        const newRow = Object.values(dado);
        existingData.push(newRow);
    });

    // Cria um novo workbook e worksheet usando excel4node
    const xl = require('excel4node');
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(nomePlanilha);

    // Escreve os dados atualizados na nova worksheet
    existingData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            ws.cell(rowIndex + 1, colIndex + 1).string(String(cell));
        });
    });

    // Escreve o arquivo atualizado
    wb.write(filePath);
}
