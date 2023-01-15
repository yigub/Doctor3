<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <knowledge-card
      v-for="(item, index) in list"
      :key="index"
      :item="item"
    ></knowledge-card>
  </van-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeList , KnowledgeParams , knowledgeType } from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'

/* 1.根据vant文档，刚开始给loading和finished都设置为false，当页面滑动到某个地方时，会触发load事件将loading设置为true,
    此时可以发起异步操作更新数据。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
    在onload里发起异步操作，一般就是发送ajax请求。
*/
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)

// 2.在list组件里接收home组件传递过来的type参数
const props = defineProps<{
  activeType: knowledgeType
}>()
const params = ref<KnowledgeParams>({
  type: props.activeType,
  current: 1,
  pageSize: 6 //一页有多少条数据
})
// 3.onload里进行异步操作
const onLoad = async () => {
  // 3.1 异步请求数据
  const res = await getKnowledgePage(params.value)
  // 3.2 将请求回来的数据，全部都存放到list里去;rows是一个数组，数组里存放了很多个对象，每个对象的内容就是Knowledge的内容
  // 3.3 所以，我们把row解构成单个的对象，list调用push方法就是把这些对象全都存到list数组里去。真的很奇妙
  list.value.push(...res.data.rows)
  // 3.4 当前页大于等于总页数，说明这已经是最后一页了，所以要让finish为true
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  }
  // 3.5 如果当前页小于总页数，说明还不是最后一页，所以让current++，继续请求下一页的数据
  else {
    params.value.current++
  }
  loading.value = false
}
</script>

<style scoped lang="scss">
.knowledge-list {
  padding: 0 15px;
}
</style>
