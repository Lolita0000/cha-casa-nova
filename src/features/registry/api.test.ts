import { describe, expect, it } from 'vitest'

import { NetworkError, retryOnNetworkError, toFriendlyError } from './api'

describe('toFriendlyError', () => {
  it('explains network failures in plain words', () => {
    expect(toFriendlyError('TypeError: Failed to fetch').message).toMatch(/internet/)
    expect(toFriendlyError('Load failed').message).toMatch(/internet/)
  })

  it('keeps messages that already make sense', () => {
    expect(toFriendlyError('Informe se vai ou não.').message).toBe('Informe se vai ou não.')
  })
})

describe('retryOnNetworkError', () => {
  it('tries again when the connection drops', async () => {
    let calls = 0
    const result = await retryOnNetworkError(async () => {
      calls += 1
      if (calls < 3) throw toFriendlyError('TypeError: Failed to fetch')
      return 'ok'
    }, [0, 0])
    expect(result).toBe('ok')
    expect(calls).toBe(3)
  })

  it('gives up after the last attempt', async () => {
    await expect(
      retryOnNetworkError(async () => {
        throw toFriendlyError('Load failed')
      }, [0]),
    ).rejects.toBeInstanceOf(NetworkError)
  })

  it('does not retry validation errors', async () => {
    let calls = 0
    await expect(
      retryOnNetworkError(async () => {
        calls += 1
        throw toFriendlyError('Informe de 1 a 12 nomes.')
      }, [0, 0]),
    ).rejects.toThrow('Informe')
    expect(calls).toBe(1)
  })
})
