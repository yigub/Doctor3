//1. 提取表单验证规则，方便其他组件复用,用方括号，可参考vant文档表单校验代码例题
const phoneRules = [
  // required,是否为必选字段
  { required: true, message: '请输入手机号' },
  // pattern,通过正则表达式验证
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

// 2.密码
const passwordRules = [
  { required: true, message: '请输入密码' },
  { pathern: /^\w{6,10}$/, message: '密码长度大于6但不超过10' }
]
// 3. 验证码
const codeRules = [
  { required: true, message: '请输入验证码' },
  { pathern: /^\w{6}$/, message: '请输入正确的验证码' }
]
// 4.姓名
const nameRules = [
  { required: true, message: '请输入姓名' },
  { pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/, message: '中文2-16个字符' }
]

// 5.身份证号
const idCardRules = [
  { required: true, message: '请输入身份证号' },
  {
    pattern:
      /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    message: '身份证号不正确'
  }
]


export { phoneRules, passwordRules, codeRules, nameRules, idCardRules }
