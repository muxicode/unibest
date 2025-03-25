<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '结算单进度',
  },
}
</route>

<template>
  <view class="container">
    <view class="account-card">
      <view class="card-header">
        <text class="title">结算单进度</text>
        <text class="subtitle">共{{ settlementList.length }}个记录</text>
      </view>

      <view class="content">
        <view v-if="loading" class="loading">
          <u-loading mode="circle" size="28"></u-loading>
        </view>

        <view v-else-if="settlementList.length === 0" class="empty-state">
          <text class="empty-text">暂无结算记录</text>
        </view>

        <view v-else class="track-list">
          <view v-for="(item, index) in settlementList" :key="index" class="track-item">
            <view class="track-icon" :class="getPlatformIconClass(item.platForm)">
              <text class="track-icon-text">{{ getPlatformIconText(item.platForm) }}</text>
            </view>

            <view class="track-content">
              <view class="track-main">
                <view class="track-info">
                  <text class="account-name">{{ item.accountName }}</text>
                  <view class="tag-group">
                    <text class="tag status-tag" :class="getStatusClass(item.settlementStatus)">
                      {{ formatStatus(item.settlementStatus) }}
                    </text>
                    <text class="tag review-tag" :class="getReviewStatusClass(item.reviewStatus)">
                      {{ formatReviewStatus(item.reviewStatus) }}
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
                  <text class="detail-label">结算期数</text>
                  <text class="detail-value">{{ item.settlementPart }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">平台</text>
                  <text class="detail-value">{{ item.platForm }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">收入金额</text>
                  <text class="detail-value">¥{{ item.income }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">分成比例</text>
                  <text class="detail-value">{{ (item.proportion * 100).toFixed(0) }}%</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">支付金额</text>
                  <text class="detail-value">¥{{ item.payment }}</text>
                </view>
                <view class="detail-item" v-if="item.settlementType">
                  <text class="detail-label">支付方式</text>
                  <text class="detail-value">{{ item.settlementType }}</text>
                </view>
                <view class="detail-item" v-if="item.transferOrder">
                  <text class="detail-label">转账单号</text>
                  <text class="detail-value">{{ item.transferOrder }}</text>
                </view>
                <view class="detail-item" v-if="item.commitTime">
                  <text class="detail-label">提交时间</text>
                  <text class="detail-value">{{ formatDate(item.commitTime) }}</text>
                </view>
                <view v-if="item.suggestion" class="detail-item note-item">
                  <text class="detail-label">审核建议</text>
                  <text class="detail-value note-value">{{ item.suggestion }}</text>
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
import { getUserSettlements } from '@/service/index/foo'

export default {
  data() {
    return {
      loading: true,
      settlementList: [],
    }
  },
  onLoad() {
    this.getSettlementData()
  },
  methods: {
    async getSettlementData() {
      this.loading = true
      try {
        const res = await getUserSettlements()
        if (res.code === 1) {
          this.settlementList = res.data || []
        } else {
          uni.showToast({
            title: res.msg || '获取数据失败',
            icon: 'none',
          })
        }
      } catch (error) {
        console.error('获取结算进度失败', error)
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
        INIT: '待提交',
        COMMIT: '已提交',
        FINISH: '已完成',
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        INIT: 'status-pending',
        COMMIT: 'status-pending',
        FINISH: 'status-success',
      }
      return classMap[status] || ''
    },
    formatReviewStatus(status) {
      const statusMap = {
        NO_REVIEW: '待评审',
        FAIL: '评审失败',
        SUCCESS: '评审通过',
      }
      return statusMap[status] || status
    },
    getReviewStatusClass(status) {
      const classMap = {
        NO_REVIEW: 'review-pending',
        FAIL: 'status-fail',
        SUCCESS: 'review-done',
      }
      return classMap[status] || ''
    },
    getPlatformIconClass(platform) {
      const classMap = {
        公众号: 'track-workplace',
        小红书: 'track-ip',
        抖音: 'track-new',
      }
      return classMap[platform] || 'track-default'
    },
    getPlatformIconText(platform) {
      const textMap = {
        公众号: '众',
        小红书: '红',
        抖音: '抖',
      }
      return textMap[platform] || platform.slice(0, 1)
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
// 复用 accounttrackprogress.vue 的样式
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
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-top: $spacing-sm;

    .note-value {
      flex: 1;
      width: 100%;
      margin-top: $spacing-xs;
      line-height: 1.4;
      word-break: break-word;
      white-space: normal;
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
