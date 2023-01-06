// 1.用户信息类型
type User = {
  id: string
  account: string
  avatar: string
  mobile: string
  refreshToken: string
  token: string
}

//2. 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

/* 3.个人中心页面，获取的用户信息类型 
    1) UserInfo类型里包含User里除了token之外的所有类型
    2) 这里我们使用交叉类型，这样可以复用User类型（不需要token属性）
    3）Pick:可以从一个对象类型中取出某些属性 type bala=Pick<T,'某个属性'>
    4）Omit:可以从一个对象类型中排出某些属性 type bala=Omit<T,'某个属性'>
*/
// 3.1 先拿到排出了token属性的User类型
type OmitUser = Omit<User, 'token' | 'refreshToken'>
// 3.2 然后再合并成userinfo
type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 4.家庭档案页面，Family/index.vue,返回的请求数据类型，返回的是一个数组
// 4.1 此处是数组里面，单个患者的数据类型
type singlePatient = {
  /** 患者ID */
  id: string
  /** 患者名称 */
  name: string
  /** 身份证号 */
  idCard: string
  /** 0不默认  1默认 */
  defaultFlag: 0 | 1
  /** 0 女  1 男 */
  gender: 0 | 1
  /** 性别文字 */
  genderValue: string
  /** 年龄 */
  age: number
}
// 4.2 此处才是将要暴露出去的家庭成员类型，它是一个数组，每个数组元素的类型是singlePatient
type familyType = singlePatient[]

// 5.在家庭档案里添加患者时，患者的类型，这是根据接口文档所需要的类型来定制的
type Patient = {
  name: string
  idCard: string
  defaultFlag: number
  gender: number
}

export { User, CodeType, UserInfo, familyType, Patient }
