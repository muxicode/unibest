<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '结算',
  },
}
</route>
<template>
  <view class="accounts-settlement">
    <accounts mode="settlement" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Accounts from '@/components/accounts.vue'
import { onShow } from '@dcloudio/uni-app'
import { useTabbarStore } from '@/store'
const tabbarStore = useTabbarStore()

onShow(() => {
  tabbarStore.tabbarInfo.activeIndex = 2
})

// const countList = ref([
//   {
//     title: '公众号名称',
//     info: '职场情感',
//     days: 50,
//     articleNum: 5,
//     report: false,
//     totalMoney: 12504,
//   },
// ])

// const uploadData = function (item: any) {
//   console.log('uploadData')
//   // item.report = trues
// }
</script>

<style lang="scss" scoped>
.accounts-settlement {
  background-color: #f5f5f5;
}
</style>
