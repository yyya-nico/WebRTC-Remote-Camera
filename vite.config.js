import { resolve } from 'path'

export default {
    base: '/remote_camera/',
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