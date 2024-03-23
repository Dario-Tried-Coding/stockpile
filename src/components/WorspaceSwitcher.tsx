import { WorkspaceTypeIcons } from '@/components/icons/WorkspaceIcons'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useWorkspace } from '@/context/WorkspaceProvider'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { Workarea, Workspace } from '@prisma/client'
import lodash from 'lodash'
import { Check, ChevronsUpDown } from 'lucide-react'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import { ComponentPropsWithoutRef, FC, useState } from 'react'

interface WorkspaceSwitcherProps extends ComponentPropsWithoutRef<typeof PopoverTrigger> {
  user?: User | null
}

const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({ className, user, ...rest }) => {
  const t = useTranslations('Navbar.Components.WorkspaceSwitcher')
  const {workspace, setWorkspace} = useWorkspace()

  const [open, setOpen] = useState(false)

  const { data: workspaces } = trpc.getWorkspaces.useQuery()
  const organizedWorkspaces = workspaces?.reduce(
    (groupedByArea, w) => {
      const areaName = w.workarea
      if (!groupedByArea[areaName]) {
        groupedByArea[areaName] = []
      }
      groupedByArea[areaName].push(w)
      return groupedByArea
    },
    {} as Record<Workarea, typeof workspaces>
  )

  const WorkspaceIcon = workspace ? WorkspaceTypeIcons[workspace?.type] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild {...rest}>
        <Button variant='outline' role='combobox' aria-expanded={open} aria-label={t('label')} className={cn('w-[250px] justify-between', className)}>
          <Avatar className='mr-2 h-5 w-5'>
            {WorkspaceIcon ? (
              <AvatarFallback>
                <WorkspaceIcon className='h-4 w-4' />
              </AvatarFallback>
            ) : (
              <AvatarFallback className='bg-gradient-to-br from-primary-700 to-primary-300' />
            )}
          </Avatar>
          <span className='mr-2 truncate'>{workspace?.name ?? user?.name ?? t('placeholder')}</span>
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder={t('Search.placeholder')} />
            <CommandEmpty>{t('Search.no-results')}</CommandEmpty>
            <CommandGroup heading={t('placeholder')}>
              <CommandItem
                onSelect={() => {
                  setWorkspace(null)
                  setOpen(false)
                }}
                className='text-sm'
              >
                <Avatar className='mr-2 h-5 w-5'>
                  <AvatarFallback className='bg-gradient-to-br from-primary-700 to-primary-300' />
                </Avatar>
                <span className='truncate'>{user?.name}</span>
              </CommandItem>
            </CommandGroup>
            {organizedWorkspaces &&
              Object.entries(organizedWorkspaces).map(([areaName, workspaces]) => (
                <CommandGroup key={areaName} heading={lodash.capitalize(lodash.lowerCase(areaName))}>
                  {workspaces.map((w) => {
                    const Icon = WorkspaceTypeIcons[w.type]

                    return (
                      <CommandItem
                        key={w.id}
                        onSelect={() => {
                          setWorkspace(w)
                          setOpen(false)
                        }}
                        className='text-sm'
                      >
                        <Avatar className='mr-2 h-5 w-5'>
                          <AvatarFallback>
                            <Icon className='h-4 w-4' />
                          </AvatarFallback>
                        </Avatar>
                        <span className='truncate'>{w.name}</span>
                        {w.id === workspace?.id && <Check className='ml-auto h-4 w-4' />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default WorkspaceSwitcher
