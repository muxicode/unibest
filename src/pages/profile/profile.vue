<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <view class="user-card" @click="handleEditProfile">
      <view class="gradient-bg"></view>
      <view class="user-info">
        <view class="avatar">🤖</view>
        <view class="info-right">
          <view class="user-name">{{ userStore.userInfo.nickname }}</view>
          <view class="invite-code" @click="handleCopyInviteCode">
            邀请码: {{ userStore.userInfo.inviteCode }}
            <text class="copy-hint">(点击复制)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <view
        v-for="(group, index) in menuList"
        :key="index"
        class="menu-card"
        :class="{ 'mt-3': index > 0 }"
      >
        <view class="menu-group">
          <template v-for="item in group" :key="item.type">
            <view
              v-if="!item.adminOnly || isAdmin"
              class="menu-item"
              hover-class="menu-item-hover"
              @click="handleMenuClick(item)"
            >
              <view class="menu-item-left">
                <wd-icon :name="item.icon" class="menu-icon"></wd-icon>
                <text class="menu-text">{{ item.title }}</text>
              </view>
              <wd-icon name="arrow-right" class="arrow-icon"></wd-icon>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore, useTabbarStore } from '@/store'

onShow(() => {
  tabbarStore.tabbarInfo.activeIndex = 3
})

const userStore = useUserStore()
const tabbarStore = useTabbarStore()

interface MenuItem {
  title: string
  tit: string
  url: string
  type: string
  icon: string
  adminOnly?: boolean
}

const isAdmin = computed(() => {
  return userStore.userInfo.userType === 'ADMIN'
})

const menuList = [
  [
    {
      title: '我的信息',
      tit: '',
      url: '',
      type: 'userInfo',
      icon: 'user-circle',
    },
    {
      title: '新增账号',
      tit: '',
      url: '',
      type: 'addCount',
      icon: 'usergroup-add',
    },
  ],
  [
    {
      title: '账号管理',
      tit: '',
      url: '',
      type: 'accountManage',
      icon: 'user',
    },
    {
      title: '账号审核',
      tit: '',
      url: '',
      type: 'accountReview',
      icon: 'check-circle',
      adminOnly: true,
    },
    {
      title: '赛道审核',
      tit: '',
      url: '',
      type: 'trackReview',
      icon: 'check-circle',
      adminOnly: true,
    },
    {
      title: '今日数据',
      tit: '',
      url: '',
      type: 'todayData',
      icon: 'list',
    },
    {
      title: '收益结算',
      tit: '',
      url: '',
      type: 'settlement',
      icon: 'chart',
    },
  ],
  [
    {
      title: '格式文章',
      tit: '',
      url: '',
      type: 'articleFormat',
      icon: 'tools',
    },
    {
      title: '联系客服',
      tit: '',
      url: '',
      type: 'customer',
      icon: 'service',
    },
    {
      title: '合作协议',
      tit: '',
      url: '',
      type: 'agreement',
      icon: 'file',
    },
    {
      title: '退出登录',
      tit: '',
      url: '',
      type: 'logout',
      icon: 'poweroff',
    },
  ],
]

const handleMenuClick = (item: MenuItem) => {
  console.log('handleMenuClick item', item)
  if (item.type === 'addCount') {
    uni.navigateTo({ url: '/pages/addcount/addcount' })
  }
  if (item.type === 'accountReview') {
    uni.navigateTo({ url: '/pages/accountreview/accountreview' })
  }
  if (item.type === 'accountManage') {
    uni.navigateTo({ url: '/pages/accountmanage/accountchangetrack' })
  }
  if (item.type === 'trackReview') {
    uni.navigateTo({ url: '/pages/accounttrackreview/accounttrackreview' })
  }
  if (item.type === 'articleFormat') {
    uni.navigateTo({ url: '/pages/articleFormat/articleFormat' })
  }
  if (item.type === 'logout') {
    userStore.userInfo.token = ''
    userStore.userInfo.userId = ''
    uni.reLaunch({
      url: '/pages/home/home',
      success: function () {
        tabbarStore.tabbarInfo.activeIndex = 0
      },
      fail: function () {},
    })
  }
}

const handleEditProfile = () => {
  uni.navigateTo({ url: '/pages/usercenter/person-info/index' })
}

const handleCopyInviteCode = () => {
  const code = userStore.userInfo.inviteCode
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({
        title: '邀请码已复制',
        icon: 'success',
        duration: 2000,
      })
    },
  })
}
</script>

<style lang="scss" scoped>
// .page-container {
//   min-height: 100vh;
//   padding: 24rpx;
//   background-color: #f8f8f8;
// }

.user-card {
  position: relative;
  padding: 40rpx 30rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  &:active {
    transform: scale(0.995);
  }
}

.gradient-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(135deg, #4d80f0 0%, #6c9cf5 100%);
  opacity: 0.06;
}

.user-info {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.avatar {
  font-size: 80rpx;
  line-height: 1;
}

.info-right {
  display: flex;
  flex-direction: column;
  margin-left: 24rpx;
}

.user-name {
  margin-left: 24rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.invite-code {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666;

  .copy-hint {
    margin-left: 8rpx;
    font-size: 20rpx;
    color: #4d80f0;
  }

  &:active {
    opacity: 0.7;
  }
}

.menu-card {
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  &:active {
    transform: scale(0.995);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  transition: background-color 0.3s;

  &:not(:last-child) {
    border-bottom: 2rpx solid #f8f8f8;
  }
}

.menu-item-hover {
  background-color: #f8f8f8;
}

.menu-item-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  color: #4d80f0;
}

.menu-text {
  margin-left: 24rpx;
  font-size: 28rpx;
  color: #333;
}

.arrow-icon {
  font-size: 32rpx;
  color: #999;
}
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6rpx;
  height: 6rpx;
}

::-webkit-scrollbar-track {
  background: #f8f8f8;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
/* 图标统一主题色 */
:deep(.menu-icon) {
  color: #4d80f0 !important;
}
</style>
