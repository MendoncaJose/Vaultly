interface TopbarProps {
  title: string
  actions?: React.ReactNode
}

export function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-iron">
      <h1 className="text-heading-sm text-chalk-glow font-medium tracking-tight">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
