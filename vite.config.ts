import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 2.这两个是为了配置svg打包工具引入的
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

//1. 这两个是从自动导入的插件中引入的
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //1. 这是解析单文件组件的插件
    vue(),
    //2. 这是自动导入的相关插件，解析器可以是vant element等
    Components({
      //2.1 默认是true，这是开启自动生成组件的类型声明文件，vant的组件已经有类型声明文件，只要导入了就会使用类型声明
      dts: false,
      //2.2 这里这个false是关闭自动引入样式，因为toast comfirm这类组件的样式还是需要单独引入，且vant的样式在main.ts中已经全局引入了
      resolvers: [VantResolver({ importStyle: false })]
    }),
    // 3.配置svg打包的插件
    createSvgIconsPlugin({
      // 3.1 指定图标文件夹，绝对路径（这是node代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],

  resolve: {
    alias: {
      // @ 是vite配置的，基于node提供的API，得到 src 的绝对路径
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
