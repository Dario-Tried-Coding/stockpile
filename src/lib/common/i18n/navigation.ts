import { i18nConfig } from '@/config/i18n.config'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

const { locales, localePrefix } = i18nConfig

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales, localePrefix })
