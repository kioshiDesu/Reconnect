import { clsx } from 'clsx'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'offline' | 'away'
  showStatus?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
}

export function Avatar({
  src,
  alt,
  size = 'md',
  status = 'offline',
  showStatus = false,
}: AvatarProps) {
  return (
    <div className={clsx('relative inline-block', sizeClasses[size])}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gray-300 flex items-center justify-center',
            sizeClasses[size]
          )}
        >
          <span className="text-gray-600 font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {showStatus && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white',
            statusColors[status]
          )}
        />
      )}
    </div>
  )
}
