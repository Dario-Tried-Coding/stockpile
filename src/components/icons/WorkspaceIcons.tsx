import { WorkspaceType } from "@prisma/client";
import { LucideIcon, Store, Warehouse } from "lucide-react";

type WorkspaceIcon = {
  id: WorkspaceType
  icon: LucideIcon
}

export const workspaceIcons: WorkspaceIcon[] = [
  {
    id: 'SHOP',
    icon: Store,
  },
  {
    id: 'PRODUCTION',
    icon: Warehouse,
  },
]