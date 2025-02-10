<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '账号赛道管理',
  },
}
</route>

<template>
  <view class="accounts">
    <view class="account-card">
      <view class="card-header">
        <text class="title">赛道管理</text>
        <text class="subtitle">共{{ accounts.length }}个账号</text>
      </view>

      <view class="account-list">
        <view v-for="item in accounts" :key="item.accountId" class="account-item">
          <view class="account-icon" :class="getPlatformClass(item.platform)">
            <text class="platform-text">{{ getPlatformText(item.platform) }}</text>
          </view>

          <view class="account-content">
            <view class="account-main">
              <view class="account-info">
                <text class="account-name">{{ item.accountName }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.accountStatu)">
                    {{ STATUS_TEXT_MAP[item.accountStatu] }}
                  </text>
                  <text class="tag track-tag">{{ getTrackName(item.trackId) }}</text>
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
                  <text class="detail-label">手机号</text>
                  <text class="detail-value">{{ item.phone }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">创建时间</text>
                  <text class="detail-value">{{ formatDate(item.accountCreateDate) }}</text>
                </view>
                <view class="detail-item track-selector">
                  <text class="detail-label">选择赛道</text>
                  <picker
                    :value="getTrackIndex(item.trackId)"
                    :range="trackNames"
                    @change="(e) => handleTrackChange(e, item)"
                  >
                    <view class="picker-value">
                      {{ getTrackName(item.trackId) }}
                      <wd-icon name="arrow-down" class="picker-arrow"></wd-icon>
                    </view>
                  </picker>
                </view>
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
  getAccounts,
  getTracks,
  updateAccountTrack,
  type AccountInfo,
  type TracksInfo,
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

const accounts = ref<AccountInfo[]>([])
const tracks = ref<TracksInfo[]>([])
const trackNames = ref<string[]>([])

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const getTrackName = (trackId: string) => {
  const track = tracks.value.find((t) => t.trackId === trackId)
  return track ? track.trackName : '未知赛道'
}

const getTrackIndex = (trackId: string) => {
  return tracks.value.findIndex((t) => t.trackId === trackId)
}

const handleTrackChange = async (e: any, account: AccountInfo) => {
  const index = e.detail.value
  const newTrackId = tracks.value[index].trackId

  if (newTrackId === account.trackId) return

  try {
    await updateAccountTrack({
      accountId: account.accountId,
      trackId: newTrackId,
    })

    uni.showToast({
      title: '已提交审核请求',
      icon: 'success',
      duration: 2000,
    })

    // 重新加载账号列表，确保显示原赛道
    const accountsRes = await getAccounts()
    if (accountsRes.code === 1) {
      accounts.value = accountsRes.data
    }
  } catch (error) {
    console.error('Failed to update track:', error)
    uni.showToast({
      title: '提交请求失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

const fetchData = async () => {
  try {
    const [accountsRes, tracksRes] = await Promise.all([getAccounts(), getTracks()])

    if (accountsRes.code === 1) {
      accounts.value = accountsRes.data
    }

    if (tracksRes.code === 1) {
      tracks.value = tracksRes.data
      trackNames.value = tracksRes.data.map((t) => t.trackName)
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
// Inherit base styles from accountreview.vue
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
  justify-content: flex-end;

  .detail-label {
    font-size: 22rpx;
    color: $text-secondary;
  }

  .detail-value {
    font-size: 24rpx;
    color: $text-primary;
  }

  &.track-selector {
    margin-top: $spacing-sm;

    .picker-value {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      font-size: 24rpx;
      color: $primary-color;
      background: rgba($primary-color, 0.08);
      border-radius: 6rpx;

      .picker-arrow {
        margin-left: 8rpx;
        font-size: 24rpx;
      }
    }
  }
}
</style>
