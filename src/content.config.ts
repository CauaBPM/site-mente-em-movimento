import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['confirmado', 'pendente']);
const slugsEspecialidades = z.enum([
  'psiquiatria',
  'neuropsicologia',
  'psicologia',
  'psicopedagogia',
]);

const pergunta = z.object({
  pergunta: z.string(),
  resposta: z.string(),
});

/**
 * Especialidades — um arquivo .md por área em src/content/especialidades/.
 * O corpo do arquivo é a seção "O que é".
 */
const especialidades = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/especialidades' }),
  schema: z.object({
    nome: z.string(),
    status,
    ordem: z.number(),
    consultaMedica: z.boolean(),
    grupo: z.enum(['medica', 'mente-cognicao-aprendizagem']),
    seo: z.object({
      titulo: z.string().max(62),
      descricao: z.string().max(155),
    }),
    /** H1 da página. Padrão: "{Especialidade} em Vila Velha". */
    h1: z.string(),
    /** Uma frase para listas e para a página inicial. */
    resumo: z.string(),
    /** Termo usado na mensagem do WhatsApp: "Olá! Gostaria de informações sobre {termo}." */
    termoWhatsApp: z.string(),
    quandoProcurar: z.object({
      intro: z.string(),
      sinais: z.array(z.string()).min(3),
      aviso: z.string(),
    }),
    oferece: z.object({
      intro: z.string(),
      blocos: z.array(
        z.object({
          titulo: z.string(),
          texto: z.string().optional(),
          itens: z.array(z.string()).optional(),
        }),
      ),
    }),
    comoFunciona: z.array(z.object({ titulo: z.string(), texto: z.string() })).min(2),
    publicos: z.object({
      /** "confirmado" só quando a clínica informar as faixas etárias desta área. */
      status,
      lista: z.array(z.string()),
      texto: z.string(),
    }),
    faq: z.array(pergunta).min(2).max(4),
    relacionadas: z.array(slugsEspecialidades),
  }),
});

/**
 * Equipe — um arquivo .md por profissional em src/content/equipe/.
 * Só aparece no site com status "confirmado" e registro profissional preenchido.
 */
const equipe = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/equipe' }),
  schema: ({ image }) =>
    z
      .object({
        nome: z.string(),
        status,
        ordem: z.number().default(100),
        profissao: z.string(),
        tipo: z.enum(['psicologo', 'medico', 'outro']),
        /** Ex.: "CRP-16/12345" ou "CRM-ES 12345" */
        registro: z.string().nullish(),
        /** Obrigatório para médicos que divulgam especialidade (Res. CFM 2.336/2023). */
        rqe: z.string().nullish(),
        formacao: z.array(z.string()).default([]),
        areas: z.array(slugsEspecialidades).default([]),
        publicos: z.array(z.string()).default([]),
        foto: image().optional(),
        fotoAlt: z.string().optional(),
        fotoAutorizada: z.boolean().default(false),
      })
      .refine((p) => p.status !== 'confirmado' || Boolean(p.registro), {
        message: 'Profissional confirmado precisa de registro (CRP ou CRM).',
        path: ['registro'],
      })
      .refine((p) => p.status !== 'confirmado' || p.tipo !== 'medico' || Boolean(p.rqe), {
        message: 'Médico confirmado precisa de RQE para divulgar especialidade.',
        path: ['rqe'],
      })
      .refine((p) => !p.foto || p.fotoAutorizada, {
        message: 'Use somente fotos com autorização de uso (fotoAutorizada: true).',
        path: ['foto'],
      }),
});

export const collections = { especialidades, equipe };
