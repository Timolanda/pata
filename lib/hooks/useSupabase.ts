import { useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

interface ApiResponse<T> {
  data: T | null
  error: PostgrestError | null
  loading: boolean
}

export function useSupabase<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = async (operation: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await operation()
      setData(result)
      return { data: result, error: null }
    } catch (err) {
      const error = err as PostgrestError
      setError(error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    error,
    loading,
    execute
  }
}

// Example usage:
/*
const { data, error, loading, execute } = useSupabase<UserProfile>()

// In your component:
useEffect(() => {
  execute(async () => {
    return await getCurrentUser()
  })
}, [execute])

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return null

return <UserProfile profile={data} />
*/ 