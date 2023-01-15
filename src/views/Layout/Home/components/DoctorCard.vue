<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button
      round
      size="small"
      type="primary"
      @click="follow(item)"
      :loading="loading"
    >
      {{ item.likeFlag === 1 ? '已关注' : ' + 关注' }}
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { likeDoctor } from '@/services/consult'
import type { Doctor } from '@/types/consult'
import { ref } from 'vue'

defineProps<{
  item: Doctor
}>()
// 1.当点击关注之后，在请求没有发回来之前，应该让此按钮处于一个加载状态,这里通过loading实现
const loading = ref(false)

// 2.发送关注和取消关注医生请求，此时的关注类型应该是医生，即doc
const follow = async (item: Doctor) => {
  // 2.1尝试修改关注状态
  try {
    loading.value = true
    const res = await likeDoctor('doc', item.id)
    // 2.2 因为点击完关注按钮后，并不会向服务器发请求重新请求数据，所以点击关注按钮之后，虽然后台数据变了，但前台没有变，于是这里手动改变以下
    item.likeFlag = item.likeFlag == 1 ? 0 : 1
    console.log(res.data, item.likeFlag)
  } finally {
    // 2.3 无论是否修改成功，最后都要让Loading状态变为false
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.doctor-card {
  width: 135px;
  height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
