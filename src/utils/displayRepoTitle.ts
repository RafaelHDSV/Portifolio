/** Remove prefixos de naming interno que nao devem aparecer na UI. */
export function displayRepoTitle (name: string): string {
  return name.replace(/^PERSONAL-/i, '').trim()
}
