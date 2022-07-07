import ExpiryMap from 'expiry-map'
import pMemoize from 'p-memoize'

export class AsyncCache<T> {
  getCachedOrCompute: (f: () => Promise<T>) => Promise<T>
  constructor(public ttl = 300e3) {
    const cache = new ExpiryMap(ttl)
    this.getCachedOrCompute = pMemoize((f) => f(), {
      cache,
      cacheKey: () => 'cache',
    })
  }
}
