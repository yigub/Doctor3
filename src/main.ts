import { createApp } from 'vue'
//3. stores模块下的所有资源通过index.ts文件导出，index.ts文件里暴露出来的有pinia
import pinia from './stores'
import App from './App.vue'
import router from './router'
// 4.将打包svg图的插件导入main.ts
import 'virtual:svg-icons-register'

// 1. 引入vant样式
import 'vant/lib/index.css'
//2. 引入自定义的css,且这个文件必须放在vant样式之后，因为我们会手写很多样式覆盖掉vant默认的样式
import './styles/main.scss'

const app = createApp(App)
app.use(router)
app.use(pinia)

app.mount('#app')
