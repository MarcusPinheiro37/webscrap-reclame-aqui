import converteData from '../helper/conversorDataHelper.js';
import ReclamacaoController from '../controllers/ReclamacaoController.js';
import aceitaCookies from '../helper/aceitaCookiesHelper.js';


const reclamacaoController = new ReclamacaoController(); // inicia o controller

export default async function extraiDataLocal(reclamacao, page) {
    await page.goto(reclamacao.url, {timeout: 300000}); // vai para a url da reclamacao na nova pagina criada
    
    aceitaCookies(page); // aceita os cookies
    
    const additionalData = await page.$$eval('.sc-lzlu7c-5.jkjEWj', (anchors) => // procura pela classe que localização e data estão
        anchors.map((anchor) => {
            const localizacao = anchor.querySelector('[data-testid="complaint-location"]').innerText; // extrai a localização
            const data = anchor.querySelector('[data-testid="complaint-creation-date"]').innerText; // extrai a data
            const cidade = localizacao.split(' - ')[0]; // separa cidade de localização
            const estado = localizacao.split(' - ')[1]; // separa estado de localização
            return {cidade, estado, data}; // envia o objeto
        })
    );
    
    if (additionalData.length > 0) { // verifica se há dados no objeto
        const convertedData = additionalData.map(item => ({ // converte os dados do objeto para transformar em datetime
            ...item, // espalha o objeto
            createdAt: converteData(item.data) // transforma em datetime
        }));
        Object.assign(reclamacao, convertedData[0]);
    }
    await reclamacaoController.upsertDados(reclamacao);
}
