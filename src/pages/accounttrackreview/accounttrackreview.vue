<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '赛道变更审核',
  },
}
</route>

<template>
  <view class="accounts">
    <view class="account-card">
      <view class="card-header">
        <text class="title">赛道变更审核</text>
        <text class="subtitle">待审核 {{ reviewSheets.length }} 个申请</text>
      </view>

      <view class="account-list">
        <view v-for="item in reviewSheets" :key="item.id" class="account-item">
          <view class="account-content">
            <view class="account-main">
              <view class="account-info">
                <text class="account-name">{{ item.accountName }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.status)">
                    {{ STATUS_TEXT_MAP[item.status] }}
                  </text>
                  <text class="tag track-tag">
                    {{ getTrackName(item.oldTrackId) }} → {{ getTrackName(item.trackId) }}
                  </text>
                </view>
              </view>
            </view>

            <view class="account-actions">
              <view class="account-details">
                <view class="detail-item">
                  <text class="detail-label">账号ID</text>
                  <text class="detail-value">{{ item.accountId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">原赛道</text>
                  <text class="detail-value">{{ getTrackName(item.oldTrackId) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">新赛道</text>
                  <text class="detail-value highlight">{{ getTrackName(item.trackId) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">提交时间</text>
                  <text class="detail-value">{{ formatDate(item.createTime) }}</text>
                </view>
              </view>

              <view class="action-group">
                <button
                  class="action-btn approve-btn"
                  :class="{ 'is-loading': loadingMap[`${item.id}-approve`] }"
                  :disabled="loadingMap[`${item.id}-approve`]"
                  @click="handleApprove(item)"
                >
                  <text>通过</text>
                  <view v-if="loadingMap[`${item.id}-approve`]" class="loading-icon"></view>
                </button>
                <button
                  class="action-btn reject-btn"
                  :class="{ 'is-loading': loadingMap[`${item.id}-reject`] }"
                  :disabled="loadingMap[`${item.id}-reject`]"
                  @click="handleReject(item)"
                >
                  <text>拒绝</text>
                  <view v-if="loadingMap[`${item.id}-reject`]" class="loading-icon"></view>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  getAccountTrackReviewSheets,
  reviewAccountTrack,
  getTracks,
  type AccountTrackReviewSheet,
  type TracksInfo,
} from '@/service/index/foo'

const STATUS_TEXT_MAP: Record<string, string> = {
  UN_REVIEW: '待审核',
  SUCCESS: '已通过',
  FAIL: '已拒绝',
}

const STATUS_CLASS_MAP: Record<string, string> = {
  UN_REVIEW: 'status-reviewing',
  SUCCESS: 'status-normal',
  FAIL: 'status-blocked',
}

const reviewSheets = ref<AccountTrackReviewSheet[]>([])
const tracks = ref<TracksInfo[]>([])
const loadingMap = ref<Record<string, boolean>>({})

const getStatusClass = (status: string) => STATUS_CLASS_MAP[status] || ''

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const getTrackName = (trackId: string) => {
  const track = tracks.value.find((t) => t.trackId === trackId)
  return track ? track.trackName : '未知赛道'
}

const handleAction = async (
  item: AccountTrackReviewSheet,
  action: () => Promise<void>,
  type: 'approve' | 'reject',
) => {
  const loadingKey = `${item.id}-${type}`
  if (loadingMap.value[loadingKey]) return

  loadingMap.value[loadingKey] = true
  try {
    await action()
    // 从列表中移除已审核的账号
    reviewSheets.value = reviewSheets.value.filter((sheet) => sheet.id !== item.id)
  } finally {
    loadingMap.value[loadingKey] = false
  }
}

const handleApprove = async (item: AccountTrackReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params = {
        id: item.id,
        status: 'SUCCESS' as const,
        note: '审核通过',
      }
      const res = await reviewAccountTrack(params)
      if (res.code === 1) {
        uni.showToast({
          title: '审核通过',
          icon: 'success',
        })
      } else {
        throw new Error(res.msg || '审核失败')
      }
    },
    'approve',
  )
}

const handleReject = async (item: AccountTrackReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params = {
        id: item.id,
        status: 'FAIL' as const,
        note: '审核不通过',
      }
      const res = await reviewAccountTrack(params)
      if (res.code === 1) {
        uni.showToast({
          title: '已拒绝',
          icon: 'success',
        })
      } else {
        throw new Error(res.msg || '审核失败')
      }
    },
    'reject',
  )
}

const fetchData = async () => {
  try {
    const [sheetsRes, tracksRes] = await Promise.all([
      getAccountTrackReviewSheets('UN_REVIEW'),
      getTracks(),
    ])

    if (sheetsRes.code === 1) {
      reviewSheets.value = sheetsRes.data
    }

    if (tracksRes.code === 1) {
      tracks.value = tracksRes.data
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
// 复用 accountreview.vue 的样式，移除图片相关样式
$primary-color: #1989fa;
$success-color: #07c160;
$warning-color: #faad14;
$error-color: #ff4d4f;
$text-primary: #333333;
$text-secondary: #666666;
$border-color: #f0f0f0;
$background-color: #f5f5f5;
$card-background: #ffffff;
$spacing-xs: 8rpx;
$spacing-sm: 12rpx;
$spacing-md: 16rpx;
$spacing-lg: 20rpx;
$spacing-xl: 32rpx;
$border-radius: 12rpx;

.accounts {
  min-height: 100vh;
  padding: $spacing-lg;
  background: $background-color;
}

.account-card {
  background: $card-background;
  border-radius: $border-radius;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  padding: $spacing-xl;
  border-bottom: 2rpx solid $border-color;

  .title {
    margin-right: $spacing-sm;
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: 0.5rpx;
  }

  .subtitle {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.account-list {
  .account-item {
    position: relative;
    padding: $spacing-xl;
    border-bottom: 2rpx solid $border-color;
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background-color: rgba($background-color, 0.5);
    }
  }
}

.account-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.account-info {
  .account-name {
    margin-bottom: $spacing-xs;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.4;
    color: $text-primary;
  }
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.tag {
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-weight: 500;
  border-radius: 6rpx;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);

  &.status-tag {
    &.status-normal {
      color: $success-color;
      background: rgba($success-color, 0.08);
    }

    &.status-blocked {
      color: $error-color;
      background: rgba($error-color, 0.08);
    }

    &.status-reviewing {
      color: $warning-color;
      background: rgba($warning-color, 0.08);
    }
  }

  &.track-tag {
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.detail-item {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  justify-content: space-between;

  .detail-label {
    font-size: 22rpx;
    color: $text-secondary;
  }

  .detail-value {
    font-size: 24rpx;
    color: $text-primary;

    &.highlight {
      font-weight: 500;
      color: $primary-color;
    }
  }
}

.action-group {
  display: flex;
  gap: $spacing-sm;
  justify-content: flex-end;
  margin-top: $spacing-lg;
}

.action-btn {
  position: relative;
  width: 140rpx;
  height: 64rpx;
  padding: 0;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  border: none;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.approve-btn {
    background: $success-color;
  }

  &.reject-btn {
    background: $error-color;
  }

  &:active {
    transform: translateY(1rpx);
  }

  &.is-loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .loading-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 28rpx;
    height: 28rpx;
    margin: -14rpx 0 0 -14rpx;
    border: 2rpx solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: loading 0.8s infinite linear;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
