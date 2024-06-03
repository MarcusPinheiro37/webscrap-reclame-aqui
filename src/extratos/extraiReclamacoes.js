import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import extraiDataLocal from '../helper/extraiDataLocalReclamacao.js';
import aceitaCookies from '../helper/aceitaCookiesHelper.js';

puppeteer.use(StealthPlugin());

const urlAlvo = 'https://www.reclameaqui.com.br/empresa/crea-mg-conselho-regional-de-engenharia-e-agronomia-de-minas-gerais/lista-reclamacoes/';

const delay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

async function extrai() {
    let browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    let page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9'
    });

    await page.goto(urlAlvo, { waitUntil: 'networkidle2' });

    await aceitaCookies(page);

    let reclamacoes = [];
    let hasNextPage = true;
    const restartInterval = 10; // Reiniciar o navegador a cada 10 iterações
    let iteration = 0;

    while (hasNextPage) {
        await delay(2500, 3500);

        const overlayRemoved = await page.evaluate(() => {
            const overlay = document.getElementById('sec-overlay');
            if (overlay) {
                overlay.remove();
                return true;
            }
            return false;
        });

        if (overlayRemoved) {
            await page.reload({ waitUntil: 'networkidle2' });
            await delay(5500, 6500);
        }

        let newReclamacoes = await page.$$eval('.sc-1pe7b5t-0.eJgBOc a', anchors => 
            anchors.map(anchor => {
                const title = anchor.querySelector('h4[title]').innerText;
                const url = `https://www.reclameaqui.com.br${anchor.getAttribute('href')}`;
                const situacaoElement = anchor.parentElement.querySelector('.sc-1pe7b5t-4');
                const situacao = situacaoElement ? situacaoElement.innerText : 'Unknown';
                return { title, url, situacao };
            })
        );
        console.log(newReclamacoes);
        reclamacoes = [...reclamacoes, ...newReclamacoes];
        hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector('[data-testid="next-page-navigation-button"]');
            return nextButton && !nextButton.disabled;
        });
        if (hasNextPage) {
            try {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    page.click('[data-testid="next-page-navigation-button"]')
                ]);
                await delay(2500, 3500);
            } catch (clickError) {
                console.error('Erro ao clicar no botão de próxima página:', clickError);
                hasNextPage = false;
            }
        }
    }

    for (const reclamacao of reclamacoes) {
        iteration++;
        page = await extraiDataLocal(reclamacao, page, iteration, restartInterval);
    }

    console.log(reclamacoes);
    await browser.close();

    fs.writeFileSync('reclamacoes.json', JSON.stringify(reclamacoes, null, 2), 'utf-8');
}

extrai();
