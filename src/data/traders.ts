export const traderNames = [
  'Julia M.', 'Carlos A.', 'Fernanda S.', 'Rodrigo T.', 'Mariana D.',
  'Gustavo L.', 'Paula C.', 'Rafael P.', 'Isabela R.', 'André F.',
  'Amanda G.', 'Bruno H.', 'Daniela J.', 'Eduardo K.', 'Camila B.',
  'Fábio M.', 'Larissa N.', 'Diego O.', 'Sofia Q.', 'Leonardo U.',
  'Bianca V.', 'Victor Z.', 'Renata W.', 'Felipe X.', 'Larissa Y.',
  'Marcelo Z.', 'Letícia I.', 'Henrique T.', 'Antônia S.', 'Samuel O.',
  'Veronica G.', 'Thiago L.', 'Marcos E.', 'Aline P.', 'Rodrigo V.',
  'Juliana R.', 'Rogério D.', 'Carolina F.', 'Mauricio J.', 'Natália K.',
  'Igor C.', 'Priscila O.', 'Alexandre S.', 'Julia B.', 'Victor R.',
  'Patrícia A.', 'Roberto N.', 'Cristina Q.', 'Felipe A.', 'Gabriel T.',
  'Heloísa M.', 'Bruno F.', 'Camila D.', 'Ricardo L.', 'Marcela E.'
];

export const tradingCategories = {
  CRIPTOS: ["BTC/USD", "XRP/USD", "BCH/USD", "LTC/USD", "ETH/USD"],
  AÇÕES: ["Apple", "Amazon", "McDonalds", "Microsoft", "Tesla", "GOLD", "SILVER"],
  "PARES DE MOEDAS": ["EUR/USD", "GBP/CHF", "GBP/JPY", "EUR/JPY", "USD/CAD", "USD/CHF", "USD/JPY", "GBP/USD", "AUD/USD", "NZD/USD"]
};

export const getAllTradingPairs = () => {
  return Object.values(tradingCategories).flat();
};