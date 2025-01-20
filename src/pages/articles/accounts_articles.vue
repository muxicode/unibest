<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '领取文章',
  },
  needLogin: true,
}
</route>

<template>
  <view class="accounts-articles">
    <accounts mode="article" :filterTrackId="filterTrackId" />
  </view>
</template>

<script lang="ts" setup>
import Accounts from '@/components/accounts.vue'
// 控制底部按钮的显示
const filterTrackId = ref('')

// 获取页面参数
onLoad((options: any) => {
  filterTrackId.value = options?.filterTrackId
  console.log(filterTrackId.value)
})
</script>

<style lang="scss" scoped>
.accounts-articles {
  background-color: #f5f5f5;
}
</style>
