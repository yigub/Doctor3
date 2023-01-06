<template>
  <div>
    <RouterView></RouterView>
  </div>
  <!-- 1.在这里增加route,表示开启路由模式，开启之后搭配路由使用 -->
  <van-tabbar route>
    <van-tabbar-item to="/home">
      首页
      <!-- 2.template标签里加上#icon,才能往里面添加自定义图标；active说实话我也没搞懂 -->
      <template #icon="{ active }">
        <!-- 3.这里的意思就是选中的时候就用激活的svg,没选中的时候就用默认的svg -->
        <CpIcon :name="`user-home-${active ? 'active' : 'default'}`"></CpIcon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/article">
      健康百科
      <template #icon="{ active }">
        <CpIcon
          :name="`user-article-${active ? 'active' : 'default'}`"
        ></CpIcon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/notify">
      消息中心
      <template #icon="{ active }">
        <CpIcon :name="`user-notify-${active ? 'active' : 'default'}`"></CpIcon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/user">
      我的
      <template #icon="{ active }">
        <CpIcon :name="`user-user-${active ? 'active' : 'default'}`"></CpIcon>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style scoped></style>
