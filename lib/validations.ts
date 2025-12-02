import { z } from 'zod';

// Schema de validación de dominio
export const domainSchema = z.object({
  name: z.string()
    .min(1, "El dominio no puede estar vacío")
    .max(63, "El dominio no puede tener más de 63 caracteres")
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i, "Formato de dominio inválido")
    .transform(val => val.toLowerCase()),
  tld: z.enum(['.ar', '.com.ar', '.net.ar', '.org.ar', '.com', '.net', '.org', '.io'])
});

// Schema de búsqueda múltiple
export const domainSearchSchema = z.object({
  domains: z.array(z.string()).min(1).max(10),
  tlds: z.array(z.string()).min(1),
  includeAlternatives: z.boolean().optional()
});

// Funciones de validación
export function isValidDomainName(name: string): boolean {
  return domainSchema.shape.name.safeParse(name).success;
}

export function sanitizeDomainInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}

export function validateDomainFormat(domain: string): boolean {
  const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i;
  return regex.test(domain);
}

