import { useTranslations } from "next-intl"
import { toast } from "sonner"

export const useCustomToasts = () => {
  const t = useTranslations('Toasts')

  const tableClientErrorToast = (message: string) => {
    toast.error(message, {
      action: {
        label: t('Admin.UsersTable.reload'),
        onClick: () => window.location.reload(),
      },
    })
  }

  return { tableClientErrorToast }
}