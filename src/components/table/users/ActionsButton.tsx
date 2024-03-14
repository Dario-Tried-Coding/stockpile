import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { getHotkeyHandler } from '@mantine/hooks'
import { Table } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'

interface ActionsButtonProps<TData> {
  table: Table<TData>
}

function ActionsButton<TData>({ table }: ActionsButtonProps<TData>) {
  const [open, setOpen] = useState(false)
  const openDialog = () => setOpen(true)

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const areRowsSelected = selectedRows.length > 0

  // hotkeys handler
  const handleHotkeys = getHotkeyHandler([['mod+D', openDialog]])

  if (areRowsSelected)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='h-8 w-8'>
              <Ellipsis className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' onKeyDown={handleHotkeys}>
            <DropdownMenuItem asChild className='text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground'>
              <DialogTrigger asChild>
                <span className='flex w-full items-center justify-between'>
                  Elimina
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stai eliminando {selectedRows.length} utenti dalla piattaforma</DialogTitle>
            <DialogDescription>Questa azione non è reversibile.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Annulla
              </Button>
            </DialogClose>
            <Button type='button' onClick={() => alert('Implement delete-users-mutation')}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

  return null
}

export default ActionsButton
