/**
 * SERVIÇOS DE APOIO (além das especialidades)
 * ------------------------------------------------------------------
 * Apresentados em /especialidades (âncoras #reforco-escolar e
 * #orientacao-parental) e na página inicial. Não têm página própria porque
 * ainda não há detalhes confirmados (profissionais, faixas etárias, formato).
 * Textos editoriais: ajuste à atuação real da equipe antes de detalhar mais.
 */
import { ilustracoes, type Ilustracao } from './ilustracoes';

export interface Servico {
  id: string;
  nome: string;
  /** Uma frase para listas e para a página inicial. */
  resumo: string;
  descricao: string;
  itens: string[];
  paraQuem: string;
  /** Termo usado na mensagem do WhatsApp: "Olá! Gostaria de informações sobre {termo}." */
  termoWhatsApp: string;
  ilustracao: Ilustracao;
}

export const servicos: Servico[] = [
  {
    id: 'reforco-escolar',
    nome: 'Reforço escolar',
    resumo: 'Apoio às atividades escolares e à organização da rotina de estudos.',
    descricao:
      'Apoio ao processo de aprendizagem, respeitando as necessidades e o ritmo de cada estudante, para favorecer uma rotina de estudos mais organizada.',
    itens: [
      'Apoio às atividades e aos conteúdos escolares',
      'Atenção às dificuldades de aprendizagem',
      'Organização da rotina de estudos',
    ],
    paraQuem: 'Para estudantes e suas famílias. A equipe informa as faixas etárias e os horários.',
    termoWhatsApp: 'reforço escolar',
    ilustracao: ilustracoes.estudante,
  },
  {
    id: 'orientacao-parental',
    nome: 'Orientação parental',
    resumo: 'Orientação a pais e responsáveis para os desafios da rotina familiar.',
    descricao:
      'Um espaço de orientação para pais e responsáveis, com foco na compreensão das necessidades dos filhos e na construção de estratégias para os desafios da rotina familiar.',
    itens: [
      'Compreensão das necessidades dos filhos',
      'Estratégias para os desafios do dia a dia',
      'Apoio à rotina e à convivência familiar',
    ],
    paraQuem: 'Para pais, mães e responsáveis.',
    termoWhatsApp: 'orientação parental',
    ilustracao: ilustracoes.familia,
  },
];

export const rotaServico = (id: string) => `/especialidades#${id}`;
