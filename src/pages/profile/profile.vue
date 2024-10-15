<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <view class="user-center-header fixed top-0 left-0 box-border w-full h-480rpx p-x-3">
    <!-- 未登录的情况 -->
    <block v-if="userStore.currAuthStep === 1">
      <view class="header" @click="gotoUserEditPage">
        <wd-img width="96rpx" height="96rpx" round :src="userStore.userInfo.avatarUrl"></wd-img>
        <view class="header__name">{{ '请登录' }}</view>
      </view>
    </block>
    <!-- 已登录但未授权用户信息情况 -->
    <block v-if="userStore.currAuthStep === 2">
      <view class="header">
        <wd-img width="96rpx" height="96rpx" round :src="userStore.userInfo.avatarUrl"></wd-img>
        <view class="header__name">{{ userStore.userInfo.nickName || '微信用户' }}</view>
        <!-- 需要授权用户信息，通过slot添加弹窗 -->
        <view class="header__transparent" v-if="userStore.isNeedGetUserInfo">
          <slot name="getUserInfo" />
        </view>
        <!-- 不需要授权用户信息，仍然触发gotoUserEditPage事件 -->
        <view class="header__transparent" @click="gotoUserEditPage" v-else></view>
      </view>
    </block>
    <!-- 已登录且已经授权用户信息的情况 -->
    <block v-if="userStore.currAuthStep === 3">
      <view class="header" @click="gotoUserEditPage">
        <wd-img width="96rpx" height="96rpx" round :src="userStore.userInfo.avatarUrl"></wd-img>
        <view class="header__name">{{ userStore.userInfo.nickName || '微信用户' }}</view>
      </view>
    </block>
  </view>
  <view class="relative p-x-4 pt-28">
    <view v-for="(item, index) in menuData" :key="index" class="rounded-2 overflow-hidden mb-3">
      <wd-cell-group :border="false">
        <wd-cell
          v-for="(xitem, xindex) in item"
          :key="xindex"
          :title="xitem.title"
          :value="xitem.tit"
          is-link
          @click="onClickCell(xitem)"
        >
          <template v-if="xitem.icon">
            <wd-icon :name="xitem.icon"></wd-icon>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()

interface menuItem {
  title: string
  tit: string
  url: string
  type: string
  icon: string
}

const onClickCell = function (item: menuItem) {
  if (item.type === 'addCount') {
    uni.navigateTo({ url: '/pages/addcount/addcount' })
  }
}

console.log('userStore.userInfo', userStore.userInfo)
console.log('userStore.isNeedGetUserInfo', userStore.isNeedGetUserInfo)
console.log('userStore.currAuthStep', userStore.currAuthStep)
console.log('userStore.isLogined', userStore.isLogined)

const gotoUserEditPage = function () {
  console.log('gotoUserEditPage')
  if (userStore.currAuthStep === 2) {
    uni.navigateTo({ url: '/pages/usercenter/person-info/index' })
  } else {
    uni.navigateTo({ url: '/pages/login/login' })
  }
}

const menuData = ref([
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
])
</script>

<style lang="scss" scoped>
.user-center-header {
  background-image: url(https://cdn-we-retail.ym.tencent.com/miniapp/template/user-center-bg-v1.png);
  background-repeat: no-repeat;
  background-size: cover;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 96rpx;
  margin-top: 80rpx;
  margin-bottom: 48rpx;
  line-height: 48rpx;
  color: #333;
}
.header__name {
  margin-right: 16rpx;
  margin-left: 24rpx;
  font-size: 36rpx;
  font-weight: bold;
  line-height: 48rpx;
  color: #333;
}
.header__transparent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.user-center-card__icon {
  line-height: 96rpx;
}
</style>
