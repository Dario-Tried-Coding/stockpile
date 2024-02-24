import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({ }) => {
  const t = useTranslations('Index')
  return <div>{t('test')}</div>
}

export default page