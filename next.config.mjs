import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/common/i18n')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
