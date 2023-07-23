import { request } from '@/utils/request'

import type {
  KnowledgeParams,
  KnowledgePage,
  DoctorParams,
  DoctorPage,
  likeType,
  TopDep
} from '@/types/consult'

// 1.首页里，点击关注/推荐/减脂/饮食时，发起不同类型的请求
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

// 2.定义获取推荐医生的方法
export const getDoctorPage = (params: DoctorParams) =>
  request<DoctorPage>('/home/page/doc', 'GET', params)

// 3.定义关注和取消关注医生的方法
export const likeDoctor = (type: likeType, id: string) =>
  request('/like', 'POST', { type, id })

// 4.定义请求一级科室和二级科室的方法
export const getAllDep = () => request<TopDep>('/dep/all', 'GET')
