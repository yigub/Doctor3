//  定义用户端发起的各种API接口函数

import { request } from '@/utils/request'
import type { User, CodeType, UserInfo, familyType } from '@/types/user'

// 1.通过密码登录
export const loginByPassword = (password: string, mobile: string) => {
  return request<User>('/login/password', 'POST', { password, mobile })
}

// 2.获取手机号验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request('/code', 'GET', { mobile, type })
}

// 3.通过手机验证码登录
export const loginByCode = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}

// 4.获取用户信息，在User组件中用到，即个人中心
export const getUserInfo = () => request<UserInfo>('patient/myUser', 'GET')

// 5.家庭档案组件里，获取家庭档案里所有患者的信息
export const getFamilyList = () => request<familyType>('patient/mylist', 'GET')
