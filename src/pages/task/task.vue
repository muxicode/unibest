<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '任务',
  },
}
</route>
<template>
  <myTask />
  <accounts mode="article,report" />
</template>

<script lang="ts" setup>
import myCountList from './components/my_count_list/my_count_list.vue'
import Accounts from '@/components/accounts.vue'
import myTask from './components/my_task/my_task.vue'
import { useTabbarStore } from '@/store'
const tabbarStore = useTabbarStore()

onShow(() => {
  tabbarStore.tabbarInfo.activeIndex = 1
})
</script>

<style lang="scss" scoped>
.task {
  width: 100%;
  background-color: red;
  border-radius: 15rpx;
}
</style>
