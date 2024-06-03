import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import converteData from './conversorDataHelper.js';
// import ReclamacaoController from '../controllers/ReclamacaoController.js';
import aceitaCookies from './aceitaCookiesHelper.js';
puppeteer.use(StealthPlugin());

// const reclamacaoController = new ReclamacaoController();
const maxRetries = 3;

export default async function extraiDataLocal(reclamacao, page, iteration, restartInterval) {
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
        try {
            await page.goto(reclamacao.url, { timeout: 60000 });
            await aceitaCookies(page);

            const additionalData = await page.$$eval('.sc-lzlu7c-5.jkjEWj', anchors => 
                anchors.map(anchor => {
                    const localizacaoElement = anchor.querySelector('[data-testid="complaint-location"]');
                    const dataElement = anchor.querySelector('[data-testid="complaint-creation-date"]');
                    if (localizacaoElement && dataElement) {
                        const localizacao = localizacaoElement.innerText;
                        const data = dataElement.innerText;
                        const cidade = localizacao.split(' - ')[0];
                        const estado = localizacao.split(' - ')[1];
                        return { cidade, estado, createdAt: data };
                    }
                    return null;
                }).filter(item => item !== null)
            );
            
            if (additionalData.length > 0) {
                const firstData = additionalData[0];
                firstData.createdAt = converteData(firstData.createdAt);
                Object.assign(reclamacao, firstData);
                console.log(`Dados extraídos com sucesso para ${reclamacao.url}:`, firstData);
            } else {
                console.warn(`Nenhum dado encontrado para ${reclamacao.url}`);
            }

            success = true; // marca a tentativa como bem-sucedida
        } catch (error) {
            console.error(`Tentativa ${attempt + 1} falhou:`, error);
            attempt++;
            if (attempt < maxRetries) {
                console.log(`Tentando novamente (${attempt + 1}/${maxRetries})...`);
            } else {
                console.log('Máximo de tentativas atingido. Falha ao extrair os dados.');
            }
        }
    }

    // Reiniciar o navegador quando a iteração for múltiplo de restartInterval
    if (iteration % restartInterval === 0) {
        console.log(`Reiniciando o navegador após ${iteration} iterações.`);
        await page.browser().close();
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized'],
            defaultViewport: null
        });
        return browser.newPage();
    }

    return page;
}
