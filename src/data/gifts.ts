import type { Gift } from '@/types/gift'

/**
 * The gift list. Amounts are in cents (R$ 180,00 = 18000).
 * Gifts without `priceInCents` show "Valor a definir" and let guests choose the amount.
 * Photos live in `public/gifts`, square and around 720px wide.
 */
export const gifts: Gift[] = [
  {
    id: 'dinnerware-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Aparelho de jantar 10 peças',
    description: 'Oxford Ryo, cor Pink Sand',
    priceInCents: 25180,
    imageUrl: '/gifts/dinnerware-set.webp',
    productUrl:
      'https://shopee.com.br/Conjunto-de-Jantar-10-P%C3%A7s-Ryo-Pink-Sand-Oxford-i.513070918.22992991974?extraParams=%7B%22display_model_id%22%3A169708334068%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'ceramic-serving-dish',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Travessa de cerâmica rosa',
    description: 'Retangular, 32,5 cm',
    priceInCents: 8835,
    imageUrl: '/gifts/ceramic-serving-dish.webp',
    productUrl:
      'https://shopee.com.br/Travessa-Retangular-Grande-em-Cer%C3%A2mica-Rosa-32-5cm-i.277113759.20397666673?extraParams=%7B%22display_model_id%22%3A189162222027%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'glass-baking-dishes',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Kit 2 assadeiras de vidro com tampa',
    description: 'Marinex Seletta 3,5 L, rosa claro',
    priceInCents: 12350,
    imageUrl: '/gifts/glass-baking-dishes.webp',
    productUrl:
      'https://shopee.com.br/Kit-2-Assadeiras-Travessa-Marinex-Seletta-3-5l-C-Tampa-Rosa-claro-i.951889959.58264819513?extraParams=%7B%22display_model_id%22%3A219192202798%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'crystal-water-glasses',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Jogo de 6 taças de cristal',
    description: 'Para água, 460 ml, Bohemia',
    priceInCents: 16066,
    imageUrl: '/gifts/crystal-water-glasses.webp',
    productUrl:
      'https://shopee.com.br/Jogo-De-Ta%C3%A7as-Para-%C3%81gua-Em-Cristal-Xtra-Com-6-Pe%C3%A7as-460ml-Bohemia-i.1263373011.22197931015?extraParams=%7B%22display_model_id%22%3A189167420959%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'egg-holder-hen',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Galinha porta-ovos',
    description: 'Cerâmica pintada à mão, coleção Alento ArtDecor',
    priceInCents: 16625,
    imageUrl: '/gifts/egg-holder-hen.webp',
    productUrl:
      'https://shopee.com.br/GALINHA-PORTA-OVOS-PINTADA-A-M%C3%83O-E-LAQUEADA-ALTO-BRILHO-COLE%C3%87%C3%83O-ALENTO-ARTDECOR-i.302687316.58217870155?extraParams=%7B%22display_model_id%22%3A219626624060%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'glass-pitcher',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Jarra de vidro com tampa de bambu',
    description: 'Vidro borossilicato, pra água e suco',
    priceInCents: 3999,
    imageUrl: '/gifts/glass-pitcher.webp',
    productUrl:
      'https://shopee.com.br/Jarra-De-Vidro-Borossilicato-Com-Tampa-Bambu-Agua-Suco-i.1107305320.58211480170?extraParams=%7B%22display_model_id%22%3A209622418883%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'salt-sugar-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Saleiro e açucareiro de cerâmica',
    description: 'Rosa, com tampa de bambu',
    priceInCents: 7764,
    imageUrl: '/gifts/salt-sugar-set.webp',
    productUrl:
      'https://shopee.com.br/Conjunto-Saleiro-e-A%C3%A7ucareiro-com-Tampa-de-Bambu-Sofisticado-e-Resistente-em-Cer%C3%A2mica-Colorida-i.570228734.58213655953?extraParams=%7B%22display_model_id%22%3A238809381563%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'snack-tray-stand',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Petisqueira de bambu 2 andares',
    description: 'Pra servir frios e petiscos',
    priceInCents: 5290,
    imageUrl: '/gifts/snack-tray-stand.webp',
    productUrl:
      'https://shopee.com.br/Petisqueira-de-Bambu-2-Andares-Organizador-para-Servir-Mesa-Posta-Festa-Eventos-Petiscos-Frios-Bandeja-Dupla-Expositor-i.1628958892.23099680464?extraParams=%7B%22display_model_id%22%3A109875300478%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'heart-trays',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Kit 3 bandejas de coração',
    description: 'MDF, pra decorar a mesa',
    priceInCents: 2495,
    imageUrl: '/gifts/heart-trays.webp',
    productUrl:
      'https://shopee.com.br/Kit-3-Bandejas-de-Cora%C3%A7%C3%A3o-em-MDF-Decora%C3%A7%C3%A3o-Mesa-***-QUEIMA-DE-ESTOQUE***-!!!!!-i.1640896464.23394664448?extraParams=%7B%22display_model_id%22%3A199181830931%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'stainless-cookware-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Jogo de panelas de inox',
    description: 'Versão com alça',
    priceInCents: 73488,
    imageUrl: '/gifts/stainless-cookware-set.webp',
    productUrl: 'https://www.amazon.com.br/dp/B076B9N81Q?th=1',
  },
  {
    id: 'stainless-cutlery-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Faqueiro de inox',
    priceInCents: 19989,
    imageUrl: '/gifts/stainless-cutlery-set.webp',
    productUrl: 'https://www.amazon.com.br/dp/B085W5PJT6',
  },
  {
    id: 'spice-rack',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Porta-temperos giratório de inox',
    description: '12 potes de vidro',
    priceInCents: 6963,
    imageUrl: '/gifts/spice-rack.webp',
    productUrl:
      'https://shopee.com.br/Porta-Tempero-Condimento-Inox-12-Potes-Suporte-Girat%C3%B3rio-i.1564303923.58266707473?extraParams=%7B%22display_model_id%22%3A209193401909%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'pepper-grinder',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Moedor de pimenta e sal de madeira',
    description: 'Manual, 21 cm, madeira escura',
    priceInCents: 3399,
    imageUrl: '/gifts/pepper-grinder.webp',
    productUrl:
      'https://shopee.com.br/Moedor-Pimenta-Sal-Condimento-Tempero-Gr%C3%A3o-Manual-De-Madeira-21-cm-ESCURO-i.329981308.20729683496?extraParams=%7B%22display_model_id%22%3A211534228899%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'hand-blender',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Mixer 3 em 1 Oster',
    description: '750 W, inox e preto, 220 V',
    priceInCents: 21841,
    imageUrl: '/gifts/hand-blender.webp',
    productUrl:
      'https://www.magazineluiza.com.br/mixer-3-em-1-oster-750w-inox-e-preto-power-omix570-velocidade-ajustavel/p/240244300/ep/mixr/',
  },
  {
    id: 'stand-mixer',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Batedeira planetária Britânia rosa',
    description: '900 W, tigela de 5 L, 220 V',
    priceInCents: 34260,
    imageUrl: '/gifts/stand-mixer.webp',
    productUrl:
      'https://www.mercadolivre.com.br/batedeira-planetaria-britania-rosa-900w-tigela-de-5l-bbpe02a/up/MLBU5221110112?pdp_filters=item_id%3AMLB7652004436',
  },
  {
    id: 'stainless-utensil-set',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Kit 10 utensílios de inox',
    description: 'Concha, escumadeira, pegador de massa e salada e mais',
    priceInCents: 5998,
    productUrl:
      'https://shopee.com.br/Kit-Utensilio-Para-Cozinha-100-Inox-Colher-Concha-Escumadeira-Pegador-Massa-Salada-Mini-concha-i.1472422873.29493993164?extraParams=%7B%22display_model_id%22%3A244139429599%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'teak-cutting-board',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Tábua Tramontina Cubus de teca',
    description: 'Madeira invertida, 45 x 34 cm',
    priceInCents: 23740,
    productUrl:
      'https://www.tramontina.com.br/tabua-cubus-para-churrasco-tramontina-retangular-em-madeira-invertida-teca-com-acabamento-em-oleo-mineral-45x34-cm./13460351.html',
  },
  {
    id: 'bbq-board',
    kind: 'simple',
    roomId: 'kitchen',
    name: 'Tábua de churrasco Tramontina',
    description: 'Madeira, modelo 22399',
    priceInCents: 10326,
    productUrl: 'https://www.amazon.com.br/dp/B07GS3MLJX?psc=1',
  },
  {
    id: 'dishwasher',
    kind: 'pooled',
    roomId: 'kitchen',
    name: 'Lava-louças Electrolux',
    description: '14 serviços, inox, com programa lava e seca em 50 minutos',
    goalInCents: 354900,
    raisedInCents: 0,
    suggestedSharesInCents: [5000, 10000, 20000],
    imageUrl: '/gifts/dishwasher.webp',
    productUrl:
      'https://loja.electrolux.com.br/lava-louca-electrolux-14-servicos-inox-com-programa-lava---seca-50-min--ls14e-/p',
  },
  {
    id: 'robot-vacuum',
    kind: 'pooled',
    roomId: 'living-room',
    name: 'Robô aspirador Xiaomi',
    description: 'Robot Vacuum H50 Pro, branco, 220 V',
    goalInCents: 333000,
    raisedInCents: 0,
    suggestedSharesInCents: [5000, 10000, 20000],
    imageUrl: '/gifts/robot-vacuum.webp',
    productUrl:
      'https://www.mercadolivre.com.br/robo-aspirador-xiaomi-robot-vacuum-h50-pro-branco-220v/p/MLB69124283',
  },
  {
    id: 'full-length-mirror',
    kind: 'simple',
    roomId: 'bedroom',
    name: 'Espelho portal de corpo inteiro',
    description: '160 x 70 cm, moldura caramelo',
    priceInCents: 21831,
    imageUrl: '/gifts/full-length-mirror.webp',
    productUrl:
      'https://shopee.com.br/Espelho-Portal-Decorativo-160x70cm-Corpo-Inteiro-Grande-Para-Sala-Quarto-Hall-Banheiro-i.1165360419.55561180724?extraParams=%7B%22display_model_id%22%3A420973892754%2C%22model_selection_logic%22%3A3%7D',
  },
  {
    id: 'bath-towels',
    kind: 'simple',
    roomId: 'bathroom',
    name: 'Jogo de toalhas de banho',
    description: 'Super Twist, 70 x 140 cm, cinza',
    priceInCents: 25670,
    imageUrl: '/gifts/bath-towels.webp',
    productUrl: 'https://www.amazon.com.br/dp/B0GRVR1C36?th=1',
  },
  {
    id: 'bow-bathroom-set',
    kind: 'simple',
    roomId: 'bathroom',
    name: 'Kit de banheiro com laço',
    description: 'Porta-sabonete e porta-escova de porcelana rosa',
    priceInCents: 9499,
    imageUrl: '/gifts/bow-bathroom-set.webp',
    productUrl:
      'https://shopee.com.br/Kit-Menina-Higiene-Banheiro-Porcelana-Cer%C3%A2mica-La%C3%A7o-Rosa-Porta-Sabonete-e-Escova-Princesa-Fofo-i.455831695.45362096438',
  },
  {
    id: 'soap-dispenser',
    kind: 'simple',
    roomId: 'bathroom',
    name: 'Porta-sabonete líquido de cerâmica',
    description: 'Modelo rostinho',
    priceInCents: 2497,
    imageUrl: '/gifts/soap-dispenser.webp',
    productUrl:
      'https://shopee.com.br/Porta-Sabonete-L%C3%ADquido-de-Cer%C3%A2mica-com-V%C3%A1lvula-Dispenser-Rostinho-e-Patinha-i.1463454780.56315096721?extraParams=%7B%22display_model_id%22%3A311295394611%2C%22model_selection_logic%22%3A3%7D',
  },
]
