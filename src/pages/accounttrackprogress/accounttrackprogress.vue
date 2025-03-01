<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '赛道审核进度',
  },
}
</route>
<template>
  <view class="container">
    <view class="account-card">
      <view class="card-header">
        <text class="title">赛道审核进度</text>
        <text class="subtitle">共{{ trackList.length }}个记录</text>
      </view>

      <view class="content">
        <view v-if="loading" class="loading">
          <u-loading mode="circle" size="28"></u-loading>
        </view>

        <view v-else-if="trackList.length === 0" class="empty-state">
          <text class="empty-text">暂无审核记录</text>
        </view>

        <view v-else class="track-list">
          <view v-for="(item, index) in trackList" :key="index" class="track-item">
            <view class="track-icon" :class="getTrackIconClass(item.trackId)">
              <text class="track-icon-text">{{ getTrackIconText(item.trackId) }}</text>
            </view>

            <view class="track-content">
              <view class="track-main">
                <view class="track-info">
                  <text class="account-name">{{ item.accountName }}</text>
                  <view class="tag-group">
                    <text class="tag status-tag" :class="getStatusClass(item.status)">
                      {{ formatStatus(item.status) }}
                    </text>
                    <text
                      class="tag review-tag"
                      :class="item.isReview ? 'review-done' : 'review-pending'"
                    >
                      {{ item.isReview ? '已审核' : '待审核' }}
                    </text>
                  </view>
                </view>
              </view>

              <view class="track-details">
                <view class="detail-item">
                  <text class="detail-label">用户ID</text>
                  <text class="detail-value">{{ item.userId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">账号ID</text>
                  <text class="detail-value">{{ item.accountId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">原赛道</text>
                  <text class="detail-value">{{ formatTrackName(item.oldTrackId) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">新赛道</text>
                  <text class="detail-value">{{ formatTrackName(item.trackId) }}</text>
                </view>
                <view class="detail-item" v-if="item.reviewer">
                  <text class="detail-label">审核人</text>
                  <text class="detail-value">{{ item.reviewer }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">申请时间</text>
                  <text class="detail-value">{{ formatDate(item.createTime) }}</text>
                </view>
                <view v-if="item.note" class="detail-item note-item">
                  <text class="detail-label">备注</text>
                  <text class="detail-value note-value">{{ item.note }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAccountTrackReviewSheet } from '@/service/index/foo'

export default {
  data() {
    return {
      loading: true,
      trackList: [],
    }
  },
  onLoad() {
    this.getTrackReviewData()
  },
  methods: {
    async getTrackReviewData() {
      this.loading = true
      try {
        const res = await getAccountTrackReviewSheet()
        if (res.code === 1) {
          this.trackList = res.data || []
        } else {
          uni.showToast({
            title: res.msg || '获取数据失败',
            icon: 'none',
          })
        }
      } catch (error) {
        console.error('获取赛道审核进度失败', error)
        uni.showToast({
          title: '获取数据失败，请稍后重试',
          icon: 'none',
        })
      } finally {
        this.loading = false
      }
    },
    formatStatus(status) {
      const statusMap = {
        UN_REVIEW: '待审核',
        REVIEWING: '审核中',
        PASS: '已通过',
        REJECT: '已拒绝',
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        UN_REVIEW: 'status-pending',
        REVIEWING: 'status-pending',
        PASS: 'status-success',
        REJECT: 'status-fail',
      }
      return classMap[status] || ''
    },
    formatTrackName(trackId) {
      const trackMap = {
        EMOTIONAL_STORY: '情感故事',
        CAR_INFORMATION: '汽车资讯',
        WORKPLACE: '职场共鸣',
        NEW_ACCOUNT: '新号起号',
        IT_DB: 'IT数据库',
        IT_AI: 'AI赛道',
        WORK_IP: '爆文IP',
        NEW_ACCOUNT_ELE: '新号起号电工',
        MEMORIES: '往事回忆(不可选)',
        EXCEL: '职场技能',
        PET: '可爱萌宠(小绿书)',
      }
      return trackMap[trackId] || trackId
    },
    getTrackIconClass(trackId) {
      const classMap = {
        EMOTIONAL_STORY: 'track-emotional',
        CAR_INFORMATION: 'track-car',
        WORKPLACE: 'track-workplace',
        NEW_ACCOUNT: 'track-new',
        IT_DB: 'track-it',
        IT_AI: 'track-ai',
        WORK_IP: 'track-ip',
        NEW_ACCOUNT_ELE: 'track-ele',
        MEMORIES: 'track-memories',
        EXCEL: 'track-excel',
        PET: 'track-pet',
      }
      return classMap[trackId] || 'track-default'
    },
    getTrackIconText(trackId) {
      const textMap = {
        EMOTIONAL_STORY: '情',
        CAR_INFORMATION: '车',
        WORKPLACE: '职',
        NEW_ACCOUNT: '新',
        IT_DB: 'IT',
        IT_AI: 'AI',
        WORK_IP: 'IP',
        NEW_ACCOUNT_ELE: '电',
        MEMORIES: '忆',
        EXCEL: '技',
        PET: '宠',
      }
      return textMap[trackId] || '未'
    },
    formatDate(dateStr) {
      if (!dateStr) return '未知'
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    },
  },
}
</script>

<style lang="scss" scoped>
// 使用与 accountprogress.vue 相同的样式基础
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

// Track colors
$track-emotional: #ff9c6e;
$track-car: #597ef7;
$track-workplace: #73d13d;
$track-new: #ffa940;
$track-it: #36cfc9;
$track-ai: #9254de;
$track-ip: #f759ab;
$track-ele: #faad14;
$track-memories: #bfbfbf;
$track-excel: #52c41a;
$track-pet: #ff7875;
$track-default: #8c8c8c;

.container {
  min-height: 100vh;
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

.content {
  padding: 0;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200rpx;
}

.track-list {
  .track-item {
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

.track-icon {
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

  .track-icon-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }

  &.track-emotional {
    background-color: $track-emotional;
    box-shadow: 0 4rpx 16rpx rgba($track-emotional, 0.16);
  }

  &.track-car {
    background-color: $track-car;
    box-shadow: 0 4rpx 16rpx rgba($track-car, 0.16);
  }

  &.track-workplace {
    background-color: $track-workplace;
    box-shadow: 0 4rpx 16rpx rgba($track-workplace, 0.16);
  }

  &.track-new {
    background-color: $track-new;
    box-shadow: 0 4rpx 16rpx rgba($track-new, 0.16);
  }

  &.track-it {
    background-color: $track-it;
    box-shadow: 0 4rpx 16rpx rgba($track-it, 0.16);
  }

  &.track-ai {
    background-color: $track-ai;
    box-shadow: 0 4rpx 16rpx rgba($track-ai, 0.16);
  }

  &.track-ip {
    background-color: $track-ip;
    box-shadow: 0 4rpx 16rpx rgba($track-ip, 0.16);
  }

  &.track-ele {
    background-color: $track-ele;
    box-shadow: 0 4rpx 16rpx rgba($track-ele, 0.16);
  }

  &.track-memories {
    background-color: $track-memories;
    box-shadow: 0 4rpx 16rpx rgba($track-memories, 0.16);
  }

  &.track-excel {
    background-color: $track-excel;
    box-shadow: 0 4rpx 16rpx rgba($track-excel, 0.16);
  }

  &.track-pet {
    background-color: $track-pet;
    box-shadow: 0 4rpx 16rpx rgba($track-pet, 0.16);
  }

  &.track-default {
    background-color: $track-default;
    box-shadow: 0 4rpx 16rpx rgba($track-default, 0.16);
  }
}

.track-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.track-main {
  display: flex;
  flex: 1;
  min-width: 0;
}

.track-info {
  flex: 1;
  min-width: 0;

  .account-name {
    display: block;
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

.track-details {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs $spacing-xl;
}

.detail-item {
  display: flex;
  gap: $spacing-sm;
  align-items: center;

  .detail-label {
    font-size: 22rpx;
    color: $text-secondary;
  }

  .detail-value {
    font-size: 24rpx;
    color: $text-primary;
  }

  &.note-item {
    width: 100%;
    margin-top: $spacing-sm;

    .note-value {
      flex: 1;
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
