import puppeteer from 'puppeteer';
import fs from 'fs';
import ReclamacaoController from '../controllers/ReclamacaoController.js';

const reclamacaoController = new ReclamacaoController();
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

const urlAlvo = 'https://www.reclameaqui.com.br/empresa/crea-mg-conselho-regional-de-engenharia-e-agronomia-de-minas-gerais/lista-reclamacoes/';

async function extrai() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(urlAlvo);

    try {
        await page.waitForSelector('.cc-btn.cc-allow.cc-btn-format', { timeout: 30000 });
        await page.click('.cc-btn.cc-allow.cc-btn-format');
    } catch (error) {
        console.log('Consent banner not found or not loaded in time, proceeding without accepting.');
    }

    let reclamacoes = [];
    let hasNextPage = true;

    while (hasNextPage) {
        
        await delay(2500);
        let newReclamacoes = await page.$$eval('.sc-1pe7b5t-0.eJgBOc a', (anchors) =>
            anchors.map((anchor) => {
                const title = anchor.querySelector('h4[title]').innerText;
                const url = `https://www.reclameaqui.com.br${anchor.getAttribute('href')}`;
                return {title, url};
            })
        );
        reclamacoes = newReclamacoes;// [...reclamacoes, ...newReclamacoes];

        // hasNextPage = 0;
        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector('[data-testid="next-page-navigation-button"]');
            return nextButton && !nextButton.disabled;
        });

        if (hasNextPage) {
            const nextPageButton = await page.waitForSelector('[data-testid="next-page-navigation-button"]', { visible: true });
            if (nextPageButton) {
                try {
                    await nextPageButton.click();
                } catch (clickError) {
                    await page.evaluate(() => {
                        const nextButton = document.querySelector('[data-testid="next-page-navigation-button"]');
                        nextButton.click();
                    });
                }
                await page.waitForNavigation();

                await delay(2500); 
            }
        }
    }

    await browser.close();
    reclamacoes.forEach(async (reclamacao) => await reclamacaoController.postDados(reclamacao));

    fs.writeFileSync('reclamacoes.json', JSON.stringify(reclamacoes, null, 2), 'utf-8');
    console.log('Data has been saved to reclamacoes.json');

}

extrai();
