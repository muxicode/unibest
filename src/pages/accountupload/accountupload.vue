<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '每日数据',
  },
}
</route>
<template>
  <view class="accounts-settlement">
    <accounts mode="report" />
  </view>
</template>

<script lang="ts" setup>
import Accounts from '@/components/accounts.vue'
</script>

<style lang="scss" scoped>
.accounts-settlement {
  background-color: #f5f5f5;
}
</style>
