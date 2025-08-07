<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '任务审核',
  },
}
</route>

<template>
  <view class="accounts">
    <view class="account-card">
      <view class="card-header">
        <text class="title">任务审核</text>
        <text class="subtitle">待审核 {{ reviewSheets.length }} 个申请</text>
      </view>

      <view class="account-list">
        <view v-for="item in reviewSheets" :key="item.id" class="account-item">
          <view class="account-content">
            <view class="account-main">
              <view class="account-info">
                <text class="account-name">{{ item.title }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.status)">
                    {{ STATUS_TEXT_MAP[item.status] }}
                  </text>
                  <text class="tag platform-tag">{{ item.platform }}</text>
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
                  <text class="detail-label">用户ID</text>
                  <text class="detail-value">{{ item.userId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">账号名称</text>
                  <text class="detail-value">{{ item.accountName }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">下载时间</text>
                  <text class="detail-value">{{ formatDate(item.articleDownloadTime) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">拒绝原因</text>
                  <text class="detail-value highlight">{{ item.reason }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">提交时间</text>
                  <text class="detail-value">{{ formatDate(item.createTime) }}</text>
                </view>
              </view>

              <view class="action-group">
                <button class="action-btn view-btn" @click="handleViewArticle(item)">
                  <text>查看原文</text>
                </button>
                <button
                  class="action-btn download-btn"
                  :class="{ 'is-loading': downloading === item.id }"
                  :disabled="downloading === item.id"
                  @click="handleDownloadArticle(item)"
                >
                  <text v-if="downloading === item.id">下载中...</text>
                  <text v-else>下载</text>
                </button>
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

    <!-- 下载成功弹窗 -->
    <wd-popup
      v-model="showSharePopup"
      custom-style="padding: 30px 40px; border-radius: 16px;"
      @close="handleClose"
    >
      <view class="share-popup">
        <view class="share-title">下载成功</view>
        <view class="share-content">
          <text>文件已下载成功,是否立即分享到微信?</text>
        </view>
        <view class="share-footer">
          <button class="share-btn cancel-btn" @click="handleClose">取消</button>
          <button class="share-btn confirm-btn" @click="shareFile">立即分享</button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  getTaskReviewSheets,
  reviewTask,
  getArticleDetail,
  type TaskReviewSheet,
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

const reviewSheets = ref<TaskReviewSheet[]>([])
const loadingMap = ref<Record<string, boolean>>({})

// 下载相关状态
const downloading = ref('') // 记录正在下载的文章ID
const showSharePopup = ref(false)
const downloadFilePath = ref('')

const getStatusClass = (status: string) => STATUS_CLASS_MAP[status] || ''

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const handleAction = async (
  item: TaskReviewSheet,
  action: () => Promise<void>,
  type: 'approve' | 'reject',
) => {
  const loadingKey = `${item.id}-${type}`
  if (loadingMap.value[loadingKey]) return

  loadingMap.value[loadingKey] = true
  try {
    await action()
    // Remove reviewed item from list
    reviewSheets.value = reviewSheets.value.filter((sheet) => sheet.id !== item.id)
  } finally {
    loadingMap.value[loadingKey] = false
  }
}

const handleApprove = async (item: TaskReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params = {
        id: item.id,
        status: 'SUCCESS' as const,
      }
      const res = await reviewTask(params)
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

const handleReject = async (item: TaskReviewSheet) => {
  handleAction(
    item,
    async () => {
      const params = {
        id: item.id,
        status: 'FAIL' as const,
        note: '审核不通过',
      }
      const res = await reviewTask(params)
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

// 查看原文
const handleViewArticle = async (item: TaskReviewSheet) => {
  try {
    const res = await getArticleDetail(item.articleId)
    if (res.code === 1) {
      // 跳转到文章展示页面
      uni.navigateTo({
        url: `/pages/articleFormat/articleFormat?title=${encodeURIComponent(res.data.title)}&content=${encodeURIComponent(res.data.content)}`,
        success: () => {
          uni.showToast({
            title: '正在查看原文',
            icon: 'success',
          })
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none',
          })
        },
      })
    } else {
      throw new Error(res.msg || '获取文章失败')
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    uni.showToast({
      title: '获取文章失败',
      icon: 'none',
    })
  }
}

// 下载文章
const handleDownloadArticle = async (item: TaskReviewSheet) => {
  if (downloading.value) {
    uni.showToast({
      title: '有文件正在下载中',
      icon: 'none',
    })
    return
  }

  downloading.value = item.id

  try {
    const res = await getArticleDetail(item.articleId)
    if (res.code === 1) {
      await prepareFileToShare(res.data)
      showSharePopup.value = true
    } else {
      throw new Error(res.msg || '下载失败')
    }
  } catch (error) {
    console.error('下载失败:', error)
    uni.showToast({
      title: '下载失败',
      icon: 'none',
    })
  } finally {
    downloading.value = ''
  }
}

// 准备文件分享
const prepareFileToShare = (articleInfo: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    downloadFilePath.value = `${wx.env.USER_DATA_PATH}/${articleInfo.title}.txt`

    uni.getFileSystemManager().writeFile({
      filePath: downloadFilePath.value,
      data: articleInfo.content,
      encoding: 'utf8',
      success: () => {
        resolve()
      },
      fail: (err) => {
        console.error('文件保存失败:', err)
        reject(new Error('文件保存失败'))
      },
    })
  })
}

// 分享文件
const shareFile = () => {
  uni.shareFileMessage({
    filePath: downloadFilePath.value,
    success: () => {
      showSharePopup.value = false
      uni.showToast({
        title: '分享成功',
        icon: 'success',
      })
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({
        title: '分享失败',
        icon: 'none',
      })
    },
  })
}

// 关闭弹窗
const handleClose = () => {
  showSharePopup.value = false
}

const fetchData = async () => {
  try {
    const res = await getTaskReviewSheets('UN_REVIEW')
    if (res.code === 1) {
      reviewSheets.value = res.data
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
// Reuse styles from accounttrackreview.vue
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

  &.platform-tag {
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

  &.view-btn {
    background: $primary-color;
  }

  &.download-btn {
    background: $warning-color;
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

// 分享弹窗样式
.share-popup {
  min-width: 560rpx;

  .share-title {
    margin-bottom: 24rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
  }

  .share-content {
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;
    font-size: 28rpx;
    color: $text-secondary;
    border-bottom: 2rpx solid $border-color;
  }

  .share-footer {
    display: flex;
    gap: 16rpx;
    justify-content: flex-end;

    .share-btn {
      min-width: 180rpx;
      height: 64rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      font-weight: 500;
      border: none;
      border-radius: 8rpx;
      transition: all 0.3s ease;

      &.cancel-btn {
        color: $text-secondary;
        background: #f5f5f5;
      }

      &.confirm-btn {
        color: #ffffff;
        background: $primary-color;
      }

      &:active {
        transform: translateY(1rpx);
      }
    }
  }
}
</style>
