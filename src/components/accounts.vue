<template>
  <view class="accounts">
    <view class="account-card">
      <view class="card-header">
        <text class="title">账号列表</text>
        <text class="subtitle">我的{{ filteredAccounts.length }}个账号</text>
      </view>

      <view class="account-list">
        <view v-for="item in filteredAccounts" :key="item.accountId" class="account-item">
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
                  <text class="tag level-tag">Level {{ item.level }}</text>
                  <text class="tag track-tag">{{ TRACK_NAME_MAP[item.trackId] }}</text>
                </view>
              </view>
            </view>

            <view class="account-actions">
              <view class="download-info">
                <text class="download-label">可下载文章</text>
                <text class="download-value">{{ item.downLoadNum }}</text>
              </view>

              <view class="action-group">
                <template v-for="actionType in modeList" :key="actionType">
                  <button
                    v-if="actionType === 'article'"
                    class="action-btn"
                    :class="{ 'is-loading': loadingMap[`${item.accountId}-article`] }"
                    :disabled="loadingMap[`${item.accountId}-article`]"
                    @click="handleReceiveArticle(item)"
                  >
                    <text>领取文章</text>
                    <view
                      v-if="loadingMap[`${item.accountId}-article`]"
                      class="loading-icon"
                    ></view>
                  </button>

                  <button
                    v-if="actionType === 'report'"
                    class="action-btn"
                    :class="{ 'is-loading': loadingMap[`${item.accountId}-report`] }"
                    :disabled="loadingMap[`${item.accountId}-report`]"
                    @click="handleDailyReport(item)"
                  >
                    <text>每日上报</text>
                    <view v-if="loadingMap[`${item.accountId}-report`]" class="loading-icon"></view>
                  </button>

                  <button
                    v-if="actionType === 'settlement'"
                    class="action-btn"
                    :class="{ 'is-loading': loadingMap[`${item.accountId}-settlement`] }"
                    :disabled="loadingMap[`${item.accountId}-settlement`]"
                    @click="handleSettlement(item)"
                  >
                    <text>
                      {{ item.settlementStatu.isStart ? '已开始结算' : '开始结算' }}
                    </text>
                    <view
                      v-if="loadingMap[`${item.accountId}-settlement`]"
                      class="loading-icon"
                    ></view>
                  </button>
                </template>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { getAccounts } from '@/service/index/foo'

interface SettlementStatus {
  isUsePublicAccount: boolean
  isStart: boolean
  lastSettlementDate: string
  lastSettlePart: string
  msg: string
}

interface AccountItem {
  userId: string
  trackId: string
  platform: string
  phone: string
  accountName: string
  accountId: string
  accountCreateDate: string
  level: number
  downLoadNum: number
  accountStatu: string
  openingFlowDate: string
  isOpenFlow: boolean
  isNeedOpenFlow: boolean
  settlementStatu: SettlementStatus
  lastReportDate?: string
}

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
  WORKPLACE: '职场',
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

const props = defineProps<{
  mode: string
  filterTrackId?: string
}>()

const accountList = ref<AccountItem[]>([])
const loadingMap = ref<Record<string, boolean>>({})

const modeList = computed(() => props.mode.split(',').map((m) => m.trim()))

const filteredAccounts = computed(() =>
  props.filterTrackId
    ? accountList.value.filter((account) => account.trackId === props.filterTrackId)
    : accountList.value,
)

const getStatusClass = (status: string) => STATUS_CLASS_MAP[status] || ''

const fetchAccounts = async () => {
  try {
    const res = await getAccounts()
    if (res.code === 1) {
      accountList.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch accounts:', error)
    uni.showToast({
      title: '获取账号列表失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

const handleAction = async (account: AccountItem, action: () => Promise<void>, type: string) => {
  const loadingKey = `${account.accountId}-${type}`
  if (loadingMap.value[loadingKey]) return

  loadingMap.value[loadingKey] = true
  try {
    await action()
  } finally {
    loadingMap.value[loadingKey] = false
  }
}

const handleReceiveArticle = (account: AccountItem) => {
  handleAction(
    account,
    () =>
      uni.navigateTo({
        url: `/pages/articles/articles?accountId=${account.accountId}`,
      }),
    'article',
  )
}

const handleDailyReport = (account: AccountItem) => {
  handleAction(
    account,
    () =>
      uni.navigateTo({
        url: `/pages/upload/upload?accountId=${account.accountId}`,
      }),
    'report',
  )
}

const handleSettlement = (account: AccountItem) => {
  handleAction(
    account,
    () =>
      uni.navigateTo({
        url: `/pages/settlements/settlements?accountId=${account.accountId}`,
      }),
    'settlement',
  )
}

onMounted(() => {
  fetchAccounts()
})
</script>

<style lang="scss" scoped>
// Variables
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
$spacing-xl: 32rpx; // 增加基础间距
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
    padding: $spacing-xl $spacing-xl * 1.25 $spacing-xl 160rpx; // 增加左右间距
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
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 降低阴影透明度

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
  gap: $spacing-sm; // 增加标签间距
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

  &.level-tag {
    color: #8b5cf6;
    background: rgba(#8b5cf6, 0.08);
  }

  &.track-tag {
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg; // 增加垂直间距
  align-items: flex-end;
}

.download-info {
  text-align: right;

  .download-label {
    display: block;
    margin-bottom: 2rpx;
    font-size: 22rpx;
    color: $text-secondary;
  }

  .download-value {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    line-height: 1.2;
    color: $primary-color;
  }
}

.action-group {
  display: flex;
  gap: $spacing-sm;
}

.action-btn {
  position: relative;
  width: 140rpx; // 固定按钮宽度
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
</style>
