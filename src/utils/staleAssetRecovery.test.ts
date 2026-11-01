import { describe, expect, it } from 'vitest'
import { isStaleAssetError, recoverFromStaleAsset } from './staleAssetRecovery'

describe('isStaleAssetError', () => {
  it('reconhece preload de CSS do Vite', () => {
    expect(
      isStaleAssetError(new Error('Unable to preload CSS for https://getvieira.com/assets/Projects-Bxyl91Ji.css'))
    ).toBe(true)
  })

  it('reconhece chunk dinâmico falho', () => {
    expect(
      isStaleAssetError(new Error('Failed to fetch dynamically imported module: https://getvieira.com/assets/x.js'))
    ).toBe(true)
  })

  it('ignora erro de aplicação', () => {
    expect(isStaleAssetError(new Error('EmailJS failed'))).toBe(false)
    expect(isStaleAssetError(undefined)).toBe(false)
  })
})

describe('recoverFromStaleAsset', () => {
  it('só recarrega uma vez por sessão', () => {
    const store = new Map<string, string>()
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      }
    }
    let reloads = 0
    const reload = () => {
      reloads += 1
    }
    expect(recoverFromStaleAsset(reload, storage)).toBe(true)
    expect(reloads).toBe(1)
    expect(recoverFromStaleAsset(reload, storage)).toBe(false)
    expect(reloads).toBe(1)
  })
})
