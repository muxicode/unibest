<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view>'欢迎来到登录页面'</view>
  <view class="tip">
    <wd-checkbox v-model="read" prop="read" custom-label-class="label-class">
      已阅读并同意
      <text style="color: #4d80f0" @click="showDeal">《巴拉巴拉吧啦协议》</text>
    </wd-checkbox>
  </view>
  <view class="footer">
    <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const read = ref(true)

const showDeal = () => {
  console.log('showDeal')
}
const handleSubmit = () => {
  console.log('handleSubmit')
}
</script>

<style lang="scss" scoped>
.tip {
  margin: 10px 15px 21px;
  font-size: 12px;
  color: #999;
}
.footer {
  padding: 0 25px 21px;
}
:deep(.label-class) {
  font-size: 12px !important;
  color: #999 !important;
}
</style>
