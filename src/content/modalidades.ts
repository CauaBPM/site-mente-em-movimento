/**
 * MODALIDADES DE ATENDIMENTO (página inicial, /atendimento e /contato)
 * ------------------------------------------------------------------
 * Confirmadas pela clínica: presencial, online e a domicílio.
 * NÃO confirmados (não publicar sem confirmação — ver PENDENCIAS.md):
 * quais especialidades atendem em cada modalidade, plataforma do online,
 * bairros/cidades atendidos a domicílio, taxas e condições.
 */
import { clinica } from './clinica';

export interface Modalidade {
  id: 'presencial' | 'online' | 'domicilio';
  icone: 'localizacao' | 'online' | 'casa';
  titulo: string;
  texto: string;
  /** Pílula de destaque (opcional). */
  selo?: string;
  link:
    | { tipo: 'externo'; rotulo: string; href: string; evento: string }
    | { tipo: 'whatsapp'; rotulo: string; mensagem: string };
}

export const modalidades = {
  sobretitulo: 'Modalidades',
  titulo: 'Um atendimento que se adapta à sua *necessidade*',
  intro:
    'Você pode ser atendido na clínica, online ou em casa. As modalidades disponíveis variam conforme a especialidade e o profissional, e a equipe confirma as opções no primeiro contato.',
  itens: [
    {
      id: 'presencial',
      icone: 'localizacao',
      titulo: 'Presencial',
      texto: `Atendimento na clínica, com hora marcada, em um ambiente tranquilo na ${clinica.endereco.bairro}, em ${clinica.endereco.cidade}.`,
      link: {
        tipo: 'externo',
        rotulo: 'Como chegar',
        href: clinica.google.rotas,
        evento: 'como-chegar',
      },
    },
    {
      id: 'online',
      icone: 'online',
      titulo: 'Online',
      texto:
        'Atendimento a distância, conforme a disponibilidade de cada serviço. Consulte a equipe para saber quais atendimentos são oferecidos nessa modalidade.',
      link: {
        tipo: 'whatsapp',
        rotulo: 'Consultar disponibilidade',
        mensagem: 'Olá! Gostaria de saber sobre o atendimento online.',
      },
    },
    {
      id: 'domicilio',
      icone: 'casa',
      titulo: 'A domicílio',
      selo: 'Sem sair de casa',
      texto:
        'Atendimento no ambiente de casa, para quem precisa ou prefere não se deslocar. A disponibilidade e as condições são combinadas com a equipe.',
      link: {
        tipo: 'whatsapp',
        rotulo: 'Consultar disponibilidade',
        mensagem: 'Olá! Gostaria de saber sobre o atendimento a domicílio.',
      },
    },
  ] satisfies Modalidade[],
};
