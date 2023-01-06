<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPassword ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPassword = !isPassword">
        <span>{{ isPassword ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form @submit="login" ref="form">
      <van-cell-group inset>
        <van-field
          name="phone"
          v-model="phone"
          type="text"
          placeholder="请输入手机号"
          :rules="phoneRules"
        />
        <!-- 密码登录 -->
        <van-field
          v-if="isPassword"
          v-model="password"
          :type="flag ? 'text' : 'password'"
          placeholder="请输入密码"
          :rules="passwordRules"
        >
          <!-- 此处是vant输入框的具名插槽，表示放在密码输入框尾部的按钮，也就是显示隐藏的小眼睛按钮。具体可查看vant文档里输入框相关属性 -->
          <template #button>
            <CpIcon
              :name="flag ? 'login-chakan' : 'login-yincang'"
              @click="flag = !flag"
              class="cpicon"
            ></CpIcon>
          </template>
        </van-field>
        <!-- 验证码登录 -->
        <van-field
          v-else
          type="text"
          v-model="phoneCode"
          placeholder="请输入验证码"
          :rules="codeRules"
        >
          <template #button>
            <span
              class="btn-send"
              @click="sendCode"
              :class="time > 0 ? 'active' : ''"
              >{{ time > 0 ? `${time}秒后重发` : '发送验证码' }}</span
            >
          </template>
        </van-field>
      </van-cell-group>
      <van-checkbox v-model="checked" icon-size="14px">
        <span>我已同意</span>
        <a href="javascript:;">用户协议</a>
        <span>及</span>
        <a href="javascript:;">隐私协议</a>
      </van-checkbox>
      <van-button round block type="primary" native-type="submit"
        >登录</van-button
      >
      <div class="forget"><a href="javascript:;">忘记密码?</a></div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/QQ.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
// 从工具函数文件夹下引入表单信息验证规则
import { phoneRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast, type FormInstance } from 'vant'
import { loginByCode, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

// 1.pinia仓库里的用户信息小仓库
const store = useUserStore()
// 2.useRouter相当于vue2里的$router，用于路由跳转
const router = useRouter()
// 3. useRoute相当于vue2里的$route,存储着路由信息
const route = useRoute()

const flag = ref(false)
// 设置一个布尔变量，用来控制切换密码登录还是短信验证码登录
const isPassword = ref(true)
const phone = ref()
const phoneCode = ref()
const password = ref()
const checked = ref(false)

// 4.点击登录按钮
const login = async () => {
  if (!checked.value) {
    return showToast('请勾选同意按钮')
  }
  // 4.1 判断现在是密码登录模式还是验证码登录模式，然后发送不同的请求
  const res = isPassword.value
    ? await loginByPassword(password.value, phone.value)
    : await loginByCode(phone.value, phoneCode.value)
  // 4.2 将拿到的用户信息存储起来
  store.setUser(res.data)
  // 4.3 登录成功之后路由跳转至个人中心，或如果有回跳地址就进行回跳,此处用到了类型断言
  router.push((route.query.returnUrl as string) || '/user')
  showToast('登录成功')
}

// 5.点击发送 短信验证码登录按钮
// 5.1 通过ref获取表单实例
const form = ref<FormInstance>()
const time = ref(0)
// 5.4 定义一个定时器
let timer: number | undefined
const sendCode = async () => {
  // 5.2 如果倒计时的时长大于0的话，说明正在进行倒计时逻辑，此时返回空，下面的代码也不会执行，即再点击按钮不会发送请求。
  if (time.value > 0) return
  /* 5.3 验证手机号输入框这个单个表单项,这里需要按照vant文档里的方法，给被验证的表单项增加一个name。同时，这里返回的是一个promise对象
  只有当promise对象返回的结果是成功的时候，才执行后面的代码。如果是失败的promise，那么就捕获异常且不执行后面的程序，so这里使用async await*/
  await form.value?.validate('phone')
  const res = await sendMobileCode(phone.value, 'login')
  // 5.5 如果有定时器已经开了的话，就将其清除掉
  if (timer) {
    clearInterval(timer)
  }
  // 5.6 给倒计时设置时长
  time.value = 60
  timer = setInterval(() => {
    if (time.value <= 0) {
      clearInterval(timer)
    }
    time.value--
  }, 1000)
  console.log(res.data)
}
// 5.7 当登录组件卸载时，就关闭这个定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.login {
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }

    .van-icon {
      margin-left: 5px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

// 表单内容
.van-form {
  font-size: 12px;
  padding: 0 14px;

  .cpicon {
    width: 2em;
    height: 2em;
  }

  .van-checkbox {
    display: flex;
    height: 52px;
    align-items: center;
    padding: 0 12px;

    a {
      padding: 0 5px;
      color: var(--cp-primary);
    }
  }

  .forget {
    display: flex;
    justify-content: center;
    height: 60px;
    line-height: 60px;
  }

  .btn-send {
    color: var(--cp-primary);
    display: flex;
    align-items: center;
    height: 35.2px;

    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
