<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      href="javascript:;"
      v-for="item of optionList"
      :key="item.value"
      :class="{ active: item.value == modelValue }"
      @click="emits('update:modelValue', item.value)"
    >
      {{ item.title }}
    </a>
  </div>
</template>

<script setup lang="ts">
// 1.接收父组件传过来的数据，此数据应该是optionList[]数组，数组里的元素是对象，对象里的属性包含title和value
defineProps<{
  optionList: {
    title: string
    value: string | number
  }[]
  modelValue: string | number|undefined
}>()
// 2.父组件给本组件传递了一个gender，用来控制默认选中的是谁。当我们需要切换选中的时候，就需要修改父组件传过来的gender参数
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  //   换行
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
