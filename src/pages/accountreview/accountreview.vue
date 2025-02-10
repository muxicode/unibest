<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '账号审核',
  },
}
</route>
<template>
  <view class="accounts">
    <!-- 图片预览组件 -->
    <view v-if="previewVisible" class="preview-overlay" @click="closePreview">
      <view class="preview-content" @click.stop>
        <view class="preview-header">
          <wd-icon name="close" class="close-icon" @click="closePreview"></wd-icon>
        </view>
        <image class="preview-image" :src="currentPreviewImage" mode="widthFix" />
      </view>
    </view>

    <view class="account-card">
      <view class="card-header">
        <text class="title">账号审核</text>
        <text class="subtitle">待审核{{ reviewSheets.length }}个账号</text>
      </view>

      <view class="account-list">
        <view v-for="item in reviewSheets" :key="item.id" class="account-item">
          <view class="account-icon" :class="getPlatformClass(item.platform)">
            <text class="platform-text">{{ getPlatformText(item.platform) }}</text>
          </view>

          <view class="account-content">
            <view class="account-main">
              <view class="account-info">
                <text class="account-name">{{ item.accountName }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.status)">
                    {{ STATUS_TEXT_MAP[item.status] }}
                  </text>
                  <text class="tag track-tag">{{ TRACK_NAME_MAP[item.trackId] }}</text>
                </view>
              </view>
            </view>

            <view class="account-actions">
              <view class="account-details">
                <view v-if="item.img" class="detail-item">
                  <text class="detail-label">账号截图</text>
                  <view class="account-image" @click="previewImage(item.img)">
                    <image class="thumbnail" :src="item.img" mode="aspectFit" />
                  </view>
                </view>
                <view class="detail-item">
                  <text class="detail-label">账号ID</text>
                  <text class="detail-value">{{ item.accountId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">手机号</text>
                  <text class="detail-value">{{ item.phone }}</text>
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
  getAccountReviewSheets,
  reviewAccount,
  type AccountReviewSheet,
  type AccountReviewParams,
} from '@/service/index/foo'

const STATUS_TEXT_MAP: Record<string, string> = {
  NORMAL: '正常',
  BLOCKED: '已封禁',
  REVIEWING: '审核中',
}

const STATUS_CLASS_MAP: Record<string, string> = {
  NORMAL: 'status-normal',
  BLOCKED: 'status-blocked',
  REVIEWING: 'status-reviewing',
}

const TRACK_NAME_MAP: Record<string, string> = {
  EMOTIONAL_STORY: '情感故事',
  CAR_INFORMATION: '汽车资讯',
  WORKPLACE: '职场经验',
  IT_DB: '数据库技术',
  IT_AI: 'AI技术',
  NEW_ACCOUNT: '新号起号赛道',
  WORK_IP: '爆文IP赛道',
}

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

const getStatusClass = (status: string) => STATUS_CLASS_MAP[status] || ''

const reviewSheets = ref<AccountReviewSheet[]>([])
const loadingMap = ref<Record<string, boolean>>({})

// 图片预览状态
const previewVisible = ref(false)
const currentPreviewImage = ref('')

// 预览图片
const previewImage = (imgUrl: string) => {
  currentPreviewImage.value = imgUrl
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  currentPreviewImage.value = ''
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const fetchReviewSheets = async () => {
  try {
    const res = await getAccountReviewSheets()
    if (res.code === 1) {
      reviewSheets.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch review sheets:', error)
    uni.showToast({
      title: '获取审核列表失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

const handleAction = async (
  item: AccountReviewSheet,
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

const handleApprove = async (item: AccountReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params: AccountReviewParams = {
        id: item.id,
        status: 'SUCCESS',
        note: '审核通过',
      }
      const res = await reviewAccount(params)
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

const handleReject = async (item: AccountReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params: AccountReviewParams = {
        id: item.id,
        status: 'FAIL',
        note: '审核不通过',
      }
      const res = await reviewAccount(params)
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

onMounted(() => {
  fetchReviewSheets()
})
</script>

<style lang="scss" scoped>
// Reuse variables from accounts.vue
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

// Inherit base styles from accounts.vue
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

.account-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  align-items: flex-end;
  min-width: 300rpx;
}

.action-group {
  display: flex;
  gap: $spacing-sm;
}

.action-btn {
  position: relative;
  width: 140rpx;
  height: 64rpx;
  padding: 0;
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  background: $primary-color;
  border: none;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba($primary-color, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  text {
    display: block;
    width: 100%;
    line-height: 64rpx;
    text-align: center;
    transition: opacity 0.2s ease;
  }

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($primary-color, 0.15);
    transform: translateY(1rpx);
  }

  &.is-loading {
    pointer-events: none;

    text {
      opacity: 0;
    }

    .loading-icon {
      opacity: 1;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background: rgba($primary-color, 0.6);
    box-shadow: none;
  }
}

.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32rpx;
  height: 32rpx;
  margin: -16rpx 0 0 -16rpx;
  border: 3rpx solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
  animation: loading 0.8s infinite linear;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Additional styles for review page
.account-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
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
}

.approve-btn {
  background: $success-color;
  box-shadow: 0 2rpx 8rpx rgba($success-color, 0.2);

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($success-color, 0.15);
  }

  &:disabled {
    background: rgba($success-color, 0.6);
  }
}

.reject-btn {
  background: $error-color;
  box-shadow: 0 2rpx 8rpx rgba($error-color, 0.2);

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($error-color, 0.15);
  }

  &:disabled {
    background: rgba($error-color, 0.6);
  }
}

// 图片相关样式
.account-image {
  position: relative;
  width: 160rpx;
  height: 120rpx;
  margin-left: $spacing-sm;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
  border-radius: $spacing-xs;

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// 预览遮罩层
.preview-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);

  .preview-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    background: #ffffff;
    border-radius: 12rpx;
  }

  .preview-header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
    padding: 24rpx;
    text-align: right;
    background: rgba(248, 248, 248, 0.95);

    .close-icon {
      font-size: 40rpx;
      color: #666;
    }
  }

  .preview-image {
    width: 100%;
    height: auto;
    max-height: calc(90vh - 88rpx);
    margin-top: 88rpx;
    overflow-y: auto;
  }
}
</style>
