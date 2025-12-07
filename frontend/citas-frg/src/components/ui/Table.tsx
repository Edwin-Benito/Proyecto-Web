import React from 'react'

type NativeProps<E extends HTMLElement> = React.HTMLAttributes<E>

type Classed<P, E extends HTMLElement> = P & { className?: string; children?: React.ReactNode } & NativeProps<E>

export const Table = ({ className = '', ...props }: Classed<object, HTMLTableElement>) => {
  const base = 'min-w-full text-left divide-y divide-gray-200'
  return <table className={[base, className].join(' ')} {...props} />
}

export const Thead = ({ className = '', ...props }: Classed<object, HTMLTableSectionElement>) => {
  const base = 'bg-gray-50'
  return <thead className={[base, className].join(' ')} {...props} />
}

export const Tbody = ({ className = '', ...props }: Classed<object, HTMLTableSectionElement>) => {
  const base = 'bg-white divide-y divide-gray-200'
  return <tbody className={[base, className].join(' ')} {...props} />
}

export const Tr = ({ className = '', ...props }: Classed<object, HTMLTableRowElement>) => {
  const base = 'hover:bg-gray-50'
  return <tr className={[base, className].join(' ')} {...props} />
}

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
}

export const Th = ({ className = '', align = 'left', ...props }: ThProps) => {
  const base = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
  const alignCls = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return <th className={[base, alignCls, className].join(' ')} {...props} />
}

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
}

export const Td = ({ className = '', align = 'left', ...props }: TdProps) => {
  const base = 'px-6 py-4 whitespace-nowrap text-sm'
  const alignCls = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return <td className={[base, alignCls, className].join(' ')} {...props} />
}

export default Table
