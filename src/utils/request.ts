import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'
// import type { User } from '@/types/user'

// 1.定义基准地址
const baseURL = 'https:consult-api.itheima.net'

// 2.创建一个axios实例，配置基准地址，配置响应超时时间
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 3. 添加请求拦截器,并在请求头里携带token
instance.interceptors.request.use(
  (config) => {
    // 3.1 此处可以对config进行修改，例如可以修改请求头等等
    // 3.2 获取token，并放在请求头里发送给服务器 ，此处的Bearer代表一种模式，不加也不影响使用
    const store = useUserStore()
    // 如果用户信息里有token的话，且同时定义了config.headers时
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => {
    // 3.3 出错的时候，就返回一个失败的promise
    return Promise.reject(err)
  }
)
// 4. 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    //4.1接口文档描述当状态码status为200时，表示响应成功；但只有同时code为10000时，才有正确的响应数据，所以这里需要剥离code为10000时的无效数据
    // 4.2 不为10000说明业务错误
    if (res.data.code != 10000) {
      // 4.3 使用vant里的Toast对出错进行一个轻提示，即报错阻断程序
      showToast(res.data.message || '网络异常')
      // 4.4 返回一个失败的promise
      return Promise.reject(res.data)
    }
    // 4.5 请求成功的话，就返回响应数据
    return res.data
  },
  (err) => {
    //4.6如果请求报错的状态码是401，即用户信息过期了，所以删掉存储的用户信息，然后跳转到登录页面，同时带上当前页面的地址以便登录之后好回到当前页面
    if (err.response.status == 401) {
      const store = useUserStore()
      store.delUser()
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    // 4.3 请求报错，响应出错，请求出错的时候就返回一个失败的promise
    return Promise.reject(err)
  }
)

type Data<T> = {
  code: number
  message: string
  data: T
}

// 5.封装一个工具函数，之后在项目里发送axios请求，就全都使用这个工具函数
// 5.1这里的method的类型Method是axios自带的类型，从axios里将其导入即可
const request = <T>(url: string, method: Method, submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    // 5.2 当请求方法是get时，提交的参数应该放在query里，但当请求方法是post时，应该放在data里。这里的方括号是一种新写法
    [method.toLowerCase() == 'get' ? 'params' : 'data']: submitData
  })
}
export { baseURL, instance, request }
