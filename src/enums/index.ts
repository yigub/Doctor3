// 以下的枚举类型，将会在.d.ts里引入，像string/number/boolean这样的类型去使用，比如某个属性是枚举类型，某个属性是string类型，就这样去用

// 1. 问诊类型
enum ConsultType {
  // 找医生
  Doctor = 1,
  // 快速问诊
  Fast = 2,
  // 开药问诊
  Medication = 3
}
// 问诊时间，以1自增可以省略
enum IllnessTime {
  // 一周内
  Week = 1,
  // 一月内
  Month,
  // 半年内
  HalfYear,
  // 半年以上
  More
}

export { ConsultType, IllnessTime }
