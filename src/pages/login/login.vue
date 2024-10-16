<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '注册登录',
  },
}
</route>
<template>
  <view>'欢迎来到登录页面'</view>
  <view class="tip">
    <wd-checkbox v-model="read" prop="read" custom-label-class="label-class">
      已阅读并同意
      <text style="color: #4d80f0" @click="showDeal">《隐私政策条款》</text>
    </wd-checkbox>
  </view>
  <view class="footer">
    <wd-button type="primary" size="large" @click="quickLogin" block>手机号快捷登录</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
const code = ref('')
const openId = ref('')

onShow(() => {
  console.log('login on Show')
  wx.showLoading({
    title: '登录微信用户',
    mask: true,
  })
  uni.login({
    success: (res) => {
      if (res.code) {
        wx.hideLoading()
        code.value = res.code
        // console.log('wx.login获得code成功', res)
        // vuex中的openId/unionId若存在就直接调用获取token接口
        if (openId.value) {
          getAccessToken(openId.value)
        } else {
          getOpenId({ code: code.value })
        }
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    },
    fail(err) {
      wx.hideLoading()
      wx.showToast({
        title: 'wx.login失败' + err,
        icon: 'none',
        duration: 1000,
      })
    },
  })
})

// 获取openid
const getOpenId = function (parameter) {
  uni.showLoading({
    title: '获取openId',
    mask: true,
  })
  const res = this.$http('getOpenId', parameter)
  console.log('获取openId', res)
  wx.hideLoading()
  if (res.success) {
    // 生成唯一值
    this.setOpenId(res.data.openid)
    // console.log('获取openId---值', res.data.openid)
    this.getAccessToken(res.data.openid)
  }
}

// 获取token
const getAccessToken = function (openId) {
  const res = this.$http('getAccessToken', { openid: openId })
  // console.log('获取token', res)
  if (res.success) {
    if (res.data) {
      this.isShowPhone = false
      this.setToken(res.data)
      this.$reLaunch('/pages/tabbarPage/main')
    } else {
      // 是否显示 一键登录按钮
      this.isShowPhone = true
    }
  }
}

const read = ref(false)

const showDeal = () => {
  console.log('showDeal')
  uni.navigateTo({ url: '/pages/deal/deal' })
}
const quickLogin = () => {
  console.log('quickLogin')
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
