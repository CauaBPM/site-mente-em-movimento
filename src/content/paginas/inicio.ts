/**
 * TEXTOS DA PÁGINA INICIAL (/)
 * Ênfase em títulos: *palavra* vira itálico (use em uma ou duas palavras).
 * Links: [texto](/caminho).
 */
export const inicio = {
  seo: {
    titulo: 'Mente em Movimento | Saúde Mental e Cognitiva em Vila Velha – ES',
    descricao:
      'Psiquiatria, neurologia, neuropsicologia, psicologia e psicopedagogia para crianças, adolescentes, adultos e idosos na Praia das Gaivotas, Vila Velha. Agende pelo WhatsApp.',
  },

  abertura: {
    sobretitulo: 'Centro de Saúde Mental e Cognitiva',
    titulo: 'Cuidado em saúde mental e cognitiva para *todas as idades*, em Vila Velha',
    subtitulo:
      'Psiquiatria, neurologia, neuropsicologia, psicologia e psicopedagogia reunidas em um só lugar, para crianças, adolescentes, adultos e idosos.',
    botaoPrimario: 'Agendar pelo WhatsApp',
    botaoSecundario: 'Conhecer as especialidades',
  },

  fatos: [
    { icone: 'especialidades', texto: '5 especialidades integradas' },
    { icone: 'equipe', texto: 'Crianças, adolescentes, adultos e idosos' },
    { icone: 'agenda', texto: 'Seg. a sex., 8h–18h30' },
    { icone: 'localizacao', texto: 'Praia das Gaivotas' },
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
          'Dificuldade para ler, escrever, prestar atenção ou acompanhar a escola, ou dúvidas sobre TDAH e TEA.',
        destinos: [
          { slug: 'neuropsicologia', rotulo: 'Neuropsicologia' },
          { slug: 'psicopedagogia', rotulo: 'Psicopedagogia' },
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
          { slug: 'neuropsicologia', rotulo: 'Reabilitação cognitiva' },
          { slug: 'neurologia', rotulo: 'Neurologia' },
        ],
      },
      {
        titulo: 'Sintomas neurológicos',
        texto:
          'Dores de cabeça frequentes, tonturas, tremores, formigamentos ou alterações de equilíbrio.',
        destinos: [{ slug: 'neurologia', rotulo: 'Neurologia' }],
      },
    ],
  },

  especialidades: {
    sobretitulo: 'Especialidades',
    titulo: 'Cinco áreas no *mesmo* endereço',
    intro:
      'Áreas médicas e áreas de saúde mental, cognição e aprendizagem trabalham lado a lado, para que cada pessoa encontre o cuidado de que precisa.',
    grupos: {
      medica: 'Consultas médicas',
      'mente-cognicao-aprendizagem': 'Mente, cognição e aprendizagem',
    },
    /** Especialidade apresentada em destaque. */
    destaque: 'neuropsicologia',
    linkTodas: 'Ver todas as especialidades',
  },

  integrado: {
    sobretitulo: 'Cuidado integrado',
    titulo: 'As áreas *conversam* entre si',
    texto: [
      'Muitas situações pedem mais de um olhar. Uma dificuldade na escola pode envolver atenção, emoções e aprendizagem. Uma queixa de memória pode pedir avaliação médica e avaliação cognitiva.',
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
        texto:
          'A equipe apresenta os horários disponíveis. O atendimento é presencial, de segunda a sexta, das 8h às 18h30, com hora marcada.',
      },
      {
        titulo: 'Primeira consulta',
        texto:
          'Leve documento com foto e, se tiver, exames, laudos e relatórios anteriores. O profissional ouve a sua história e explica os próximos passos.',
      },
    ],
    link: 'O que levar e outras orientações',
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
