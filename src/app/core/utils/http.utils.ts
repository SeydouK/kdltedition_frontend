// Extrait un message lisible d'une erreur HTTP, sans jamais afficher "[object Object]".
export function extractError(err: any, fallback: string): string {
  if (err?.status === 0) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.';
  }
  const body = err?.error;
  if (typeof body === 'string' && body.trim()) return body;
  if (typeof body?.message === 'string' && body.message.trim()) return body.message;
  return fallback;
}

// N'accepte qu'un chemin interne au site : refuse « https://… » et « //… »
// pour qu'un lien piégé ne puisse pas renvoyer l'utilisateur ailleurs après sa connexion.
export function safeReturnUrl(url: string | null): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
