export default async function aceitaCookies(page){
    try {
        await page.waitForSelector('.vwo-survey-close', { timeout: 7500 });
        await page.click('.vwo-survey-close');
        await page.waitForSelector('.cc-btn.cc-allow.cc-btn-format', { timeout: 3000 });
        await page.click('.cc-btn.cc-allow.cc-btn-format');
    } catch (error) {
        console.log('Banner de cookies não encontrado ou não carregado a tempo, prosseguindo sem aceitá-lo.');
    }
}