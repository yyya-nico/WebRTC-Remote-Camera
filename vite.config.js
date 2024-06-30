import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default {
    base: '/remote-camera/',
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          'name': '遠隔カメラ',
          'short_name': '遠隔カメラ',
          'theme_color': '#101010',
          'background_color': '#1f1f1f',
          'display': 'fullscreen',
          'scope': '/remote_camera/',
          'start_url': '/remote_camera/',
          'lang': 'ja-JP',
          'icons': [
            {
              'src': 'icons/icon-72x72.png',
              'sizes': '72x72',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-96x96.png',
              'sizes': '96x96',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-128x128.png',
              'sizes': '128x128',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-144x144.png',
              'sizes': '144x144',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-152x152.png',
              'sizes': '152x152',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-192x192.png',
              'sizes': '192x192',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-384x384.png',
              'sizes': '384x384',
              'type': 'image/png'
            },
            {
              'src': 'icons/icon-512x512.png',
              'sizes': '512x512',
              'type': 'image/png',
              'purpose': 'any maskable'
            }
          ],
          'shortcuts': [
            {
              'name': '送信する',
              'short_name': '送信',
              'description': 'カメラ映像を送信する',
              'url': 'sender',
              'icons': [{ 'src': 'icons/sender.png', 'sizes': '192x192' }]
            },
            {
              'name': '受信する',
              'short_name': '受信',
              'description': 'カメラ映像を受信する',
              'url': 'reciever',
              'icons': [{ 'src': 'icons/reciever.png', 'sizes': '192x192' }]
            }
          ]
        }
      })
    ],
    build: {
      rollupOptions: {
        input: {
          top: resolve(__dirname, 'index.html'),
          sender: resolve(__dirname, 'sender.html'),
          reciever: resolve(__dirname, 'reciever.html'),
        },
      },
    },
}