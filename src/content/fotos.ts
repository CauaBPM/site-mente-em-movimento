/**
 * FOTOS REAIS DA CLÍNICA
 * ------------------------------------------------------------------
 * Use apenas fotos fornecidas e autorizadas pela clínica. Nunca use banco de
 * imagens apresentado como se fosse a clínica, nem fotos de pacientes.
 *
 * Para adicionar:
 *   1. Salve o arquivo em src/assets/fotos/ (JPG ou PNG, de preferência ≥ 2000 px).
 *   2. Importe aqui e acrescente um item à lista, com `alt` descritivo.
 *   3. Marque `autorizada: true` somente com a autorização de uso confirmada.
 * Exemplo:
 *   import recepcao from '@/assets/fotos/recepcao.jpg';
 *   { arquivo: recepcao, alt: 'Recepção da clínica, com poltronas e luz natural', autorizada: true },
 *
 * Enquanto a lista estiver vazia, a galeria não aparece no site.
 */
import type { ImageMetadata } from 'astro';

export interface Foto {
  arquivo: ImageMetadata;
  alt: string;
  autorizada: boolean;
}

export const fotosEspaco: Foto[] = [];

export const fotosPublicadas = fotosEspaco.filter((f) => f.autorizada);
