import { clinica } from '@/content/clinica';

/**
 * Função única para montar links do WhatsApp.
 * A mensagem nunca deve pedir dados de saúde.
 */
export function whatsappLink(mensagem: string = clinica.mensagemWhatsAppPadrao): string {
  return `https://wa.me/${clinica.telefone.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem pré-preenchida por especialidade. */
export function mensagemArea(termo: string): string {
  return `Olá! Gostaria de informações sobre ${termo}.`;
}

export const telefoneHref = `tel:${clinica.telefone.e164}`;
