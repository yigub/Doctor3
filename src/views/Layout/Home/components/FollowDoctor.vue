<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;" @click="learnMore"> 查看更多 <i class="van-icon van-icon-arrow"/></a>
    </div>
    <div class="body">
      <!-- swipe 组件，在其他屏幕需要设置等比例的滚动宽度-->
      <van-swipe
        :width="(150 / 375) * width"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="(item, i) in list" :key="i">
          <DoctorCard :item="item"></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1.引入doctorCard.vue医生卡片组件，在swipe里进行展示
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { getDoctorPage } from '@/services/consult'
import type { DoctorList, DoctorPage, DoctorParams } from '@/types/consult'
import { showToast } from 'vant'
// 2.这里是为卡片滚动适应不同屏幕而做准备
const { width } = useWindowSize()
// 3.请求数据的必须参数
const getDoctorParams = ref<DoctorParams>({
  current: 1,
  pageSize: 100
})
// 4.医生卡片数据存放的地方,这是一个数组，数组里放了第一页所有的推荐医生。每个数组元素是一个对象，类型是Doctor
const list = ref<DoctorList>([])

// 5.将请求数据和数据存放封装成一个方法
// 5.1 拿到返回数据
const res = ref<DoctorPage>({
  pageTotal: 0,
  total: 1,
  rows: []
})
// 5.2 封装方法
const loadData = async () => {
  const bala = await getDoctorPage(getDoctorParams.value)
  res.value = bala.data
  // 5.1 将请求回来的第一页推荐医生(全都在rows里)，存放到list里去;
  list.value = res.value.rows
}

// 6.当本组件一挂载，就发请求去请求数据
onMounted(() => loadData())

// 7.点击了查看更多之后，令current++
const learnMore = () => {
  // 7.1 如果当前page小于总的page，那么说明还可以继续增加
  if (getDoctorParams.value.current < res.value?.pageTotal) {
    getDoctorParams.value.current++
    loadData()
  } else {
    showToast('没有更多了')
  }
}



</script>

<style scoped lang="scss">
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
