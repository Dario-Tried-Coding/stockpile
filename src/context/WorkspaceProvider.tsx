'use client'

import { FC, PropsWithChildren, useContext, useState } from 'react'
import { Workspace } from "@prisma/client";
import { Dispatch, SetStateAction, createContext } from "react";

// context
interface WorkspaceContextProps {
  workspace: Workspace | null
  setWorkspace: Dispatch<SetStateAction<Workspace | null>>
}
const WorkspaceContext = createContext<WorkspaceContextProps | null>(null)

// context provider
interface WorkspaceProviderProps extends PropsWithChildren {}
const WorkspaceProvider: FC<WorkspaceProviderProps> = ({ children }) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)

  return <WorkspaceContext.Provider value={{workspace, setWorkspace}}>{children}</WorkspaceContext.Provider>
}

export default WorkspaceProvider

// utility fn
export const useWorkspace = () => {
  const workspaceContext = useContext(WorkspaceContext)
  if (!workspaceContext) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return workspaceContext
}