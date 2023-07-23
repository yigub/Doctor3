import type { ConsultType, IllnessTime } from '@/enums'
import type { PartialConsult, Image } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/* 1.设置问诊仓库的，是因为问诊的参数信息是一点一点累加的，也就是不同的参数是在不同的组件里拿到的
    所以我们创建一个问诊仓库，用于存放不同阶段收集到的问诊参数信息；
    最后在发送请求的时候，统一从仓库里拿到所有的信息，比挨个传递方便。
*/
const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 2.所有的问诊参数，全都在这里，到时候直接使用此变量即可,它是响应式的，并且类型我们早已在consult.d.ts里定义好了
    const consult = ref<PartialConsult>({})
    // 3.设置问诊的类型，此类型我们使用枚举，在enums/index.ts里早已定义好了。这里要做的就是根据前端传回来的值，给问诊参数consult里的type设置相应的值
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 4.快速问诊类型
    const setIllnessType = (illnessType: 0 | 1) =>
      (consult.value.illnessType = illnessType)
    // 5.科室Id
    const setDepId = (depId: string) => (consult.value.depId = depId)
    // 6.疾病描述
    const setIllnessDesc = (illnessDesc: string) =>
      (consult.value.illnessDesc = illnessDesc)
    // 7.疾病持续时间,此处的IllnessTime是enums/index.ts里的枚举类型
    const setillnessTime = (illnessTime: IllnessTime) =>
      (consult.value.illnessTime = illnessTime)
    // 8.是否就诊过
    const setconsultFlag = (consultFlag: 0 | 1) =>
      (consult.value.consultFlag = consultFlag)
    // 9.患者上传的图片数组
    const setPictures = (pictures: Image[]) =>
      (consult.value.pictures = pictures)
    // 10.患者ID
    const setPatientId = (patientId: string) =>
      (consult.value.patientId = patientId)
    // 11.优惠券ID
    const setCouponId = (couponId: string) =>
      (consult.value.couponId = couponId)
    // 12.清空记录
    const clearConsult = () => (consult.value = {})
    // 13.返回上面定义的所有方法
    return {
      setType,
      clearConsult,
      setPatientId,
      setPictures,
      setCouponId,
      setconsultFlag,
      setillnessTime,
      setIllnessDesc,
      setDepId,
      setIllnessType
    }
  },
  { persist: true }
)

// 14.必备，导出该仓库
export { useConsultStore }
