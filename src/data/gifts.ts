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
