/**
 * Illustrations des contes (générées par scripts/generate-illustrations.ts avec un modèle
 * open source Hugging Face). Vite ne fournit ici que les URL : chaque image n'est
 * téléchargée qu'au moment où elle s'affiche.
 */
const files = typeof (import.meta as any).glob === 'function'
  ? (import.meta as any).glob('../assets/illustrations/*.webp', { eager: true, query: '?url', import: 'default' })
  : {};

const byId = new Map<string, string>(
  Object.entries(files).map(([file, url]) => [file.split('/').pop()!.replace('.webp', ''), url as string])
);

export function illustrationFor(id: string): string | undefined {
  return byId.get(id);
}

export const illustrationCount = byId.size;
