import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1.用户信息
    const user = ref<User>()
    // 2.修改用户信息
    const setUser = (u: User) => {
      user.value = u
    }
    // 3.删除用户信息
    const delUser = () => {
      user.value = undefined
    }
    return { user, setUser, delUser }
  },
  //将persist配置为true，这里是引入了pinia-plugin-persistedstate插件，实现数据持久化存储
  { persist: true }
)

export { useUserStore }
