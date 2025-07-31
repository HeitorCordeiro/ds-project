export const PONTUACAO_TIERS = {
  OURO: 75,
  PRATA: 46,
  BRONZE: 5,
};

export const DESCRICOES_TIERS = {
  OURO: 'Empresas líderes em responsabilidade social, com impacto significativo e cultura de engajamento enraizada.',
  PRATA: 'Empresas com bom nível de engajamento e programas sociais consistentes.',
  BRONZE: 'Empresas em fase inicial ou com nível básico de engajamento social.',
  NENHUM: 'A empresa ainda não possui um selo.',
};

export const PONTUACAO_POR_ONGS_ATINGIDAS = [
  { min: 9, pontos: 25, detalhe: '9 ou mais ONGs parceiras' },
  { min: 7, pontos: 20, detalhe: '7 a 8 ONGs parceiras' },
  { min: 5, pontos: 15, detalhe: '5 a 6 ONGs parceiras' },
  { min: 3, pontos: 10, detalhe: '3 a 4 ONGs parceiras' },
  { min: 1, pontos: 5, detalhe: '1 a 2 ONGs parceiras' },
  { min: 0, pontos: 0, detalhe: 'Nenhuma ONG parceira' },
];

export const PONTUACAO_POR_ODS_ATINGIDOS = [
  { min: 9, pontos: 25, detalhe: '9 ou mais ODSs abordados' },
  { min: 7, pontos: 20, detalhe: '7 a 8 ODSs abordados' },
  { min: 5, pontos: 15, detalhe: '5 a 6 ODSs abordados' },
  { min: 3, pontos: 10, detalhe: '3 a 4 ODSs abordados' },
  { min: 1, pontos: 5, detalhe: '1 a 2 ODSs abordados' },
  { min: 0, pontos: 0, detalhe: 'Nenhum ODS abordado' },
];

export const PONTUACAO_POR_VALOR_DOADO = [
  { min: 50000, pontos: 25, detalhe: 'Acima de R$50.000 doados' },
  { min: 25000, pontos: 20, detalhe: 'Entre R$25.000 e R$49.999 doados' },
  { min: 10000, pontos: 15, detalhe: 'Entre R$10.000 e R$24.999 doados' },
  { min: 5000, pontos: 10, detalhe: 'Entre R$5.000 e R$9.999 doados' },
  { min: 1000, pontos: 5, detalhe: 'Entre R$1.000 e R$4.999 doados' },
  { min: 0, pontos: 0, detalhe: 'Abaixo de R$1.000 doados' },
];

export const PONTUACAO_POR_ACOES_REALIZADAS = [
  { min: 10, pontos: 25, detalhe: '10 ou mais ações realizadas' },
  { min: 8, pontos: 20, detalhe: '8 a 9 ações realizadas' },
  { min: 6, pontos: 15, detalhe: '6 a 7 ações realizadas' },
  { min: 4, pontos: 10, detalhe: '4 a 5 ações realizadas' },
  { min: 1, pontos: 5, detalhe: '1 a 3 ações realizadas' },
  { min: 0, pontos: 0, detalhe: 'Nenhuma ação realizada' },
];
