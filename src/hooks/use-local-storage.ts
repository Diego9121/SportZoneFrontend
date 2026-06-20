import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage no disponible (modo privado, cuota llena, etc.)
    }
  }, [key, value])

  const remove = useCallback(() => {
    window.localStorage.removeItem(key)
  }, [key])

  return [value, setValue, remove] as const
}
