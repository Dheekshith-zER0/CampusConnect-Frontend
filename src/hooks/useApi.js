import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../utils/format.js'

/**
 * Loads data with the given fetcher and tracks loading / error state.
 * The fetcher must be stable (a module function or wrapped in useCallback);
 * whenever it changes, the data is fetched again.
 */
export function useApi(fetcher) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ fetcher: null, reloadCount: -1, data: null, error: '' })

  useEffect(() => {
    let active = true
    fetcher()
      .then((data) => {
        if (active) setResult({ fetcher, reloadCount, data, error: '' })
      })
      .catch((error) => {
        if (active) {
          setResult((prev) => ({ fetcher, reloadCount, data: prev.data, error: getErrorMessage(error) }))
        }
      })
    return () => {
      active = false
    }
  }, [fetcher, reloadCount])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  // Loading until a response for the current fetcher / reload has arrived
  const loading = result.fetcher !== fetcher || result.reloadCount !== reloadCount

  return { data: result.data, error: loading ? '' : result.error, loading, reload }
}
