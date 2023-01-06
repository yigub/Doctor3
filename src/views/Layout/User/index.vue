<template>
  <div class="user-page">
    <!-- 头部栏 -->
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="user?.avatar" />
        <div class="name">
          <p>{{ user?.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ user?.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ user?.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ user?.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ user?.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <!-- 药品订单栏 -->
    <div class="user-page-order">
      <div class="head">
        <h6>药品订单</h6>
        <router-link to="/order" class="allOrder"
          >全部订单 <van-icon name="arrow"
        /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <!-- 用这种show-zero的方式可以实现，当待付款数量为0时，徽标不会展示0出来而是直接不展示；也可以通过如下字符串的方式实现 -->
          <van-badge
            :content="user?.orderInfo.paidNumber"
            :show-zero="false"
            max="99"
          >
            <cp-icon name="user-daifukuan" badge="6" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.receivedNumber || ''" max="99">
            <cp-icon name="user-daifahuo" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.shippedNumber || ''" max="99">
            <cp-icon name="user-daishouhuo" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.finishedNumber || ''" max="99">
            <cp-icon name="user-complete" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <!-- 快捷工具栏 -->
    <div class="user-page-group">
      <h6>快捷工具</h6>
      <van-cell is-link title="我的问诊" to="/user/consult">
        <template #icon>
          <CpIcon name="user-consult"></CpIcon>
        </template>
      </van-cell>
      <van-cell is-link title="我的处方" to="/">
        <template #icon>
          <CpIcon name="user-prescription"></CpIcon>
        </template>
      </van-cell>
      <van-cell is-link title="家庭档案" to="/user/family">
        <template #icon>
          <CpIcon name="user-family"></CpIcon>
        </template>
      </van-cell>
      <van-cell is-link title="地址管理" to="/user/address">
        <template #icon>
          <CpIcon name="user-address"></CpIcon>
        </template>
      </van-cell>
      <van-cell is-link title="我的评价">
        <template #icon>
          <CpIcon name="user-evaluation"></CpIcon>
        </template>
      </van-cell>
      <van-cell is-link title="设置" to="/">
        <template #icon>
          <CpIcon name="user-shezhi"></CpIcon>
        </template>
      </van-cell>
    </div>
    <!-- 退出登录按钮 -->
    <a class="logout" @click="logout">退出登录</a>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'
import { showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 2.定义一个响应式数据
const user = ref<UserInfo>()

const store = useUserStore()
const router = useRouter()

// 1.当组件挂载完毕后发起请求，获取用户信息
onMounted(async () => {
  const res = await getUserInfo()
  user.value = res.data
})
const logout = async () => {
  /* 3.这个函数返回一个promise,当我点击确定时，返回一个成功的promise，然后就会执行后续代码；当点击取消时，就返回失败的promise,不再执行后续的代码
     4.这是一个异步操作，必须要等到用户选择了取消或确定之后，才能判断下一步执行什么。所以这里需要用到async await
  */
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确定要退出吗？'
  })
  //5. 当用户选择了确定要退出之后，调用用户仓库里的方法,删除浏览器里存储的用户token，然后跳转到登录页面
  store.delUser()
  router.replace('/login')
}
</script>

<style scoped lang="scss">
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  /* // 头部 */
  &-head {
    height: 200px;
    background: linear-gradient(
      180deg,
      rgba(44, 181, 165, 0.46),
      rgba(44, 181, 165, 0)
    );
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-row {
      margin: 0 -15px;
      padding-top: 15px;
      p {
        text-align: center;
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  /* // 订单 */
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;
      .allOrder {
        font-size: 14px;
      }
      a {
        color: var(--cp-tip);
      }
    }
    .van-col {
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }
  /* // 分组 */
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h6 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      height: 60px;
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
  // 退出按钮
  .logout {
    display: block;
    font-size: 18px;
    line-height: 40px;
    border-radius: 8px;
    margin: 12px auto;
    text-align: center;
    color: var(--cp-price);
    background-color: #fff;
  }
}
</style>
