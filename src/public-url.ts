export function publicUrl(path: string, base = import.meta.env.BASE_URL): string {
  return path.startsWith('/') && !path.startsWith('//') ? `${base}${path.slice(1)}` : path
}
