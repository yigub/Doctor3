<template>
  <!--1、像title,left-text这样的属性，要设置成动态的，因为其值不能固定,而是使用本组件的时候，才能确定其内容，所以这里需要用到defineProps-->
  <!--2、像click-left这样的事件，是van-nav-bar自带的事件，我们只需要对其传一个方法即可，但这里的方法可通过defineEmit实现子组件触发父组件定义的事情的效果-->
  <van-nav-bar
    left-arrow
    :title="title"
    :right-text="rightText"
    :left-text="leftText"
    @click-left="onClickLeft"
    @click-right="emits('click-right')"
  ></van-nav-bar>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  title?: string
  rightText?: string
  leftText?: string
  //6. 接收一个回调函数
  closePop?: () => void
}>()
const emits = defineEmits<{
  (e: 'click-right'): void
}>()
// 4.返回router实例,相当于在模板中使用$router,且必须在setup中调用
const router = useRouter()
// 3.对返回按钮进行设置.返回按钮的作用是后退，当浏览器有历史记录的时候，就后退一步；当浏览器没用历史记录的时候，就返回到home首页
const onClickLeft = () => {
  // 7.如果父组件传递了一个closePop回函数的话，那么点击返回按钮的时候，就执行这个回调函数，不再执行history里的路径
  if (props.closePop) return props.closePop()

  //5. 如果history里有回退记录的话，就后退,否则就去home首页
  if (history.state.back) {
    router.back()
  } else {
    router.push('/login')
  }
}
</script>

<style scoped></style>
