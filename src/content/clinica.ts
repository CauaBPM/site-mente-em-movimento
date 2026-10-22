/**
 * DADOS INSTITUCIONAIS DA CLÍNICA
 * ------------------------------------------------------------------
 * Fonte única para nome, endereço, contatos e horário. Tudo o que está
 * aqui com status "confirmado" pode aparecer no site. Itens "pendente"
 * NUNCA são renderizados — ver PENDENCIAS.md para o que falta confirmar.
 */

export type Status = 'confirmado' | 'pendente';

export interface ItemPendente<T> {
  status: Status;
  valor: T | null;
}

export const clinica = {
  nome: 'Mente em Movimento',
  nomeCompleto: 'Mente em Movimento – Centro de Saúde Mental e Cognitiva',
  /** Usado em og:site_name e nos dados estruturados para diferenciar de homônimos. */
  nomeComCidade: 'Mente em Movimento – Vila Velha, ES',
  descritor: 'Centro de Saúde Mental e Cognitiva',
  razaoSocial: 'Mente em Movimento Centro de Saúde Mental e Cognitiva LTDA',
  cnpj: '62.157.510/0001-24',

  endereco: {
    logradouro: 'Rua Sebastião Silveira, 24',
    bairro: 'Praia das Gaivotas',
    cidade: 'Vila Velha',
    uf: 'ES',
    cep: '29102-571',
    pais: 'BR',
    /** Versão curta usada na abertura da página inicial. */
    curto: 'Praia das Gaivotas · Vila Velha – ES',
  },

  geo: { latitude: -20.373898, longitude: -40.3131584 },

  telefone: {
    exibicao: '(27) 99792-9358',
    e164: '+5527997929358',
    /** Formato usado nos dados estruturados (schema.org). */
    schema: '+55-27-99792-9358',
    whatsappNumero: '5527997929358',
  },

  horario: {
    texto: 'Segunda a sexta, das 7h às 20h',
    /** Versão em minúsculas, para usar no meio de frases. */
    frase: 'de segunda a sexta, das 7h às 20h',
    curto: 'Seg. a sex., 7h–20h',
    observacao: 'Atendimento com hora marcada.',
    dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    abre: '07:00',
    fecha: '20:00',
  },

  instagram: {
    usuario: '@menteemmovimentovv',
    url: 'https://www.instagram.com/menteemmovimentovv/',
  },

  /** Mensagem padrão do WhatsApp — não pede nenhum dado de saúde. */
  mensagemWhatsAppPadrao: 'Olá! Gostaria de informações sobre atendimento na Mente em Movimento.',

  /**
   * Perfil oficial no Google (avaliações).
   * PENDENTE: substituir `perfilConfirmado` pelo link "Compartilhar" do Perfil da
   * Empresa no Google. Até lá, o link "Ver avaliações no Google" abre a busca
   * pelo nome + endereço da clínica no Google Maps, e o perfil não entra no `sameAs`.
   */
  google: {
    perfilConfirmado: null as string | null,
    buscaMaps:
      'https://www.google.com/maps/search/?api=1&query=Mente+em+Movimento+Centro+de+Sa%C3%BAde+Mental+e+Cognitiva%2C+Rua+Sebasti%C3%A3o+Silveira+24%2C+Vila+Velha+ES',
    rotas: 'https://www.google.com/maps/dir/?api=1&destination=-20.373898%2C-40.3131584',
    /** Mapa incorporado — só é carregado depois do clique do visitante. */
    embed: 'https://www.google.com/maps?q=-20.373898,-40.3131584&z=16&hl=pt-BR&output=embed',
  },

  /** E-mail do cadastro da Receita. NÃO exibir até a clínica confirmar. */
  email: { status: 'pendente', valor: 'clinicamenteemmovimento@gmail.com' } as ItemPendente<string>,

  /** Número do CNES. Exibido no rodapé só quando confirmado. */
  cnes: { status: 'pendente', valor: null } as ItemPendente<string>,

  /** Responsáveis técnicos (nome + registro). Exibidos no rodapé só quando confirmados. */
  responsaveisTecnicos: {
    status: 'pendente',
    valor: null,
  } as ItemPendente<{ nome: string; registro: string }[]>,

  /**
   * Modalidades de atendimento confirmadas pela clínica (out/2026): presencial, online e a domicílio.
   * Disponibilidade por especialidade, plataforma do online e área/condições do domicílio
   * NÃO foram informadas — o site orienta a consultar a equipe (ver PENDENCIAS.md).
   */
  modalidades: ['Presencial', 'Online', 'A domicílio'],

  /** Convênios aceitos — não publicar sem confirmação. */
  convenios: { status: 'pendente', valor: null } as ItemPendente<string[]>,

  especialidades: ['Psiquiatria', 'Neuropsicologia', 'Psicologia', 'Psicopedagogia'],
  /** Serviços de apoio (sem página própria; descritos em src/content/servicos.ts). */
  servicos: ['Reforço escolar', 'Orientação parental'],
  publicos: ['Crianças', 'Adolescentes', 'Adultos', 'Idosos'],

  /** Cidades atendidas (dados estruturados: areaServed). */
  areaAtendida: ['Vila Velha', 'Vitória', 'Serra', 'Cariacica'],

  /** Frases de propósito, nas palavras da própria clínica. */
  proposito: {
    frase: 'Cada história merece um cuidado único.',
    integral: 'Cuidar é olhar para a pessoa de forma integral.',
  },
} as const;

export function confirmado<T>(item: ItemPendente<T>): item is { status: 'confirmado'; valor: T } {
  return item.status === 'confirmado' && item.valor !== null;
}

export const enderecoCompleto = `${clinica.endereco.logradouro} – ${clinica.endereco.bairro}, ${clinica.endereco.cidade} – ${clinica.endereco.uf}, ${clinica.endereco.cep}`;
