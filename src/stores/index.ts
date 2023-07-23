import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

// 导出pinia实例给main.ts使用
export default pinia
// 将user.ts文件通过index.ts暴露出去之后，以后在其他组件里使用user.ts时，就不需要引入复杂的路径，而是直接引入/stores即可
export * from './user'
export * from './consult'
