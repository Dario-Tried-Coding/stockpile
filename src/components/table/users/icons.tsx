import { WorkspaceType } from "@prisma/client";
import { LucideIcon, Store, Warehouse } from "lucide-react";

type RoleIcon = {
  id: WorkspaceType
  icon: LucideIcon
}

export const roleIcons: RoleIcon[] = [
  {
    id: 'SHOP',
    icon: Store,
  },
  {
    id: 'PRODUCTION',
    icon: Warehouse,
  },
]