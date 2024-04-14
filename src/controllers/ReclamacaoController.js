import ReclamacoeServices from '../services/ReclamacoesServices.js';
import Controller from './Controller.js';

const reclamacoeServices = new ReclamacoeServices;

export default class ReclamacaoController extends Controller{
    constructor(){
        super(reclamacoeServices);
    }
}