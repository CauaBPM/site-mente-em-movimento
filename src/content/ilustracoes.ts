/**
 * IMAGENS ILUSTRATIVAS DE ATENDIMENTO
 * ------------------------------------------------------------------
 * Fotos de banco de imagens (licença Pexels: uso comercial gratuito, sem
 * obrigação de atribuição). Representam SITUAÇÕES de atendimento e NÃO são
 * registros da equipe, de pacientes ou do espaço da Mente em Movimento — por
 * isso o componente <Ilustracao> exibe a legenda "Imagem ilustrativa".
 * Fotos reais e autorizadas da clínica continuam em src/content/fotos.ts.
 *
 * Para trocar uma imagem: salve o novo arquivo em src/assets/ilustracoes/
 * (JPG, ~1600 px de largura), importe aqui e atualize `alt` e `fonte`.
 * O Astro gera automaticamente as versões AVIF/WebP em vários tamanhos.
 */
import type { ImageMetadata } from 'astro';
import idosoEmCasa from '@/assets/ilustracoes/idoso-leitura-acompanhamento-em-casa.jpg';
import casalIdoso from '@/assets/ilustracoes/casal-idoso-em-conversa.jpg';
import estudante from '@/assets/ilustracoes/estudante-apoio-aprendizagem.jpg';
import familia from '@/assets/ilustracoes/familia-orientacao-parental.jpg';

export interface Ilustracao {
  arquivo: ImageMetadata;
  alt: string;
  /** Origem e licença (registro interno; não é exibido). */
  fonte: { autor: string; url: string; licenca: string };
}

const pexels = 'Licença Pexels (https://www.pexels.com/license/)';

export const ilustracoes = {
  idosoEmCasa: {
    arquivo: idosoEmCasa,
    alt: 'Homem idoso sentado no sofá de casa, lendo um livro ao lado de uma mulher que o acompanha na leitura',
    fonte: {
      autor: 'Kampus Production',
      url: 'https://www.pexels.com/photo/a-woman-reading-a-book-while-sitting-beside-the-man-in-blue-sweater-7551620/',
      licenca: pexels,
    },
  },
  casalIdoso: {
    arquivo: casalIdoso,
    alt: 'Mulher e homem idosos sentados lado a lado em uma sala clara, conversando com tranquilidade',
    fonte: {
      autor: 'Kampus Production',
      url: 'https://www.pexels.com/photo/elderly-people-talking-while-looking-at-laptop-screen-8430316/',
      licenca: pexels,
    },
  },
  estudante: {
    arquivo: estudante,
    alt: 'Estudante sorridente escrevendo no caderno enquanto uma adulta acompanha a atividade ao seu lado',
    fonte: {
      autor: 'Karola G. (Kaboompics)',
      url: 'https://www.pexels.com/photo/a-person-teaching-a-young-student-in-class-7692564/',
      licenca: pexels,
    },
  },
  familia: {
    arquivo: familia,
    alt: 'Pai, mãe e filha sentados no sofá conversando com um profissional que mostra um desenho da criança',
    fonte: {
      autor: 'Gustavo Fring',
      url: 'https://www.pexels.com/photo/photo-of-a-therapist-showing-a-drawing-to-a-family-7447263/',
      licenca: pexels,
    },
  },
} satisfies Record<string, Ilustracao>;
