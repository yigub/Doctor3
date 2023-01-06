<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  name: string
}>()
</script>

<style scoped>
.cp-icon {
  /* 让svg图片和字体一样大，em单位是相当于浏览器字体大小设置的 */
  width: 1em;
  height: 1em;
}
</style>
