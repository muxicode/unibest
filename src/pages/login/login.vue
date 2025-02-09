<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>

<template>
  <view class="py-4 px-6">
    <wd-message-box />
    <wd-toast />

    <!-- 欢迎区域 -->
    <view class="mt-4 mb-8">
      <image src="/static/logo.png" alt="" class="w-24 h-24 block mx-auto rounded-3xl shadow-md" />
      <view class="text-center text-xl font-bold text-gray-800 mt-4">杰思云媒</view>
      <view class="text-center text-gray-500 mt-1 text-sm">让内容创作更简单</view>
    </view>

    <!-- 按钮 -->
    <view class="mt-20 px-2">
      <wd-button
        type="primary"
        size="large"
        :loading="loading"
        custom-class="submit-btn"
        @click="handleLogin"
        block
      >
        微信一键登录
      </wd-button>
    </view>

    <!-- 协议 -->
    <view class="mt-3 flex items-center justify-center agreement-wrapper">
      <wd-checkbox v-model="read" prop="read" custom-label-class="agreement-text">
        <view class="agreement-content">
          <text>我已阅读并同意</text>
          <text class="text-primary mx-1" @click.stop="showDeal">《隐私政策条款》</text>
          <text>和</text>
          <text class="text-primary ml-1" @click.stop="showUserServiceDeal">《用户服务协议》</text>
        </view>
      </wd-checkbox>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { useUserStore, useTabbarStore } from '@/store'
import { currRoute } from '@/utils'
import { onShow } from '@dcloudio/uni-app'
import { loginJieSi, type LoginResult } from '@/service/index/foo'
import { phoneCode } from '@/service/index/foo'
const tabbarStore = useTabbarStore()
const userStore = useUserStore()

defineOptions({
  name: 'Login',
})

// 协议阅读状态 - 默认不勾选
const read = ref(false)

// 加载状态
const loading = ref(false)

// 微信登录
const wxLogin = async () => {
  try {
    const { code } = await uni.login()
    if (!code) {
      throw new Error('获取登录code失败')
    }
    return code
  } catch (error) {
    uni.showToast({
      title: '获取登录code失败',
      icon: 'none',
    })
    return ''
  }
}

// 登录处理
const handleLogin = async () => {
  if (!read.value) {
    uni.showToast({
      title: '请先阅读并同意协议',
      icon: 'none',
    })
    return
  }

  try {
    loading.value = true
    const code = await wxLogin()
    if (!code) return

    const res = await loginJieSi(code)
    const u: LoginResult = res.data
    userStore.userInfo.token = u.token
    userStore.userInfo.userId = u.userId
    userStore.userInfo.nickname = u.userName
    userStore.userInfo.userType = u.userType
    let curPage = '/pages/home/home'
    const curPageIndex = tabbarStore.tabbarInfo.activeIndex
    if (curPageIndex === 1) {
      curPage = '/pages/task/task'
    } else if (curPageIndex === 2) {
      curPage = '/pages/settlement/settlement'
    } else if (curPageIndex === 3) {
      curPage = '/pages/profile/profile'
    }
    uni.reLaunch({
      url: curPage,
      success: function () {
        console.log('登录成功')
      },
      fail: function () {
        console.log('跳转失败')
      },
    })
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 显示协议
const showDeal = () => {
  uni.navigateTo({ url: '/pages/deal/deal?showButtons=false' })
}

const showUserServiceDeal = () => {
  uni.navigateTo({ url: '/pages/deal/user_service_deal' })
}

// 页面显示时自动登录
onShow(() => {
  wxLogin()
})
</script>

<style lang="scss" scoped>
.submit-btn {
  height: 88rpx;
  font-size: 32rpx;
  border-radius: 44rpx;
}

.agreement-wrapper {
  min-width: 0;
  padding: 0 24rpx;
}

.agreement-content {
  display: inline-flex;
  align-items: center;
  font-size: 20rpx;
  color: #999;
  white-space: nowrap;
}

:deep(.agreement-text) {
  font-size: 18rpx !important;
  line-height: 1;
  color: #999;
}

:deep(.text-primary) {
  color: #4d80f0;
}

:deep(.wd-checkbox) {
  display: inline-flex;
  align-items: center;
}

:deep(.wd-checkbox__shape) {
  font-size: 24rpx;
  transform: scale(0.8);
}

:deep(.wd-checkbox__label) {
  padding-left: 8rpx;
  line-height: 1;
}
</style>
