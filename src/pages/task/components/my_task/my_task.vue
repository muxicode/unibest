<template>
  <view class="my-task">
    <view class="task-card">
      <view class="card-header">
        <text class="title">任务概览</text>
        <text class="subtitle" @click="handleViewDetail">整体详情</text>
      </view>

      <view class="task-overview">
        <view class="task-item" @click="handleWaitingTasks">
          <view class="count-wrapper">
            <wd-badge :model-value="waitingCount" :max="99" type="warning">
              <wd-icon
                name="list"
                size="96rpx"
                customStyle="background-image: -webkit-linear-gradient(90deg, #3498db 0%, #5dade2 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
              />
            </wd-badge>
          </view>
          <text class="label">待发布</text>
        </view>

        <view class="task-item" @click="handleCompletedTasks">
          <view class="count-wrapper">
            <wd-badge :model-value="completedCount" :max="99" type="success">
              <wd-icon
                name="check-bold"
                size="96rpx"
                customStyle="background-image: -webkit-linear-gradient(90deg, #2ecc71 0%, #58d68d 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
              />
            </wd-badge>
          </view>
          <text class="label">已完成</text>
        </view>

        <view class="task-item" @click="handleRejectedTasks">
          <view class="count-wrapper">
            <wd-badge :model-value="rejectedCount" :max="99" type="danger">
              <wd-icon
                name="close-bold"
                size="96rpx"
                customStyle="background-image: -webkit-linear-gradient(90deg, #e74c3c 0%, #ec7063 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
              />
            </wd-badge>
          </view>
          <text class="label">已拒绝</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface TaskCounts {
  waiting: number
  completed: number
  rejected: number
}

// 任务数量
const waitingCount = ref<number>(0)
const completedCount = ref<number>(0)
const rejectedCount = ref<number>(0)

// 跳转函数
const handleViewDetail = () => {
  uni.navigateTo({
    url: '/pages/task-detail/task-detail',
  })
}

const handleWaitingTasks = () => {
  uni.navigateTo({
    url: '/pages/unpublishtasks/unpublishtasks',
  })
}

const handleCompletedTasks = () => {
  uni.navigateTo({
    url: '/pages/completed-tasks/completed-tasks',
  })
}

const handleRejectedTasks = () => {
  uni.navigateTo({
    url: '/pages/rejected-tasks/rejected-tasks',
  })
}
</script>

<style lang="scss" scoped>
// 复用accounts组件的变量
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

// 图标背景色
$waiting-color: #3498db;
$completed-color: #2ecc71;
$rejected-color: #e74c3c;

.my-task {
  padding: $spacing-lg;
  background: $background-color;
}

.task-card {
  overflow: hidden;
  background: $card-background;
  border-radius: $border-radius;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xl;
  border-bottom: 2rpx solid $border-color;

  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: 0.5rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: $primary-color;
  }
}

.task-overview {
  display: flex;
  justify-content: space-around;
  padding: $spacing-xl;
}

.task-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;

  &:not(:last-child) {
    border-right: 2rpx solid $border-color;
  }
}

.count-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  margin-bottom: $spacing-md;
}

.label {
  margin-top: $spacing-md;
  font-size: 28rpx;
  color: $text-secondary;
}

:deep(.wd-badge) {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
}

:deep(.wd-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
