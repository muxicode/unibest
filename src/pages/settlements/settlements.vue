<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '结算列表',
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
          <view class="title">结算列表</view>
          <view class="subtitle">记录每一笔收益，见证成长轨迹</view>
        </view>
      </view>
    </view>

    <view class="form-card" v-for="item in settlements" :key="item.id">
      <view class="form-header">
        <text>{{ item.settlementPart }}</text>
        <text :class="['status', getStatusClass(item.settlementStatus)]">
          {{ getStatusText(item.settlementStatus) }}
        </text>
      </view>
      <view class="form-body">
        <view class="info-row">
          <text class="label">平台：</text>
          <text class="value">{{ item.platForm }}</text>
        </view>
        <view class="info-row">
          <text class="label">用户分成比例：</text>
          <text class="value">{{ formatProportion(item.proportion) }}%</text>
        </view>
        <view class="info-row">
          <text class="label">结算单：</text>
          <text class="value">{{ item.settlementStatement || '暂无' }}</text>
        </view>
        <view class="info-row">
          <text class="label">评审状态：</text>
          <text class="value">{{ getReviewStatusText(item.reviewStatus) }}</text>
        </view>
        <view class="info-row" v-if="item.suggestion">
          <text class="label">评审建议：</text>
          <text class="value">{{ item.suggestion }}</text>
        </view>
        <view class="button-row" v-if="item.settlementStatus === 'INIT'">
          <wd-button type="primary" size="small" @click="handleSettle(item)">去结算</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'
import type { Settlement, SettlementStatus } from '@/service/index/foo'
import { getSettlements } from '@/service/index/foo'

const toast = useToast()
const settlements = ref<Settlement[]>([])
const accountId = ref('')

onLoad((options: any) => {
  accountId.value = options.accountId
  loadSettlements()
})

const getStatusText = (status: SettlementStatus) => {
  const statusMap = {
    INIT: '待结算',
    COMMIT: '审核中',
    FINISH: '已完成',
  }
  return statusMap[status]
}

const getReviewStatusText = (status: string | undefined) => {
  if (!status) return '暂无评审'

  const reviewStatusMap: Record<string, string> = {
    SUCCESS: '通过',
    FAIL: '驳回',
    NO_REVIEW: '未评审',
  }

  return reviewStatusMap[status] || status
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
    const res = await getSettlements({ accountId: accountId.value })
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
    toast.error(error.message || '获取结算列表失败')
  }
}

const handleSettle = (item: Settlement) => {
  uni.navigateTo({
    url: `/pages/income/income?id=${item.id}&accountId=${item.accountId}&proportion=${item.proportion}`,
  })
}

const formatProportion = (proportion: number | undefined) => {
  return proportion !== undefined ? (proportion * 100).toFixed(0) : '0'
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
}

.button-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 24rpx;
  margin-top: 24rpx;
  border-top: 2rpx solid #f5f5f5;
}
</style>
