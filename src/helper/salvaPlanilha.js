import { createRequire } from 'module';
const require = createRequire(import.meta.url);


export default async function convertePlanilha(dados){
    const { dadosPlanilha, nomePlanilha } = dados;
    const xl = require('excel4node');
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(nomePlanilha);

    const titulos = dadosPlanilha.map(obj => Object.keys(obj))[0];
    let tituloIndex = 1;
    titulos.forEach(titulo => {
        ws.cell(1, tituloIndex ++).string(titulo);
    });

    let linhaIndex = 2;
    dadosPlanilha.forEach(dado => {
        let colunaIndex = 1;
        Object.keys(dado).forEach(nomeColuna => {
            ws.cell(linhaIndex, colunaIndex++).string(dado[nomeColuna]);
        });
        linhaIndex++;
    });

    wb.write(`${nomePlanilha}.xlsx`);
}
