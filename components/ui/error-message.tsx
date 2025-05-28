import { AlertCircle } from 'lucide-react'
import { SupabaseError } from '@/lib/supabase-client'

interface ErrorMessageProps {
  error: SupabaseError
  className?: string
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  return (
    <div className={`flex items-center gap-2 text-red-600 ${className}`}>
      <AlertCircle size={20} />
      <div>
        <p className="font-medium">{error.message}</p>
        {error.details && <p className="text-sm text-red-500">{error.details}</p>}
        {error.hint && <p className="text-sm text-red-400">{error.hint}</p>}
      </div>
    </div>
  )
} 