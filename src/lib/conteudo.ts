import { getCollection, type CollectionEntry } from 'astro:content';

export type Especialidade = CollectionEntry<'especialidades'>;
export type Profissional = CollectionEntry<'equipe'>;

/** Especialidades publicadas (status "confirmado"), em ordem. */
export async function especialidadesPublicadas(): Promise<Especialidade[]> {
  const todas = await getCollection('especialidades', (e) => e.data.status === 'confirmado');
  return todas.sort((a, b) => a.data.ordem - b.data.ordem);
}

/** Profissionais confirmados. Se a lista estiver vazia, /equipe não é gerada. */
export async function equipeConfirmada(): Promise<Profissional[]> {
  const todos = await getCollection('equipe', (p) => p.data.status === 'confirmado');
  return todos.sort(
    (a, b) => a.data.ordem - b.data.ordem || a.data.nome.localeCompare(b.data.nome),
  );
}

export const rotaEspecialidade = (slug: string) => `/especialidades/${slug}`;
