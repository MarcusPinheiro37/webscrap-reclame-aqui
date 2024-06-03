# WebScraping Reclame Aqui

## Descrição

Este projeto consiste em uma série de scripts desenvolvidos em Node.js para extrair e analisar empresas listadas no site Reclame Aqui. Os scripts utilizam Puppeteer para navegar e extrair dados do site, que são então salvos e convertidos para diferentes formatos para análises futuras.

## Estrutura do Projeto

- `src/`
  - `extratos/`
    - `desempenho.js`: Script principal que extrai dados de desempenho no Reclame Aqui.
    - `extraiReclamacoes.js`: Script que navega pelas páginas da empresa no Reclame Aqui, coletando títulos, URLs e situações das reclamações.
  - `helper/`
    - `aceitaCookiesHelper.js`: Função auxiliar usada para aceitar cookies automaticamente nos sites alvo, facilitando a navegação automatizada.
    - `conversorDataHelper.js`: Função auxiliar que converte datas no formato "dd/mm/yyyy às hh:mm" para objetos JavaScript `Date`, ajustando o fuso horário para o horário de Brasília (GMT-3).
    - `extraiDataLocalReclamacao.js`: Script que extrai informações adicionais como local e data de criação de cada reclamação.
    - `salvaPlanilha.js`: Função auxiliar que converte dados em um formato JSON para uma planilha do Excel, criando um novo arquivo ou atualizando um existente se necessário.

## Dependências

Este projeto utiliza várias bibliotecas para facilitar a extração e manipulação de dados:

- `dotenv`: Carrega variáveis de ambiente a partir de um arquivo `.env`.
- `puppeteer` e `puppeteer-extra`: Navegação automatizada e extração de dados de páginas web.
- `puppeteer-extra-plugin-stealth`: Melhora a capacidade do Puppeteer de simular um navegador real, evitando detecções de bot.
- `xlsx` e `excel4node`: Manipulação e salvamento de dados em formatos de planilhas Excel.
- `sequelize` e `mysql2`: Opcionalmente, para integração com banco de dados MySQL para armazenamento de dados.

## Scripts

- `npm run extrai`: Executa o script `extraiReclamacoes.js`.
- `npm run extrainota`: Executa o script `desempenho.js`.

## Configuração

1. Clone o repositório para sua máquina local.
2. Instale as dependências usando:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente necessárias no arquivo `.env`.

## Uso

Para executar os scripts, navegue até o diretório do projeto e execute os comandos apropriados. Por exemplo, para `desempenho.js`:
```
node src/extratos/desempenho.js
```
Para `extraiReclamacoes.js`, execute:
```
node src/extratos/extraiReclamacoes.js
```

Os dados extraídos serão salvos na pasta especificada no arquivo de configuração `.env` e convertidos para o formato de planilha conforme especificado.

## Contribuições

Contribuições são bem-vindas. Por favor, abra um issue para discutir o que você gostaria de mudar ou enviar um pull request com suas sugestões.