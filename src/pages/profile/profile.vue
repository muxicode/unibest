<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <view class="head">
    <!-- 未登录的情况 -->
    <block v-if="currAuthStep === 1">
      <view class="header" @click="gotoUserEditPage">
        <wd-img
          width="96rpx"
          height="96rpx"
          round
          :src="userInfo.avatarUrl || defaultAvatarUrl"
        ></wd-img>
        <view class="header__name">{{ '请登录' }}</view>
      </view>
    </block>
    <!-- 已登录但未授权用户信息情况 -->
    <block v-if="currAuthStep === 2">
      <view class="header">
        <wd-img
          width="96rpx"
          height="96rpx"
          round
          :src="userInfo.avatarUrl || defaultAvatarUrl"
        ></wd-img>
        <view class="header__name">{{ userInfo.nickName || '微信用户' }}</view>
        <!-- 需要授权用户信息，通过slot添加弹窗 -->
        <view class="header__transparent" v-if="isNeedGetUserInfo">
          <slot name="getUserInfo" />
        </view>
        <!-- 不需要授权用户信息，仍然触发gotoUserEditPage事件 -->
        <view class="header__transparent" @click="gotoUserEditPage" v-else></view>
      </view>
    </block>
    <!-- 已登录且已经授权用户信息的情况 -->
    <block v-if="currAuthStep === 3">
      <view class="header" @click="gotoUserEditPage">
        <wd-img
          width="96rpx"
          height="96rpx"
          round
          :src="userInfo.avatarUrl || defaultAvatarUrl"
        ></wd-img>
        <view class="header__name">{{ userInfo.nickName || '微信用户' }}</view>
      </view>
    </block>
  </view>
  <view v-for="(item, index) in menuData" :key="index" class="rounded-2 overflow-hidden mb-3">
    <wd-cell-group :border="false">
      <wd-cell
        v-for="(xitem, xindex) in item"
        :key="xindex"
        :title="xitem.title"
        :value="xitem.tit"
        is-link
        @click="onClickCell"
      >
        <template v-if="xitem.icon">
          <wd-icon :name="xitem.icon"></wd-icon>
        </template>
      </wd-cell>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
const menuData = ref([
  [
    {
      title: '收货地址',
      tit: '',
      url: '',
      type: 'address',
    },
    {
      title: '优惠券',
      tit: '',
      url: '',
      type: 'coupon',
    },
    {
      title: '积分',
      tit: '',
      url: '',
      type: 'point',
    },
  ],
  [
    {
      title: '帮助中心',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
])
</script>

<style lang="scss" scoped></style>
