import { describe, expect, it } from 'vitest'
import { normalizeLinkedInText } from './linkedinPostText'

describe('normalizeLinkedInText', () => {
  it('insere quebras antes de emojis apos pontuacao', () => {
    const input = 'Primeiro paragrafo.💻 Segundo paragrafo.'

    expect(normalizeLinkedInText(input)).toBe(
      'Primeiro paragrafo.\n\n💻 Segundo paragrafo.'
    )
  })

  it('quebra linhas com setas', () => {
    const input = 'Lista → item A → item B'

    expect(normalizeLinkedInText(input)).toBe('Lista\n→ item A\n→ item B')
  })

  it('separa bloco final de hashtags com linha em branco', () => {
    const input =
      'Veja o dashboard: https://lnkd.in/dwzxD65g #DesenvolvimentoWeb #Frontend #TypeScript'

    expect(normalizeLinkedInText(input)).toBe(
      'Veja o dashboard: https://lnkd.in/dwzxD65g\n\n#DesenvolvimentoWeb #Frontend #TypeScript'
    )
  })
})
