interface FieldWrapperProps {
  children: React.ReactNode
  error?: string
}

export default function FieldWrapper({ children, error }: FieldWrapperProps) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}