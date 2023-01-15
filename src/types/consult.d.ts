// 1.这是首页tab栏的 关注/推荐/减脂/饮食；他们的接口都一样，不一样的是要带一个请求参数type，其类型就是如下四个
type knowledgeType = 'recommend' | 'fatReduction' | 'food' | 'like'

// 2.单个数据，即单个文章数据结构
type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topic: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 3.文章信息列表，是一个数组
type KnowledgeList = Knowledge[]

// 4.发起请求 关注/推荐/减脂/饮食 的内容之后，以下是其返回回来的总的数据类型
type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 5.发请求的时候，需要带的请求参数类型
type KnowledgeParams = {
  type: KnowledgeType
  current: number
  pageSize: number
}

// 6.请求推荐的医生列表时需要携带的参数
type DoctorParams = {
  current: number
  pageSize: number
}
// 7.返回回来的单个关注医生类型，即医生卡片对象
type Doctor={
   // 医生ID
   id: string
   // 医生名称
   name: string
   // 头像
   avatar: string
   // 医院名称
   hospitalName: string
   // 医院等级
   gradeName: string
   // 科室
   depName: string
   // 职称
   positionalTitles: string
   // 是否关注，0 未关注 1 已关注
   likeFlag: 0 | 1
   // 接诊服务费
   serviceFee: number
   // 接诊人数
   consultationNum: number
   // 评分
   score: number
   // 主攻方向
   major: string
}
// 8.医生列表
type DoctorList=Doctor[]
// 9.医生分页数据，即发请求时返回回来的总的数据类型
type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 10.关注和取消关注时，关注医生/文章/话题/疾病 都是用的同一个接口，不同的是请求类型不同，所以我们在此定义类型
type likeType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 11.记录病情等一系列问诊请求参数，收集齐了之后，调用接口发送给服务器，就能保存或修改问诊订单
// 11.1 这是引入的枚举类型
import { ConsultType, IllnessTime } from '@/enums'
// 11.2 这是请求参数里的图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}
// 11.3 这是请求参数里的问诊记录，这里暂时没有开药的那些参数，因为目前极速问诊还用不上（此处写这些类型是为极速问诊准备的）
export type Consult = {
  // 问诊记录ID
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型，0 普通 1 三甲
  illnessType: 0 | 1
  // 科室ID
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: IllnessTime
  // 是否就诊过，0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者ID
  patientId: string
  // 优惠券ID
  couponId: string
}

// 11.4 问诊记录-使用Partial（内置的泛型类型）将其变为全部可选
export type PartialConsult = Partial<Consult>


export {
  knowledgeType,
  Knowledge,
  KnowledgeList,
  KnowledgePage,
  KnowledgeParams,
  DoctorParams,
  Doctor,
  DoctorList,
  DoctorPage,
  likeType
}
