import { ComponentPropsWithoutRef, FC } from 'react'

import s from './table.module.scss'

export type Sort = {
  key: string
  direction: 'asc' | 'desc'
} | null

export type Column = {
  key: string
  title: string
  sortable?: boolean
}

export const Table: FC<ComponentPropsWithoutRef<'table'>> = ({ className, ...props }) => {
  return <table className={`${s.table} ${className}`} {...props} />
}

export const TableHeader: FC<ComponentPropsWithoutRef<'thead'>> = ({ className, ...props }) => {
  return <thead className={className} {...props} />
}

export const Head: FC<
  Omit<
    ComponentPropsWithoutRef<'thead'> & {
      columns: Column[]
      sort?: Sort
      onSort?: (sort: Sort) => void
    },
    'children'
  >
> = ({ columns, sort, onSort, ...rest }) => {
  const handleSort = (key: string, sortable?: boolean) => {
    if (!onSort || !sortable) return

    if (sort?.key !== key) return onSort({ key, direction: 'asc' })

    if (sort.direction === 'desc') return onSort(null)

    return onSort({
      key,
      direction: sort?.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <TableHeader {...rest}>
      <TableRow>
        {columns.map(column => (
          <TableHead
            key={column.key}
            onClick={() => handleSort(column.key, column.sortable)}
            data-sortable={column.sortable}
          >
            <div className={s.headCellContent}>
              {column.title}
              {sort?.key === column.key ? (
                <span aria-label="sort diraction icon">
                  {sort?.key === column.key && sort.direction === 'asc' ? '▲' : '▼'}
                </span>
              ) : (
                <span style={{ width: '16px' }} aria-label="sort diraction icon"></span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

export const TableBody: FC<ComponentPropsWithoutRef<'tbody'>> = ({ className, ...props }) => {
  return <tbody className={className} {...props} />
}

export const TableFooter: FC<ComponentPropsWithoutRef<'tfoot'>> = ({ className, ...props }) => {
  return <tfoot className={className} {...props} />
}

export const TableRow: FC<ComponentPropsWithoutRef<'tr'>> = ({ className, ...props }) => {
  return <tr className={className} {...props} />
}

export const TableHead: FC<ComponentPropsWithoutRef<'th'>> = ({ className, ...props }) => {
  return <th className={`${s.headCell} ${className}`} {...props} />
}

export const TableCell: FC<ComponentPropsWithoutRef<'td'>> = ({ className, ...props }) => {
  return <td className={`${s.tableCell} ${className}`} {...props} />
}

export const TableCaption: FC<ComponentPropsWithoutRef<'caption'>> = ({ className, ...props }) => {
  return <caption className={className} {...props} />
}
