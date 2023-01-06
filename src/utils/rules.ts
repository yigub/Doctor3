// 提取表单验证规则，方便其他组件复用,用方括号，可参考vant文档表单校验代码例题
const phoneRules = [
  // required,是否为必选字段
  { required: true, message: '请输入手机号' },
  // pattern,通过正则表达式验证
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]
const passwordRules = [
  { required: true, message: '请输入密码' },
  { pathern: /^\w{6,10}$/, message: '密码长度大于6但不超过10' }
]
const codeRules = [
  { required: true, message: '请输入验证码' },
  { pathern: /^\w{6}$/, message: '请输入正确的验证码' }
]
export { phoneRules, passwordRules, codeRules }
