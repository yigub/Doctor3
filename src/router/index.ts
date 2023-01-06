import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 8.引入进度条样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 9. 取消 NProgress 的右上角螺旋加载提示
nprogress.configure({ showSpinner: false })

//1. createRouter 创建路由实例
//2. history是路由模式，分别有hash模式，history模式; createWebHistory()是开启history模式[http://xxx/usr]，createWebHashHistory()是开启hash模式[http://xxx/#/usr]
//3. vite的配置 improt.meta.env.BASE_URL是路由的基准地址，默认是/

//4. 使用createRouter()创建实例
const router = createRouter({
  //5. 设置路由模式，import.meta.env.BASE_URL的值来自vite.config.ts的base属性的值
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/user/family',
      component: () => import('@/views/Family/index.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Layout/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Layout/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Layout/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/Layout/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})
// 6.全局路由导航守卫,to: 即将要进入的目标;from: 当前导航正要离开的路由
router.beforeEach((to, from) => {
  const store = useUserStore()
  const whiteList = ['/login', '/register']
  // 7.没有token，并且要去的页面不是登录注册页面,那么就去登录页面。includes（参数）方法是返回true和false,当包含方法里的参数时返回true，不包含就返回false
  if (!store.user?.token && !whiteList.includes(to.path)) {
    return '/login'
  }
  nprogress.start()
})
router.afterEach((to) => {
  nprogress.done()
  document.title = `优医问诊-${to.meta.title}` //修改标题放到后置路由守卫里，等路由切换成功了再修改标题
})

export default router
