import { converteData } from '../helper/conversorDataHelper.js';
import ReclamacaoController from '../controllers/ReclamacaoController.js';
import aceitaCookies from '../helper/aceitaCookiesHelper.js';

const reclamacaoController = new ReclamacaoController();

export default async function extraiDataLocal(reclamacao, page) {
    await page.goto(reclamacao.url, { timeout: 300000 });
    aceitaCookies(page);

    const additionalData = await page.$$eval('.sc-lzlu7c-5.jkjEWj', anchors => 
        anchors.map(anchor => {
            const localizacao = anchor.querySelector('[data-testid="complaint-location"]').innerText;
            const data = anchor.querySelector('[data-testid="complaint-creation-date"]').innerText;
            const cidade = localizacao.split(' - ')[0];
            const estado = localizacao.split(' - ')[1];
            return { cidade, estado, createdAt: data };
        })
    );
    Object.assign(reclamacao, additionalData[0]);
    
    if (additionalData.length > 0) { // verifica se há dados no objeto
        const convertedData = additionalData.forEach(item => { // converte os dados do objeto para transformar em datetime
            // ...item, // espalha o objeto
            item.createdAt = converteData(item.createdAt); // transforma em datetime
        });
        Object.assign(reclamacao, convertedData);
    }
    //await reclamacaoController.upsertDados(reclamacao);

}
