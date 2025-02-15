import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs';
import aceitaCookies from '../helper/aceitaCookiesHelper.js';
import convertePlanilha from '../helper/salvaPlanilha.js';
dotenv.config();

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

const urlAlvo = process.env.EMPRESA_URL;    

async function extrai() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(urlAlvo);
    await aceitaCookies(page);

    await page.waitForSelector('#newPerformanceCard', { visible: true });

    const reclamacoesNotas = [];

    // Itera sobre as abas
    for (let i = 1; i <= 5; i++) {
        // Clica na aba correspondente
        await page.click(`#newPerformanceCard-tab-${i}`);
        await delay(7500); // Espera um tempo para a aba carregar os dados

        // Extrai os dados da aba atual
        const dadosAba = await page.evaluate((index) => {
            const nota = document.querySelector('#ra-new-reputation');
            const notaReputacao = nota.querySelector('.go1306724026')?.textContent.split(' ').reverse()[0].split('/')[0];
            const section = document.querySelector('#newPerformanceCard');
            const periodo = section.querySelector(`#newPerformanceCard-tab-${index}`)?.innerText || 'Não encontrado';
            const periodoTexto = section.querySelector('.go2159339046')?.textContent || 'Não encontrado';
            const [iniPeriodo, fimPeriodo] = periodoTexto.match(/\d{2}\/\d{2}\/\d{4}/g) || ['Não encontrado', 'Não encontrado'];
            const spans = section.querySelectorAll('.go4263471347 .go2549335548');

            const qtdReclamacoes = spans[0]?.innerText.split(' ')[3] || 'Não encontrado';
            const percentualRespostas = spans[1]?.innerText.split(' ')[1] || 'Não encontrado';
            const reclamacoesPendentes = spans[2]?.innerText.split(' ')[1] || 'Não encontrado';
            const reclamacoesAvaliadas = spans[3]?.innerText.split(' ')[1] || 'Não encontrado';
            const mediaAvaliacao = spans[3]?.innerText.split(' ')[10].slice(0, -1) || 'Não encontrado';
            const porcentagemVoltaNegocio = spans[4]?.innerText.split(' ')[3] || 'Não encontrado';
            const porcentagemResolucao = spans[5]?.innerText.split(' ')[3] || 'Não encontrado';
            const tempoMedioResposta = spans[6]?.innerText.split(' é ')[1] || 'Não encontrado';

            return {
                periodo, // 1
                iniPeriodo, // 2
                fimPeriodo, // 3
                notaReputacao, // 4
                qtdReclamacoes, // 5
                percentualRespostas, // 6
                reclamacoesPendentes, // 7
                reclamacoesAvaliadas, // 8
                mediaAvaliacao, // 9
                porcentagemVoltaNegocio, // 10
                porcentagemResolucao, // 11
                tempoMedioResposta // 12
            };
        }, i);

        reclamacoesNotas.push(dadosAba);
    }
    // console.log(reclamacoesNotas);
    convertePlanilha({dadosPlanilha: reclamacoesNotas, nomePlanilha: 'Reclame Aqui Notas', caminhoPlanilha: process.env.PATH_TO_SAVE || ''});
    fs.writeFileSync('reclamacoesNotas.json', JSON.stringify(reclamacoesNotas, null, 2), 'utf-8');

    await browser.close();
}

extrai();