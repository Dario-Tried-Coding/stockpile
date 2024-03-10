import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { User } from '@prisma/client'
import { CellContext } from '@tanstack/react-table'
import { FC, useState } from 'react'
import { Ellipsis, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUsersTableContext } from '@/context/tables/UsersTableProvider'
import { getHotkeyHandler } from '@mantine/hooks'
import { trpc } from '@/lib/server/trpc/trpc'
import { toast } from 'sonner'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'

interface ActionsCellProps extends CellContext<User, unknown> {}

const ActionsCell: FC<ActionsCellProps> = ({ row }) => {
  const id = row.original.id

  const t = useTranslations('Pages.Users.Table.Client.Actions')
  const { actions } = useUsersTableContext()

  const [open, setOpen] = useState(false)

  const utils = trpc.useUtils()
  const { mutate: deleteUserMtn, isPending } = trpc.admin.deleteUser.useMutation({
    onError(err) {
      toast.error(err.message)
    },
    onSuccess({ message }) {
      toast.success(message)
      utils.admin.getUsers.invalidate()
    },
  })

  const deleteUser = () => deleteUserMtn({ id })
  const openDialog = () => setOpen(true)

  const handleHotkeys = getHotkeyHandler([['mod+d', openDialog]])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='data-[state=open]:bg-muted'>
            <Ellipsis className='h-4 w-4' />
            <span className='sr-only'>{t('open-menu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]' onKeyDown={handleHotkeys}>
          <DropdownMenuItem onSelect={() => actions.editUser(id)}>{t('edit')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className='text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground'>
            <DialogTrigger asChild>
              <span className='flex w-full items-center justify-between'>
                {t('Delete.label')}
                <DropdownMenuShortcut>{isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : '⌘D'}</DropdownMenuShortcut>
              </span>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Delete.Confirmation.heading', { user: row.original.name })}</DialogTitle>
          <DialogDescription>{t('Delete.Confirmation.sub-heading')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary' disabled={isPending}>
              {t('Delete.Confirmation.revert')}
            </Button>
          </DialogClose>
          <Button type='button' onClick={deleteUser}>
            {!isPending ? t('Delete.label') : <Loader2 className='h-4 w-4 animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ActionsCell
