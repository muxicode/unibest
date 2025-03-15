<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '文章统计',
  },
}
</route>

<template>
  <view class="article-stats">
    <view class="stats-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">赛道文章统计</text>
        <text class="section-subtitle">共{{ tracks.length }}个赛道</text>
      </view>

      <!-- 加载错误提示 -->
      <view v-if="error" class="error-tip">
        <wd-icon name="warn-bold" size="48px" color="#F56C6C" />
        <text class="error-text">加载失败,请重试</text>
        <wd-button size="small" class="retry-btn" @click="loadStats">重新加载</wd-button>
      </view>

      <!-- 统计列表 -->
      <view v-else class="stats-list">
        <view v-for="track in tracks" :key="track.trackId" class="track-item">
          <view class="track-header">
            <text class="track-name">{{ track.trackName }}</text>
            <text class="track-desc">{{ track.description }}</text>
          </view>

          <view class="stats-info">
            <view class="stats-row">
              <text class="label">账户数量:</text>
              <text class="value">{{ track.articleStats.accountCount }}</text>
            </view>
            <view class="stats-row">
              <text class="label">每日所需文章:</text>
              <text class="value">{{ track.articleStats.articlesPerDay }}</text>
            </view>
            <view class="stats-row">
              <text class="label">当前剩余文章:</text>
              <text class="value">{{ track.num }}</text>
            </view>
            <view class="stats-row highlight" v-if="track.articleStats.additionalArticleCount > 0">
              <text class="label">需要补充文章:</text>
              <text class="value accent">{{ track.articleStats.additionalArticleCount }}</text>
            </view>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="tracks.length === 0 && !loading" class="empty-tip">
          <view class="empty-icon">
            <wd-icon name="warn-bold" size="48px" color="#909399" />
          </view>
          <text class="empty-text">暂无统计数据</text>
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
import { getTrackArticleStats } from '@/service/index/foo'
import type { TrackArticleStats } from '@/service/index/foo'

const toast = useToast()
const tracks = ref<TrackArticleStats[]>([])
const loading = ref(false)
const error = ref(false)

onMounted(() => {
  loadStats()
})

const loadStats = async () => {
  loading.value = true
  error.value = false

  try {
    const res = await getTrackArticleStats()
    if (res.code === 1) {
      tracks.value = res.data || []
    } else {
      toast.error(res.msg || '加载失败')
    }
  } catch (err) {
    console.error('加载文章统计失败:', err)
    error.value = true
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
$primary-color: #1989fa;
$success-color: #07c160;
$warning-color: #faad14;
$error-color: #ff4d4f;
$text-primary: #333333;
$text-secondary: #666666;
$text-tertiary: #999999;
$border-color: #f0f0f0;
$background-color: #f5f5f5;
$card-background: #ffffff;
$spacing-base: 24rpx;
$border-radius: 20rpx;

.article-stats {
  min-height: 100vh;
  padding: $spacing-base;
  background: $background-color;
}

.stats-card {
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

.error-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;

  .error-text {
    margin: 20rpx 0;
    font-size: 28rpx;
    color: $error-color;
  }

  .retry-btn {
    min-width: 160rpx;
  }
}

.stats-list {
  .track-item {
    padding: 24rpx;
    margin-bottom: 24rpx;
    background: #f8f9fa;
    border-radius: 12rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.track-header {
  margin-bottom: 16rpx;

  .track-name {
    display: block;
    margin-bottom: 8rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }

  .track-desc {
    font-size: 26rpx;
    color: $text-tertiary;
  }
}

.stats-info {
  .stats-row {
    display: flex;
    justify-content: space-between;
    padding: 12rpx 0;
    font-size: 28rpx;

    .label {
      color: $text-secondary;
    }

    .value {
      font-weight: 500;
      color: $text-primary;
    }

    &.highlight {
      padding-top: 16rpx;
      margin-top: 8rpx;
      border-top: 2rpx solid $border-color;

      .value.accent {
        font-weight: bold;
        color: $error-color;
      }
    }
  }
}

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
