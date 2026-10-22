/**
 * TEXTOS DA PÁGINA INICIAL (/)
 * Ênfase em títulos: *palavra* vira itálico (use em uma ou duas palavras).
 * Links: [texto](/caminho).
 */
import { clinica } from '../clinica';
import { ilustracoes } from '../ilustracoes';

export const inicio = {
  seo: {
    titulo: 'Mente em Movimento | Saúde Mental e Cognitiva em Vila Velha – ES',
    descricao:
      'Psiquiatria, neuropsicologia, psicologia, psicopedagogia, reforço escolar e orientação parental em Vila Velha – ES. Presencial, online e a domicílio.',
  },

  abertura: {
    sobretitulo: 'Centro de Saúde Mental e Cognitiva',
    titulo: 'Cuidado em saúde mental e cognitiva para *todas as idades*, em Vila Velha',
    subtitulo:
      'Psiquiatria, neuropsicologia, psicologia e psicopedagogia reunidas em um só lugar, para crianças, adolescentes, adultos e idosos. Atendimento presencial, online e a domicílio.',
    botaoPrimario: 'Agendar pelo WhatsApp',
    botaoSecundario: 'Conhecer as especialidades',
  },

  fatos: [
    { icone: 'especialidades', texto: '4 especialidades e serviços de apoio' },
    { icone: 'equipe', texto: 'Crianças, adolescentes, adultos e idosos' },
    { icone: 'agenda', texto: clinica.horario.curto },
    { icone: 'casa', texto: 'Presencial, online e a domicílio' },
  ],

  porOndeComecar: {
    sobretitulo: 'Primeiro passo',
    titulo: 'Por onde *começar*?',
    intro:
      'Escolha a situação que mais se parece com a sua. É só um ponto de partida para encontrar a especialidade certa, não um diagnóstico.',
    aviso: 'Em caso de dúvida, nossa equipe orienta qual profissional procurar.',
    linkWhatsApp: 'Pedir orientação pelo WhatsApp',
    mensagemWhatsApp: 'Olá! Gostaria de orientação sobre qual especialidade procurar.',
    situacoes: [
      {
        titulo: 'Dificuldades de aprendizagem ou de desenvolvimento',
        texto:
          'Dificuldade para ler, escrever, prestar atenção ou acompanhar a escola, dúvidas sobre TDAH e TEA ou necessidade de apoio na rotina de estudos.',
        destinos: [
          { slug: 'neuropsicologia', rotulo: 'Neuropsicologia' },
          { slug: 'psicopedagogia', rotulo: 'Psicopedagogia' },
          { href: '/especialidades#reforco-escolar', rotulo: 'Reforço escolar' },
        ],
      },
      {
        titulo: 'Emoções, humor e comportamento',
        texto:
          'Ansiedade, tristeza que não passa, mudanças de humor ou de comportamento, dificuldades nas relações.',
        destinos: [
          { slug: 'psicologia', rotulo: 'Psicologia' },
          { slug: 'psiquiatria', rotulo: 'Psiquiatria' },
        ],
      },
      {
        titulo: 'Memória e envelhecimento',
        texto:
          'Esquecimentos que preocupam e o desejo de manter a autonomia e a mente ativa com o passar dos anos.',
        destinos: [
          { slug: 'neuropsicologia', rotulo: 'Avaliação e reabilitação cognitiva' },
          { href: '/atendimento#idosos', rotulo: 'Atendimento para pessoas idosas' },
        ],
      },
      {
        titulo: 'Desafios na rotina com os filhos',
        texto:
          'Dúvidas sobre como compreender as necessidades dos filhos e lidar com os desafios do dia a dia em família.',
        destinos: [
          { href: '/especialidades#orientacao-parental', rotulo: 'Orientação parental' },
          { slug: 'psicologia', rotulo: 'Psicologia' },
        ],
      },
    ],
  },

  especialidades: {
    sobretitulo: 'Especialidades',
    titulo: 'Especialidades e serviços no *mesmo* endereço',
    intro:
      'Consulta médica, saúde mental, cognição e aprendizagem trabalham lado a lado, com serviços de apoio para estudantes e famílias, para que cada pessoa encontre o cuidado de que precisa.',
    grupos: {
      medica: 'Consulta médica',
      'mente-cognicao-aprendizagem': 'Mente, cognição e aprendizagem',
    },
    grupoServicos: 'Apoio a estudantes e famílias',
    /** Especialidade apresentada em destaque. */
    destaque: 'neuropsicologia',
    linkTodas: 'Ver especialidades e serviços',
  },

  /** Destaque do atendimento a pessoas idosas (sem sugerir exclusividade). */
  idosos: {
    sobretitulo: 'Pessoas idosas',
    titulo: 'Cuidado e atenção em *todas as fases* da vida',
    texto:
      'Oferecemos atendimento para pessoas idosas, com atenção às necessidades individuais, ao bem-estar e à qualidade de vida. Nossa equipe pode orientar você e sua família na busca pelo acompanhamento mais adequado.',
    itens: [
      'Avaliação cognitiva de memória, atenção e raciocínio',
      'Reabilitação e estimulação cognitiva, com foco em autonomia',
      'Orientação a familiares e cuidadores',
      'Atendimento na clínica, online ou em casa, conforme a disponibilidade',
    ],
    botao: 'Conheça as opções de atendimento',
    linkWhatsApp: 'Falar com a equipe',
    mensagemWhatsApp: 'Olá! Gostaria de informações sobre atendimento para uma pessoa idosa.',
    ilustracao: ilustracoes.idosoEmCasa,
  },

  integrado: {
    sobretitulo: 'Cuidado integrado',
    titulo: 'As áreas *conversam* entre si',
    texto: [
      'Muitas situações pedem mais de um olhar. Uma dificuldade na escola pode envolver atenção, emoções e aprendizagem. Uma queixa de memória pode pedir avaliação cognitiva e o acompanhamento de outras áreas.',
      'Ter essas especialidades no mesmo endereço facilita o diálogo entre os profissionais, sempre com o consentimento do paciente e da família.',
    ],
    etapas: [
      { titulo: 'Escuta', texto: 'Entender a história e o que motivou a procura.' },
      { titulo: 'Avaliação', texto: 'Cada área contribui com o seu olhar, quando indicado.' },
      {
        titulo: 'Plano individualizado',
        texto: 'Cada plano terapêutico é elaborado para a pessoa, e não para o diagnóstico.',
      },
    ],
    citacao: 'Cuidar é olhar para a pessoa de forma integral.',
  },

  espaco: {
    sobretitulo: 'O espaço',
    titulo: 'Um ambiente *tranquilo*, pensado para receber',
    texto: [
      'A clínica fica na Praia das Gaivotas, em Vila Velha, e oferece um ambiente tranquilo para pacientes e familiares.',
      'As crianças contam com um espaço lúdico com jardim de inverno, pensado para acolhê-las.',
    ],
    link: 'Conhecer a clínica',
  },

  comoFunciona: {
    sobretitulo: 'Como funciona',
    titulo: 'Do primeiro contato à *primeira* consulta',
    passos: [
      {
        titulo: 'Contato pelo WhatsApp',
        texto:
          'Diga para quem é o atendimento e qual especialidade procura, ou peça orientação. Não é preciso enviar informações de saúde por mensagem.',
      },
      {
        titulo: 'Agendamento',
        texto: `A equipe apresenta os horários e as modalidades disponíveis (presencial, online ou a domicílio). A clínica funciona ${clinica.horario.frase}, com hora marcada.`,
      },
      {
        titulo: 'Primeira consulta',
        texto:
          'Leve documento com foto e, se tiver, exames, laudos e relatórios anteriores. O profissional ouve a sua história e explica os próximos passos.',
      },
    ],
    link: 'O que levar e outras orientações',
  },

  /** Faixa de confiança (padrão "Confiança e autoridade"), sem números nem selos inventados. */
  compromissos: {
    titulo: 'Nossos compromissos',
    itens: [
      {
        icone: 'escudo',
        titulo: 'Sigilo profissional',
        texto:
          'O que é conversado em consulta é protegido pelo sigilo previsto nos códigos de ética.',
      },
      {
        icone: 'clinica',
        titulo: 'Ética',
        texto: 'Seguimos as normas dos conselhos profissionais, sem promessas de resultado.',
      },
      {
        icone: 'conteudos',
        titulo: 'Evidências científicas',
        texto: 'Avaliações e intervenções baseadas no conhecimento científico atual.',
      },
    ],
    link: 'Conheça nossa abordagem',
  },

  faq: {
    sobretitulo: 'Dúvidas',
    titulo: 'Perguntas *frequentes*',
    link: 'Ver todas as perguntas',
  },

  localizacao: {
    sobretitulo: 'Onde estamos',
    titulo: 'Praia das Gaivotas, *Vila Velha*',
  },
};
