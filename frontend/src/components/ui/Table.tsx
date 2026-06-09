import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'

export function Table({ className = '', children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={['w-full border-collapse text-caption', className].join(' ')}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function Thead({ className = '', children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={['border-b border-iron', className].join(' ')} {...props}>
      {children}
    </thead>
  )
}

export function Tbody({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>
}

export function Tr({ className = '', children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={['border-b border-iron/50 hover:bg-slate/50 transition-colors', className].join(
        ' ',
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function Th({
  className = '',
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={[
        'px-4 py-3 text-left text-caption text-ash font-medium whitespace-nowrap',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </th>
  )
}

export function Td({
  className = '',
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={['px-4 py-3 text-chalk whitespace-nowrap', className].join(' ')}
      {...props}
    >
      {children}
    </td>
  )
}
