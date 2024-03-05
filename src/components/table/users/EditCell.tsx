import { Button } from '@/components/ui/Button'
import { useUsersTableContext } from '@/context/tables/UsersTableProvider'
import { ExtendedTableUser } from '@/lib/utils/tables/users-table'
import { CellContext } from '@tanstack/react-table'
import { AlertTriangle, Check, Loader2, Pencil, XIcon } from 'lucide-react'
import { FC } from 'react'

interface EditCellProps extends CellContext<ExtendedTableUser, unknown> {}

const EditCell: FC<EditCellProps> = ({ row }) => {
  const id = row.original.id

  const { getters, actions, setters } = useUsersTableContext()

  const isInEditMode = getters.isInEditMode(id)
  const isLoading = getters.isLoading(id)
  const isUserDirty = getters.isUserDirty(id)
  const isInErrorState = getters.isInErrorState(id)

  const isValid = !!row.original.workspaces.length

  return isInEditMode ? (
    <div className='flex items-center gap-1'>
      <Button
        variant='outline'
        onClick={() => (isUserDirty ? actions.saveUser(id) : setters.editMode.removeFromEditMode(id))}
        size='icon'
        disabled={isLoading || !isValid}
      >
        {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4' />}
      </Button>
      <Button variant='outline' onClick={() => actions.revertUser(id)} size='icon' disabled={isLoading}>
        <XIcon className='h-4 w-4' />
      </Button>
      {isInErrorState && <AlertTriangle className='inline h-6 w-6 text-destructive-foreground' />}
    </div>
  ) : (
    <Button variant='outline' onClick={() => actions.editUser(id)} size='icon'>
      <Pencil className='h-4 w-4' />
    </Button>
  )
}

export default EditCell
