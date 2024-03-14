import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface TableViewOptionsProps<TData> {
  table: Table<TData>
}

function TableViewOptions<TData>({ table }: TableViewOptionsProps<TData>) {
  const t = useTranslations('Pages.Users.Table.Client.Toolbar.ViewOptions')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
          <Settings2 className='mr-2 h-4 w-4' />
          {t('button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableViewOptions