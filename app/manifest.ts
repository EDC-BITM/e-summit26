import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'E-Summit 2026 | EDC BIT Mesra',
    short_name: 'E-Summit 2026',
    description: 'The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#b602e1',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot_desktop.png',
        sizes: '2880x1800',
        type: 'image/png',
        form_factor: 'wide',
        label: 'E-Summit 2026 Desktop View',
      },
      {
        src: '/screenshot_tablet.png',
        sizes: '1024x768',
        type: 'image/png',
        label: 'E-Summit 2026 Tablet View',
      },
      {
        src: '/screenshot_phone.png',
        sizes: '450x768',
        type: 'image/png',
        label: 'E-Summit 2026 Mobile View',
      },
    ],
  }
}
