
import { Gift, GiftCategory } from './types';

// Lista REAL de presentes solicitada (Imagens estilo catálogo/produto)
export const INITIAL_GIFTS: Gift[] = [
  // --- COZINHA ---
  {
    id: 'c1',
    name: 'Jogo de panela',
    category: GiftCategory.COZINHA,
    image: 'https://t62533.vteximg.com.br/arquivos/ids/872074-1000-1000/6055-317-1-G-1.jpg?v=638070745681000000', // Atualizado
    claimed: false,
  },
  {
    id: 'c2',
    name: 'Panela de pressão',
    category: GiftCategory.COZINHA,
    image: 'https://casafreitas2.vteximg.com.br/arquivos/ids/281594-1000-1000/2181000300003-panela-de-pressao-4-5l-aluminio-panelux%20-4-.jpg.jpg?v=638821325234600000', // Atualizado
    claimed: false,
  },
  {
    id: 'c3',
    name: 'Conjunto de faca',
    category: GiftCategory.COZINHA,
    image: 'https://assets.tramontina.com.br/upload/tramon/imagens/CUT/23498048PDM001G.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c4',
    name: 'Porta detergente + porta esponja + rodinho de pia',
    category: GiftCategory.COZINHA,
    image: 'https://http2.mlstatic.com/D_NQ_NP_763853-MLA99642663748_122025-O.webp', // Atualizado
    claimed: false,
  },
  {
    id: 'c5',
    name: 'Lixeira de pia',
    category: GiftCategory.COZINHA,
    image: 'https://cdn.awsli.com.br/2500x2500/0/239/produto/261494604/lixeira-para-pia-de-cozinha-4-7-litros-trium-preto-1-q0gg4m0142.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c6',
    name: 'Tábua de cortar',
    category: GiftCategory.COZINHA,
    image: 'https://images.tcdn.com.br/img/img_prod/771119/tabua_bambu_basic_1109_1_20201022153356.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c7',
    name: 'Forma de gelo',
    category: GiftCategory.COZINHA,
    image: 'https://cdn.awsli.com.br/800x800/1971/1971619/produto/203611944/captura-de-tela-2022-11-11-182853-dcxqmb.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c8',
    name: 'Conjunto de talher',
    category: GiftCategory.COZINHA,
    image: 'https://images.tcdn.com.br/img/img_prod/836117/jogo_de_talheres_25ps_e_porta_talher_preto_origina_1_20251224121419_b066c1640564.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c9',
    name: 'Conjunto de pratos',
    category: GiftCategory.COZINHA,
    image: 'https://a-static.mlcdn.com.br/800x600/conjunto-12-pratos-fundos-de-vidro-22cm-transparente-design-elegante-e-resistente-cedar-glass/suascomprasshop/prat12-liso/8b0fc5c0dbce1cce9d380e3cf8761d97.jpeg', // Atualizado
    claimed: false,
  },
  {
    id: 'c10',
    name: 'Conjunto de copos',
    category: GiftCategory.COZINHA,
    image: 'https://precolandia.vtexassets.com/arquivos/ids/247572-800-450?v=638551794853970000&width=800&height=450&aspect=true', // Atualizado
    claimed: false,
  },
  {
    id: 'c11',
    name: 'Forma',
    category: GiftCategory.COZINHA,
    image: 'https://cdn.leroymerlin.com.br/products/forma_assadeira_retangular_47x35x5,5_cm_aluminio_1567076812_71b2_600x600.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c12',
    name: 'Jarra de vidro',
    category: GiftCategory.COZINHA,
    image: 'https://io.convertiez.com.br/m/lojadochefutilidades/shop/products/images/1220/medium/jarra-vidro-bar-1550ml-5414-nadir_1469.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c13',
    name: 'Potes de mantimentos',
    category: GiftCategory.COZINHA,
    image: 'https://images.tcdn.com.br/img/img_prod/1078711/potes_hermeticos_kit_5_porta_mantimentos_indicador_de_data_363_1_ecb7694df017769bce1307dac0db0720.png', // Atualizado
    claimed: false,
  },
  {
    id: 'c14',
    name: 'Triturador de cebola',
    category: GiftCategory.COZINHA,
    image: 'https://a-static.mlcdn.com.br/1500x1500/triturador-e-moedor-manual-alho-cebola-temperos-fruta-500ml-desert-ecom/olistsp/osp89jihoe2zxin0/fb028c3eecf18c7b3533b5c0b6de59ce.jpeg', // Atualizado
    claimed: false,
  },
  {
    id: 'c15',
    name: 'Utensílios para servir',
    category: GiftCategory.COZINHA,
    image: 'https://http2.mlstatic.com/D_NQ_NP_637967-MLB93569019366_102025-O-conjunto-de-utensilios-para-servir-em-aco-inoxidavel.webp', // Atualizado
    claimed: false,
  },
  {
    id: 'c16',
    name: 'Kit de potes para temperos',
    category: GiftCategory.COZINHA,
    image: 'https://images.tcdn.com.br/img/img_prod/1042899/kit_mini_block_potes_hermeticos_temperos_16_unidades_1025_2_57624760620c65d676323d3b936ae108.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c17',
    name: 'Panos de prato',
    category: GiftCategory.COZINHA,
    image: 'https://cdn.awsli.com.br/2500x2500/1274/1274074/produto/78721785/pano-de-prato-rdc-com-barra-estampada-variados-100-algodao-41x66cm-9d62c3e1.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c18',
    name: 'Escorredor de macarrão',
    category: GiftCategory.COZINHA,
    image: 'https://images.tcdn.com.br/img/img_prod/692716/escorredor_de_macarrao_inox_24cm_31_1_20221107155655.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'c19',
    name: 'Canecas',
    category: GiftCategory.COZINHA,
    image: 'https://yukinamarinho.com.br/wp-content/uploads/2024/06/12.jpg', // Atualizado
    claimed: false,
  },

  // --- ELÉTRONS (ELETRODOMÉSTICOS) ---
  {
    id: 'e1',
    name: 'Batedeira',
    category: GiftCategory.ELETRO,
    image: 'https://t62533.vteximg.com.br/arquivos/ids/943427-1000-1000/B-44-B---Foto-01.jpg?v=638294365126400000', // Atualizado
    claimed: false,
  },
  {
    id: 'e2',
    name: 'Liquidificador',
    category: GiftCategory.ELETRO,
    image: 'https://m.media-amazon.com/images/I/51N3Xi4JJML.jpg', // Atualizado
    claimed: false,
  },

  // --- QUARTO ---
  {
    id: 'q1',
    name: 'Jogo de lençol',
    category: GiftCategory.QUARTO,
    image: 'https://images.yampi.me/assets/stores/donadacasaenxoval/uploads/images/jogo-de-lencol-percal-160-fios-algodao-2-pecas-solteiro-colecao-classic-grid-665ef574e0ba4-large.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'q2',
    name: 'Manta',
    category: GiftCategory.QUARTO,
    image: 'https://precolandia.vtexassets.com/arquivos/ids/188479/Manta-Microfibra-Casal-Azul-Jeans-Corttex-precolandia-618195-0d.jpg?v=638346451120500000', // Atualizado
    claimed: false,
  },
  {
    id: 'q3',
    name: 'Jogo de travesseiro + capas',
    category: GiftCategory.QUARTO,
    image: 'https://m.media-amazon.com/images/I/81vK3oCbByL._AC_UF894,1000_QL80_.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'q4',
    name: 'Cortina',
    category: GiftCategory.QUARTO,
    image: 'https://emporiodolencol.vtexassets.com/arquivos/ids/176871/cortina-blackout-linen-bella-janela-AREIA.jpg?v=638671244973700000', // Atualizado
    claimed: false,
  },

  // --- BANHEIRO ---
  {
    id: 'b1',
    name: 'Jogo de toalha de banho',
    category: GiftCategory.BANHEIRO,
    image: 'https://shopcama.vteximg.com.br/arquivos/ids/401156-650-650/Jogo-de-Toalhas-de-Banho-4-Pecas-Jacquard-Trento-Corttex-Branca-Cinza.jpg?v=638564161289070000', // Atualizado
    claimed: false,
  },
  {
    id: 'b2',
    name: 'Jogo de tapete',
    category: GiftCategory.BANHEIRO,
    image: 'https://images.tcdn.com.br/img/img_prod/600194/jogo_de_tapete_banheiro_jolitex_absolut_03_pecas_lace_8937_1_2b313ececec96aab2eb210dd70e988e6_20240916105721.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'b3',
    name: 'Escova sanitária + porta sabonete',
    category: GiftCategory.BANHEIRO,
    image: 'https://cdn.leroymerlin.com.br/products/kit_banheiro_01_porta_sabonete_liquido_e_01_porta_escova_em_c_1572167197_0e94_600x600.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'b4',
    name: 'Lixeira + porta sabonete líquido',
    category: GiftCategory.BANHEIRO,
    image: 'https://cdn.awsli.com.br/600x1000/1866/1866589/produto/370048990/3554b4f82f45662371be5aa935d8a72d-mbcm2owsyb.jpg', // Atualizado
    claimed: false,
  },

  // --- LIMPEZA ---
  {
    id: 'l1',
    name: 'Cesto de roupa suja',
    category: GiftCategory.LIMPEZA,
    image: 'https://artique.com.br/cdn/shop/files/cesto-roupa-suja-70-litros-1.webp?v=1723636977&width=2048', // Atualizado
    claimed: false,
  },
  {
    id: 'l2',
    name: 'Balde',
    category: GiftCategory.LIMPEZA,
    image: 'https://astrasa.vteximg.com.br/arquivos/ids/308398-1000-1000/BP12-MDTBR_1.jpg?v=638687174880400000', // Atualizado
    claimed: false,
  },
  {
    id: 'l3',
    name: 'Vassoura',
    category: GiftCategory.LIMPEZA,
    image: 'https://normatel.fbitsstatic.net/img/p/vassoura-uso-interno-12x1-condor-85343/272389.jpg?w=770&h=770&v=no-value', // Atualizado
    claimed: false,
  },
  {
    id: 'l4',
    name: 'Rodo',
    category: GiftCategory.LIMPEZA,
    image: 'https://cdn.awsli.com.br/2500x2500/1027/1027618/produto/55593641/a16628d324.jpg', // Atualizado
    claimed: false,
  },
  {
    id: 'l5',
    name: 'Pá de lixo',
    category: GiftCategory.LIMPEZA,
    image: 'https://cdn.awsli.com.br/800x800/153/153933/produto/4866658/f35c9e6b7b.jpg', // Atualizado para nova imagem
    claimed: false,
  },
  {
    id: 'l6',
    name: 'Varal portátil ou prendedores de roupa',
    category: GiftCategory.LIMPEZA,
    image: 'https://www.mandiali.com.br/dados_empresa/imagens/produtos/0750/19316_01_kit-varal-retratil-de-chao-1-43-m-preto-com-abas-slim-portatil-48-prendedores-lavanderia-mor.webp', // Atualizado
    claimed: false,
  }
];

export const CATEGORY_COLORS: Record<GiftCategory, string> = {
  [GiftCategory.COZINHA]: 'bg-amber-50 text-amber-900 border-amber-200 ring-amber-100',
  [GiftCategory.ELETRO]: 'bg-slate-50 text-slate-900 border-slate-200 ring-slate-100',
  [GiftCategory.QUARTO]: 'bg-rose-50 text-rose-900 border-rose-200 ring-rose-100',
  [GiftCategory.BANHEIRO]: 'bg-cyan-50 text-cyan-900 border-cyan-200 ring-cyan-100',
  [GiftCategory.LIMPEZA]: 'bg-teal-50 text-teal-900 border-teal-200 ring-teal-100',
  [GiftCategory.ESPECIAL]: 'hidden',
};
