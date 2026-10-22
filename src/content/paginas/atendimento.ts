/** TEXTOS DA PÁGINA /atendimento (a FAQ completa fica em src/content/faq.ts) */
import { clinica } from '../clinica';
import { ilustracoes } from '../ilustracoes';

export const atendimento = {
  seo: {
    titulo: 'Atendimento em Vila Velha | Mente em Movimento',
    descricao:
      'Atendimento presencial, online e a domicílio em Vila Velha – ES, de segunda a sexta, das 7h às 20h. Como agendar, o que levar e perguntas frequentes.',
  },
  h1: 'Como funciona o *atendimento*',
  intro:
    'Tudo o que você precisa saber antes da primeira consulta: modalidades, como agendar, o que levar e como cuidamos das suas informações.',

  horario: {
    titulo: 'Horário de funcionamento',
    texto: `${clinica.horario.texto}, com hora marcada. Atendimento presencial, online e a domicílio, conforme a disponibilidade de cada serviço.`,
  },

  publicos: {
    titulo: 'Quem atendemos',
    texto:
      'Crianças, adolescentes, adultos e idosos, em quatro especialidades (psiquiatria, neuropsicologia, psicologia e psicopedagogia) e nos serviços de reforço escolar e orientação parental. As faixas etárias de cada área são informadas pela equipe no primeiro contato.',
  },

  idosos: {
    sobretitulo: 'Pessoas idosas',
    titulo: 'Atendimento para pessoas *idosas*',
    texto: [
      'A Mente em Movimento atende pessoas idosas com atenção às necessidades individuais, ao bem-estar e à qualidade de vida. O cuidado é planejado com a pessoa, respeitando sua autonomia e sua história.',
      'Familiares também podem entrar em contato para conhecer as opções. A equipe orienta qual acompanhamento faz mais sentido em cada situação.',
    ],
    opcoes: [
      {
        titulo: 'Avaliação cognitiva',
        texto:
          'Avaliação de memória, atenção, linguagem e raciocínio, com devolutiva e orientações.',
        href: '/especialidades/neuropsicologia',
        rotulo: 'Neuropsicologia',
      },
      {
        titulo: 'Reabilitação e estimulação cognitiva',
        texto:
          'Atividades planejadas para exercitar funções cognitivas, com foco em autonomia e qualidade de vida.',
        href: '/especialidades/neuropsicologia',
        rotulo: 'Neuropsicologia',
      },
      {
        titulo: 'Aprender e retomar os estudos',
        texto:
          'Alfabetização e apoio à aprendizagem para quem deseja ler, escrever ou voltar a estudar.',
        href: '/especialidades/psicopedagogia',
        rotulo: 'Psicopedagogia',
      },
      {
        titulo: 'Saúde mental',
        texto:
          'Acompanhamento psicológico e consulta psiquiátrica. A equipe informa os profissionais que atendem pessoas idosas.',
        href: '/especialidades/psicologia',
        rotulo: 'Psicologia',
      },
    ],
    domicilio:
      'O atendimento também pode acontecer em casa ou online, conforme a disponibilidade de cada serviço, o que facilita o acesso de quem prefere ou precisa evitar deslocamentos.',
    botao: 'Falar com a equipe pelo WhatsApp',
    mensagemWhatsApp: 'Olá! Gostaria de informações sobre atendimento para uma pessoa idosa.',
    ilustracao: ilustracoes.casalIdoso,
  },

  comoAgendar: {
    titulo: 'Como agendar',
    passos: [
      `Envie uma mensagem pelo WhatsApp ${clinica.telefone.exibicao} ou ligue no mesmo número, ${clinica.horario.frase}.`,
      'Informe o nome de quem será atendido, a especialidade ou o serviço desejado (ou peça orientação), a modalidade de preferência (presencial, online ou a domicílio) e os melhores dias e horários para você.',
      'A equipe confirma a data, o horário e as orientações para a primeira consulta.',
    ],
    observacao:
      'Não é preciso descrever sintomas ou enviar exames por mensagem. Essas informações são tratadas na consulta, com sigilo profissional.',
  },

  oQueLevar: {
    titulo: 'O que levar na primeira consulta',
    itens: [
      'Documento de identidade com foto (do paciente e do responsável, no caso de crianças e adolescentes)',
      'Exames realizados anteriormente',
      'Laudos e relatórios anteriores, inclusive escolares, quando houver',
      'Lista dos medicamentos em uso, com as doses',
      'Encaminhamento médico ou da escola, quando houver',
    ],
  },

  sigilo: {
    titulo: 'Sigilo e privacidade',
    texto: [
      'Tudo o que é conversado em consulta é protegido pelo sigilo profissional, previsto nos códigos de ética da psicologia e da medicina.',
      'Este site não coleta informações de saúde. Para saber como tratamos os dados de contato, leia a [Política de Privacidade](/politica-de-privacidade).',
    ],
  },

  crise: {
    titulo: 'Em situação de crise',
    texto:
      'A clínica atende com hora marcada e não é um serviço de urgência. Se você ou alguém próximo estiver em risco, procure ajuda imediatamente:',
    contatos: [
      {
        nome: 'CVV – Centro de Valorização da Vida',
        numero: '188',
        detalhe: 'Ligação gratuita, 24 horas por dia',
        href: 'tel:188',
      },
      {
        nome: 'SAMU',
        numero: '192',
        detalhe: 'Emergências médicas',
        href: 'tel:192',
      },
    ],
    complemento: 'Você também pode ir ao pronto-socorro mais próximo.',
  },

  faq: {
    titulo: 'Perguntas *frequentes*',
    intro: 'Não encontrou sua dúvida? Fale com a equipe pelo WhatsApp.',
  },
};
