type CacheEntry<T> = {
  expiresAt: number
  value: T
}

type CacheOptions<T> = {
  ttlMs?: number
  cacheKey?: string
  parse?: (res: Response) => Promise<T>
  errorMessage?: string
}

const responseCache = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

const defaultParse = async <T>(res: Response): Promise<T> => {
  return (await res.json()) as T
}

export const cachedGetJson = async <T>(url: string, options: CacheOptions<T> = {}): Promise<T> => {
  const key = options.cacheKey ?? url
  const ttlMs = options.ttlMs ?? 60000
  const now = Date.now()
  const cached = responseCache.get(key)
  if (cached && cached.expiresAt > now) {
    return cached.value as T
  }

  const inflightRequest = inflight.get(key)
  if (inflightRequest) {
    return (await inflightRequest) as T
  }

  const fetchPromise = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        const fallback = '\u004B\u0068\u00F4\u006E\u0067\u0020\u0074\u0068\u1EC3\u0020\u0074\u1EA3\u0069\u0020\u0064\u1EEF\u0020\u006C\u0069\u1EC7\u0075'
        throw new Error(options.errorMessage ?? fallback)
      }
      const parse = options.parse ?? defaultParse<T>
      return await parse(res)
    })
    .then((data) => {
      responseCache.set(key, { expiresAt: now + ttlMs, value: data })
      return data
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, fetchPromise)
  return (await fetchPromise) as T
}

export const invalidateCache = (prefix?: string) => {
  if (!prefix) {
    responseCache.clear()
    return
  }
  for (const key of responseCache.keys()) {
    if (key.startsWith(prefix)) {
      responseCache.delete(key)
    }
  }
}
