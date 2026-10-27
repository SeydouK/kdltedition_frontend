export function isJwtExpired(token: string, marginSeconds = 10): boolean {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = JSON.parse(json).exp;

    if (typeof exp !== 'number') return true;
    return exp * 1000 <= Date.now() + marginSeconds * 1000;
  } catch {
    return true; // jeton illisible : on le considère comme périmé
  }
}
