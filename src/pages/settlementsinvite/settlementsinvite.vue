<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '邀请结算',
  },
}
</route>

<template>
  <view class="page-container">
    <wd-message-box />
    <wd-toast />

    <view class="header-section">
      <view class="gradient-bg"></view>
      <view class="header-content">
        <image src="/static/logo.png" alt="" class="logo" />
        <view class="header-text">
          <view class="title">邀请结算</view>
          <view class="subtitle">分享邀请，共享收益</view>
        </view>
      </view>
    </view>

    <view class="form-card" v-for="item in settlements" :key="item.id">
      <view class="form-header">
        <text>{{ item.sp }}期</text>
        <text :class="['status', getStatusClass(item.settlementStatus)]">
          {{ getStatusText(item.settlementStatus) }}
        </text>
      </view>
      <view class="form-body">
        <view class="info-row">
          <text class="label">邀请账号总收入：</text>
          <text class="value">¥{{ formatAmount(item.totalInviteUserInCome) }}</text>
        </view>
        <view class="info-row">
          <text class="label">分成比例：</text>
          <text class="value">{{ formatProportion(item.inviteProportion) }}%</text>
        </view>
        <view class="info-row">
          <text class="label">分成收入：</text>
          <text class="value highlight">¥{{ formatAmount(item.payment) }}</text>
        </view>
        <view class="info-row" v-if="item.note">
          <text class="label">备注：</text>
          <text class="value">{{ item.note }}</text>
        </view>

        <view class="details-section">
          <view class="details-header" @click="toggleDetails(item.id)">
            <text class="detail-text">查看邀请明细</text>
            <wd-icon
              :name="expandedItems.includes(item.id) ? 'arrow-up' : 'arrow-down'"
              size="28"
            />
          </view>

          <view class="invite-details" v-if="expandedItems.includes(item.id)">
            <view class="invite-item" v-for="user in item.userIncomes" :key="user.userId">
              <view class="invite-header">
                <text class="invite-user">用户ID: {{ user.userId }}</text>
                <text class="invite-income">¥{{ formatAmount(user.income) }}</text>
              </view>
              <view class="invite-note" v-if="user.note">
                <text>备注: {{ user.note }}</text>
              </view>
              <view
                class="invite-accounts"
                v-if="user.accountIncomes && user.accountIncomes.length > 0"
              >
                <view
                  class="account-item"
                  v-for="account in user.accountIncomes"
                  :key="`${account.userId}_${account.accountId}_${account.sp}`"
                >
                  <text>{{ account.accountName }} ({{ account.sp }})</text>
                  <text :class="['account-status', getStatusClass(account.settlementStatus)]">
                    {{ getStatusText(account.settlementStatus) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-if="settlements.length === 0">
      <wd-icon name="info" size="48" />
      <text>暂无邀请结算数据</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'
import type { SettlementStatus, InviteSettlement } from '@/service/index/foo'
import { getUserInviteSettlements } from '@/service/index/foo'

const toast = useToast()
const settlements = ref<InviteSettlement[]>([])
const expandedItems = ref<string[]>([])

onLoad(() => {
  loadSettlements()
})

const getStatusText = (status: SettlementStatus) => {
  const statusMap = {
    INIT: '待结算',
    COMMIT: '审核中',
    FINISH: '已完成',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: SettlementStatus) => {
  const classMap = {
    INIT: 'init',
    COMMIT: 'commit',
    FINISH: 'finish',
  }
  return status ? classMap[status] : ''
}

const loadSettlements = async () => {
  try {
    const res = await getUserInviteSettlements()
    // 确保我们正确处理接口返回的数据结构
    if (res && Array.isArray(res)) {
      settlements.value = res
    } else if (res && Array.isArray(res.data)) {
      settlements.value = res.data
    } else {
      settlements.value = []
      console.error('Unexpected response format:', res)
    }
  } catch (error: any) {
    toast.error(error.message || '获取邀请结算列表失败')
  }
}

const formatProportion = (proportion: number | undefined) => {
  return proportion !== undefined ? (proportion * 100).toFixed(0) : '0'
}

const formatAmount = (amount: number | undefined) => {
  return amount !== undefined ? amount.toFixed(2) : '0.00'
}

const toggleDetails = (id: string) => {
  const index = expandedItems.value.indexOf(id)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(id)
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding: 24rpx;
  background-color: #f5f5f5;
}

.header-section {
  position: relative;
  padding: 40rpx 30rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
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

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.header-text {
  margin-left: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
}

.subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.form-card {
  margin-bottom: 24rpx;
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  background-color: #f8f8f8;
}

.status {
  padding: 4rpx 12rpx;
  font-size: 24rpx;
  border-radius: 24rpx;

  &.init {
    color: #ff9900;
    background-color: #fff9e6;
  }

  &.commit {
    color: #2b85e4;
    background-color: #f0faff;
  }

  &.finish {
    color: #19be6b;
    background-color: #e8f9f0;
  }
}

.form-body {
  padding: 24rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  font-size: 28rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  width: 200rpx;
  color: #666;
}

.value {
  flex: 1;
  color: #333;

  &.highlight {
    font-weight: 500;
    color: #ff6700;
  }
}

.details-section {
  padding-top: 16rpx;
  margin-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx;
  cursor: pointer;

  .detail-text {
    margin-right: 8rpx;
    font-size: 26rpx;
    color: #4d80f0;
  }

  &:active {
    opacity: 0.7;
  }
}

.invite-details {
  padding-top: 16rpx;
  margin-top: 16rpx;
  border-top: 2rpx dashed #eee;
}

.invite-item {
  padding: 16rpx;
  margin-bottom: 16rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.invite-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.invite-user {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}

.invite-income {
  font-size: 26rpx;
  font-weight: 500;
  color: #ff6700;
}

.invite-note {
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: #666;
}

.invite-accounts {
  margin-top: 12rpx;
}

.account-item {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  font-size: 24rpx;
  color: #666;

  &:not(:last-child) {
    border-bottom: 1rpx solid #eee;
  }
}

.account-status {
  font-size: 22rpx;

  &.init {
    color: #ff9900;
  }

  &.commit {
    color: #2b85e4;
  }

  &.finish {
    color: #19be6b;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  color: #999;

  text {
    margin-top: 16rpx;
    font-size: 28rpx;
  }
}

.button-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 24rpx;
  margin-top: 24rpx;
  border-top: 2rpx solid #f5f5f5;
}
</style>
