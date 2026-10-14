/**
 * Dados estruturados (JSON-LD) — schema.org.
 * Nunca incluir AggregateRating ou Review próprios.
 */
import { clinica, confirmado } from '@/content/clinica';
import type { Profissional } from './conteudo';

const especialidadeSchema: Record<string, string> = {
  psiquiatria: 'Psychiatric',
  neurologia: 'Neurologic',
};

export function idClinica(site: URL | string) {
  return new URL('/#clinica', site).href;
}

export function medicalClinic(site: URL | string, imagem: string, logo: string) {
  const sameAs: string[] = [clinica.instagram.url];
  if (clinica.google.perfilConfirmado) sameAs.push(clinica.google.perfilConfirmado);

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': idClinica(site),
    name: clinica.nomeCompleto,
    alternateName: clinica.nomeComCidade,
    legalName: clinica.razaoSocial,
    taxID: clinica.cnpj,
    url: new URL('/', site).href,
    logo,
    image: imagem,
    telephone: clinica.telefone.schema,
    ...(confirmado(clinica.email) ? { email: clinica.email.valor } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinica.endereco.logradouro,
      addressLocality: clinica.endereco.cidade,
      addressRegion: clinica.endereco.uf,
      postalCode: clinica.endereco.cep,
      addressCountry: clinica.endereco.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinica.geo.latitude,
      longitude: clinica.geo.longitude,
    },
    hasMap: clinica.google.buscaMaps,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: clinica.horario.dias,
        opens: clinica.horario.abre,
        closes: clinica.horario.fecha,
      },
    ],
    medicalSpecialty: ['Psychiatric', 'Neurologic'],
    knowsAbout: [...clinica.especialidades],
    areaServed: clinica.areaAtendida.map((cidade) => ({
      '@type': 'City',
      name: `${cidade}, ES`,
    })),
    sameAs,
  };
}

export function breadcrumbs(site: URL | string, itens: { nome: string; caminho: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      item: new URL(item.caminho, site).href,
    })),
  };
}

export function medicalWebPage(
  site: URL | string,
  opcoes: { nome: string; descricao: string; caminho: string; slug: string; atualizadaEm?: string },
) {
  const especialidade = especialidadeSchema[opcoes.slug];
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: opcoes.nome,
    description: opcoes.descricao,
    url: new URL(opcoes.caminho, site).href,
    inLanguage: 'pt-BR',
    about: { '@id': idClinica(site) },
    ...(especialidade ? { specialty: especialidade } : {}),
    audience: { '@type': 'PeopleAudience', audienceType: 'Pacientes e familiares' },
    publisher: { '@id': idClinica(site) },
  };
}

/** Person / Physician — somente para profissionais confirmados. */
export function pessoa(site: URL | string, p: Profissional) {
  const d = p.data;
  return {
    '@context': 'https://schema.org',
    '@type': d.tipo === 'medico' ? 'Physician' : 'Person',
    name: d.nome,
    jobTitle: d.profissao,
    ...(d.registro ? { identifier: d.registro } : {}),
    worksFor: { '@id': idClinica(site) },
  };
}
