<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '已拒绝任务',
  },
}
</route>

<template>
  <view class="rejection-tasks">
    <view class="tasks-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">已拒绝任务</text>
        <text class="section-subtitle">共{{ tasks.length }}个任务</text>
      </view>

      <!-- 加载错误提示 -->
      <view v-if="error" class="error-tip">
        <wd-icon name="warn-bold" size="48px" color="#F56C6C" />
        <text class="error-text">加载失败,请重试</text>
        <wd-button size="small" class="retry-btn" @click="loadTasks">重新加载</wd-button>
      </view>

      <!-- 任务列表 -->
      <view v-else class="tasks-list">
        <view v-for="item in tasks" :key="item.id" class="task-item">
          <!-- 任务内容区 -->
          <view class="task-content">
            <text class="task-title">{{ item.title }}</text>
            <view class="task-info">
              <text class="account-name">账号: {{ item.accountName }}</text>
              <text class="platform">平台: {{ item.platform }}</text>
              <text class="reject-time">拒绝时间: {{ item.tm }}</text>
            </view>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="tasks.length === 0 && !loading" class="empty-tip">
          <view class="empty-icon">
            <wd-icon name="warn-bold" size="48px" color="#909399" />
          </view>
          <text class="empty-text">暂无已拒绝任务</text>
        </view>
      </view>
    </view>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'
import { getRejectionTasks } from '@/service/index/foo'
import type { RejectionTask } from '@/service/index/foo'

// 组件状态
const toast = useToast()
const tasks = ref<RejectionTask[]>([])
const loading = ref(false)
const error = ref(false)

// 页面加载
onMounted(() => {
  loadTasks()
})

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  error.value = false

  try {
    const res = await getRejectionTasks()
    if (res.code === 1) {
      tasks.value = res.data || []
    } else {
      toast.error(res.msg || '加载失败')
    }
  } catch (err) {
    console.error('加载已拒绝任务列表失败:', err)
    error.value = true
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
// 变量定义
$primary-color: #1989fa;
$text-primary: #333333;
$text-secondary: #666666;
$text-tertiary: #999999;
$border-color: #f0f0f0;
$background-color: #f5f5f5;
$card-background: #ffffff;
$spacing-base: 24rpx;
$border-radius: 20rpx;

.rejection-tasks {
  min-height: 100vh;
  padding: $spacing-base;
  background: $background-color;
}

.tasks-card {
  padding: $spacing-base;
  background: $card-background;
  border-radius: $border-radius;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 0 12rpx;
  margin-bottom: 32rpx;
}

.section-title {
  margin-right: 16rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}

.section-subtitle {
  font-size: 26rpx;
  color: $text-tertiary;
}

// 错误提示
.error-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;

  .error-text {
    margin: 20rpx 0;
    font-size: 28rpx;
    color: #f56c6c;
  }

  .retry-btn {
    min-width: 160rpx;
  }
}

// 任务列表
.tasks-list {
  .task-item {
    position: relative;
    padding: 24rpx 28rpx;
    background: $card-background;
    border-bottom: 2rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }
}

.task-content {
  width: 100%;
}

.task-title {
  display: block;
  margin-bottom: 12rpx;
  overflow: hidden;
  font-size: 32rpx;
  line-height: 1.5;
  color: $text-primary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  font-size: 28rpx;
  color: $text-secondary;

  .account-name,
  .platform,
  .reject-time {
    color: $text-secondary;
  }
}

// 空数据提示
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;

  .empty-icon {
    margin-bottom: 16rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: $text-tertiary;
  }
}
</style>
