<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '账号审核进度',
  },
}
</route>

<template>
  <view class="accounts">
    <view class="account-card">
      <view class="card-header">
        <text class="title">审核进度</text>
        <text class="subtitle">共{{ reviewProgress.length }}个账号</text>
      </view>

      <view class="account-list">
        <view v-for="item in reviewProgress" :key="item.id" class="account-item">
          <view class="account-icon" :class="getPlatformClass(item.platform)">
            <text class="platform-text">{{ getPlatformText(item.platform) }}</text>
          </view>

          <view class="account-content">
            <view class="account-main">
              <view class="account-info">
                <text class="account-name">{{ item.accountName }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.status)">
                    {{ getStatusText(item.status) }}
                  </text>
                  <text class="tag review-tag" :class="getReviewClass(item.isReview)">
                    {{ item.isReview ? '已审核' : '待审核' }}
                  </text>
                </view>
              </view>
            </view>

            <view class="account-actions">
              <view class="account-details">
                <view class="detail-item">
                  <text class="detail-label">用户ID</text>
                  <text class="detail-value">{{ item.userId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">账号ID</text>
                  <text class="detail-value">{{ item.accountId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">提交时间</text>
                  <text class="detail-value">{{ formatDate(item.createTime) }}</text>
                </view>
                <view v-if="item.note" class="detail-item note-item">
                  <text class="detail-label">备注</text>
                  <text class="detail-value note-value">{{ item.note || '无' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="reviewProgress.length === 0" class="empty-state">
        <text class="empty-text">暂无审核记录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getAccountReviewProgress, type AccountReviewProgress } from '@/service/index/foo'

const reviewProgress = ref<AccountReviewProgress[]>([])

const getPlatformText = (platform: string) => {
  const map: Record<string, string> = {
    公众号: '公',
    视频号: '视',
    小程序: '程',
  }
  return map[platform] || '未'
}

const getPlatformClass = (platform: string) => {
  const map: Record<string, string> = {
    公众号: 'platform-mp',
    视频号: 'platform-video',
    小程序: 'platform-mini',
  }
  return map[platform] || 'platform-unknown'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    SUCCESS: '通过',
    FAIL: '未通过',
    PENDING: '待审核',
  }
  return map[status] || status
}

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    SUCCESS: 'status-success',
    FAIL: 'status-fail',
    PENDING: 'status-pending',
  }
  return map[status] || ''
}

const getReviewClass = (isReview: boolean) => {
  return isReview ? 'review-done' : 'review-pending'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const fetchData = async () => {
  try {
    const res = await getAccountReviewProgress()
    if (res.code === 1) {
      reviewProgress.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch review progress:', error)
    uni.showToast({
      title: '获取审核进度失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
// 使用与 accountchangetrack.vue 相同的样式基础
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

// Platform colors
$mp-color: #07c160;
$video-color: #fa2800;
$mini-color: #07c160;

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
    padding: $spacing-xl $spacing-xl * 1.25 $spacing-xl 160rpx;
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
  align-items: flex-start;
  justify-content: space-between;
}

.account-main {
  display: flex;
  flex: 1;
  min-width: 0;
  margin-right: $spacing-xl;
}

.account-icon {
  position: absolute;
  top: 50%;
  left: $spacing-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  margin-top: -48rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .platform-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }

  &.platform-mp {
    background-color: $mp-color;
    box-shadow: 0 4rpx 16rpx rgba($mp-color, 0.16);
  }

  &.platform-video {
    background-color: $video-color;
    box-shadow: 0 4rpx 16rpx rgba($video-color, 0.16);
  }

  &.platform-mini {
    background-color: $mini-color;
    box-shadow: 0 4rpx 16rpx rgba($mini-color, 0.16);
  }

  &.platform-unknown {
    background-color: $text-secondary;
    box-shadow: 0 4rpx 16rpx rgba($text-secondary, 0.16);
  }
}

.account-info {
  flex: 1;
  min-width: 0;

  .account-name {
    margin-bottom: $spacing-xs;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.4;
    color: $text-primary;
    letter-spacing: 0.5rpx;
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
  transition: all 0.2s ease;

  &.status-tag {
    &.status-success {
      color: $success-color;
      background: rgba($success-color, 0.08);
    }

    &.status-fail {
      color: $error-color;
      background: rgba($error-color, 0.08);
    }

    &.status-pending {
      color: $warning-color;
      background: rgba($warning-color, 0.08);
    }
  }

  &.review-tag {
    &.review-done {
      color: $success-color;
      background: rgba($success-color, 0.08);
    }

    &.review-pending {
      color: $warning-color;
      background: rgba($warning-color, 0.08);
    }
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
  justify-content: flex-end;

  .detail-label {
    font-size: 22rpx;
    color: $text-secondary;
  }

  .detail-value {
    font-size: 24rpx;
    color: $text-primary;
  }

  &.note-item {
    margin-top: $spacing-sm;

    .note-value {
      max-width: 300rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: $text-secondary;
  }
}
</style>
