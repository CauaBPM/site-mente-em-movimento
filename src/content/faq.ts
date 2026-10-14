/**
 * PERGUNTAS FREQUENTES (página /atendimento e destaque na página inicial)
 * ------------------------------------------------------------------
 * - `status: "pendente"` → a pergunta não é exibida.
 * - `inicio: true` → aparece também na página inicial (use 4).
 * - Links no formato [texto](/caminho) são convertidos em <a>.
 */
import type { Status } from './clinica';

export interface Pergunta {
  id: string;
  status: Status;
  inicio?: boolean;
  pergunta: string;
  resposta: string;
}

export const faq: Pergunta[] = [
  {
    id: 'idades',
    status: 'confirmado',
    inicio: true,
    pergunta: 'A clínica atende crianças?',
    resposta:
      'Sim. A Mente em Movimento atende crianças, adolescentes, adultos e idosos. Para crianças, há um espaço lúdico com jardim de inverno. As faixas etárias atendidas em cada especialidade são informadas pela equipe no primeiro contato.',
  },
  {
    id: 'por-onde-comecar',
    status: 'confirmado',
    inicio: true,
    pergunta: 'Não sei qual profissional procurar. O que faço?',
    resposta:
      'Fale com a equipe pelo WhatsApp e conte, em poucas palavras, para quem é o atendimento (você, seu filho ou outro familiar). A equipe orienta qual especialidade procurar primeiro. Não é preciso descrever sintomas por mensagem.',
  },
  {
    id: 'psiquiatra-ou-psicologo',
    status: 'confirmado',
    pergunta: 'Psiquiatra ou psicólogo: qual procurar?',
    resposta:
      'O psiquiatra é médico: faz diagnóstico e pode prescrever medicamentos. O psicólogo conduz a psicoterapia e avaliações psicológicas, sem prescrição. Muitas vezes os dois acompanham a mesma pessoa. Se tiver dúvida, a equipe orienta. Saiba mais em [Psiquiatria](/especialidades/psiquiatria) e [Psicologia](/especialidades/psicologia).',
  },
  {
    id: 'encaminhamento',
    status: 'confirmado',
    inicio: true,
    pergunta: 'Preciso de encaminhamento?',
    resposta:
      'Não é obrigatório. Se você tiver um encaminhamento médico ou da escola, relatórios ou exames anteriores, leve-os à primeira consulta, porque ajudam o profissional a entender o caso.',
  },
  {
    id: 'avaliacao-neuropsicologica',
    status: 'confirmado',
    inicio: true,
    pergunta: 'Como funciona a avaliação neuropsicológica?',
    resposta:
      'Em geral, começa com uma entrevista inicial, segue com algumas sessões de testes e tarefas que avaliam memória, atenção, raciocínio e aprendizagem, e termina com uma devolutiva, em que os resultados são explicados. Veja os detalhes em [Neuropsicologia](/especialidades/neuropsicologia).',
  },
  {
    id: 'duracao-avaliacao',
    status: 'confirmado',
    pergunta: 'Quanto tempo dura a avaliação neuropsicológica?',
    resposta:
      'Depende da idade da pessoa e do objetivo da avaliação, que definem quantas sessões serão necessárias. A estimativa para o seu caso é passada pela equipe no contato e confirmada na entrevista inicial.',
  },
  {
    id: 'laudos',
    status: 'confirmado',
    pergunta: 'A clínica emite laudos?',
    resposta:
      'Sim. A emissão de laudos e relatórios faz parte da avaliação neuropsicológica, quando indicada, e o documento é entregue na devolutiva.',
  },
  {
    id: 'idosos',
    status: 'confirmado',
    pergunta: 'Vocês atendem idosos com esquecimentos?',
    resposta:
      'Sim. A clínica oferece avaliação cognitiva para adultos e idosos e reabilitação cognitiva, que estimula memória, atenção, linguagem e raciocínio, com foco em autonomia e qualidade de vida. A neurologia também pode ajudar a investigar as queixas de memória. Veja [Neuropsicologia](/especialidades/neuropsicologia) e [Neurologia](/especialidades/neurologia).',
  },
  {
    id: 'remarcar',
    status: 'confirmado',
    pergunta: 'Como remarco ou cancelo uma consulta?',
    resposta:
      'Envie uma mensagem pelo WhatsApp (27) 99792-9358 com a maior antecedência possível, informando o nome do paciente e a data agendada. A equipe ajuda a encontrar um novo horário.',
  },
  {
    id: 'sigilo',
    status: 'confirmado',
    pergunta: 'As informações do atendimento ficam em sigilo?',
    resposta:
      'Sim. Todos os profissionais seguem o sigilo previsto em seus códigos de ética. Por isso, não envie informações de saúde por este site nem por mensagem: elas são tratadas na consulta.',
  },
  {
    // Resposta definitiva PENDENTE (ver PENDENCIAS.md). Enquanto isso, orientar a falar com a equipe.
    id: 'convenios-valores',
    status: 'confirmado',
    pergunta: 'Vocês atendem por convênio? Quais são os valores?',
    resposta:
      'Essas informações são passadas diretamente pela equipe. Fale conosco pelo WhatsApp para saber sobre formas de pagamento e convênios.',
  },
  {
    // Resposta definitiva PENDENTE (atendimento online depende de confirmação e de cadastro e-Psi).
    id: 'online',
    status: 'confirmado',
    pergunta: 'Existe atendimento online?',
    resposta:
      'O atendimento acontece presencialmente, na Praia das Gaivotas, em Vila Velha. Para saber sobre outras modalidades, fale com nossa equipe pelo WhatsApp.',
  },
];

export const faqPublicada = faq.filter((p) => p.status === 'confirmado');
export const faqInicio = faqPublicada.filter((p) => p.inicio);
