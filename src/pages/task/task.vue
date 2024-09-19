<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '任务',
  },
}
</route>
<template>
  <view class="task">我的任务</view>
  <myTask />
</template>

<script lang="ts" setup>
import myTask from './components/my_task/my_task.vue'
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}

.task {
  width: 100%;
  background-color: red;
  border-radius: 15rpx;
}
</style>
