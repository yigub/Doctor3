<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!--1. 一级科室 -->
      <van-sidebar v-model="active">
        <van-sidebar-item
          :title="item.name"
          v-for="item in allDep"
          :key="item.id"
        />
      </van-sidebar>
      <!--2. 二级科室 -->
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="cdep in childDep"
          :key="cdep.id"
          @click="store.setDepId(cdep.id)"
          >{{ cdep.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores';
import type { TopDep } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
const active = ref(0)
// 1.一级科室
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})
// 2.二级科室,组件初始化没有数据 child 可能拿不到。所以不能在模板代码里直接写item[active].child,并且这里也必须加上问号
const childDep = computed(() => allDep.value[active.value]?.child)
// 3.在点击跳转科室时，记录下选择的科室的ID
const store = useConsultStore()
</script>

<style scoped lang="scss">
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
// 二级科室
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    font-size: 16px;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
