/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'xcxvgctmaynmuqxvtrwh.supabase.co',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig 