import puppeteer from 'puppeteer';
import fs from 'fs';
import extraiDataLocal from './extraiDataLocalReclamacao.js';
import aceitaCookies from '../helper/aceitaCookiesHelper.js';

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

const urlAlvo = 'https://www.reclameaqui.com.br/empresa/crea-mg-conselho-regional-de-engenharia-e-agronomia-de-minas-gerais/lista-reclamacoes/';

async function extrai() {
    const browser = await puppeteer.launch({ // inicia o navegador
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage(); // cria uma nova página
    await page.goto(urlAlvo); // vai até a url alvo na nova página

    aceitaCookies(page); // fecha o banner e aceita os cookies

    let reclamacoes = []; // cria um array vazio para inserções
    let hasNextPage = true; // define próximas páginas como padrão

    while (hasNextPage) { // inicia um while para ler os arquivos enquanto houver próxima página
        await delay(2500); // delay de 2.5 segundos para dar tempo de carregar a página
        let newReclamacoes = await page.$$eval('.sc-1pe7b5t-0.eJgBOc a', (anchors) => // encontra a classe na página web, checar pelo dev tools
            anchors.map((anchor) => {
                const title = anchor.querySelector('h4[title]').innerText; // título da reclamação
                const url = `https://www.reclameaqui.com.br${anchor.getAttribute('href')}`; // link da reclamação
                const situacaoElement = anchor.parentElement.querySelector('.sc-1pe7b5t-4'); // situacao
                const situacao = situacaoElement ? situacaoElement.innerText : 'Unknown'; // tratamento para caso não aja situação
                return { title, url, situacao }; // objeto base
            })
        );
    
        // reclamacoes = [...reclamacoes, ...newReclamacoes]; // inserção dos dados na array a cada página
        // hasNextPage = await page.evaluate(() => { // verifica se o botão da próxima página está disponível, se estiver define como true
        //     const nextButton = document.querySelector('[data-testid="next-page-navigation-button"]');
        //     return nextButton && !nextButton.disabled;
        // });
        // as duas linhas abaixo devem ser usadas quando forem feitos testes, as duas acima devem ser comentadas
        reclamacoes = newReclamacoes; // TESTES;
        hasNextPage = 0; // testes

        if (hasNextPage) { // verifica se há mais páginas
            const nextPageButton = await page.waitForSelector('[data-testid="next-page-navigation-button"]', { visible: true }); // espera o botão de próxima página ficar visível na página
            if (nextPageButton) { // verifica se o botão de próxima página foi encontrado
                try {
                    await nextPageButton.click(); // tenta clicar no botão de próxima página
                } catch (clickError) {
                    await page.evaluate(() => { 
                        const nextButton = document.querySelector('[data-testid="next-page-navigation-button"]'); // busca pelo botão de próxima página no contexto da página
                        nextButton.click(); // clica no botão de próxima página
                    });
                }
                await page.waitForNavigation(); // aguarda a navegação para a próxima página ser concluída
        
                await delay(2500); // espera 2.5 segundos para dar tempo de carregar a página
            }
        } 
        
    }
    
    for (const reclamacao of reclamacoes) {
        const page = await browser.newPage(); // Cria uma nova página para cada reclamação
        await extraiDataLocal(reclamacao, page); // Passa a página para extraiDataLocal
        await page.close(); // Fecha a página quando finalizado
    }

    await browser.close(); // fecha o navegador
    
    fs.writeFileSync('reclamacoes.json', JSON.stringify(reclamacoes, null, 2), 'utf-8'); // salva num arquivo reclamacoes.json

}

extrai(); // chama a função