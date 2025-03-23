<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '已完成任务详细',
  },
}
</route>

<template>
  <view class="finished-tasks">
    <view class="tasks-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">已完成任务</text>
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
              <text class="publish-time">发布时间: {{ item.fillTm }}</text>
            </view>
            <text class="article-link" v-if="item.articleAddr">
              文章地址: {{ item.articleAddr }}
            </text>
          </view>

          <!-- 操作按钮区 -->
          <view class="action-btns">
            <button class="btn secondary-btn" @click="copyTitle(item.title)">复制标题</button>
            <button
              class="btn primary-btn"
              :class="{ 'is-loading': downloading === item.id }"
              :disabled="downloading === item.id"
              @click="handleDownload(item)"
            >
              <text v-if="downloading === item.id">下载中...</text>
              <text v-else>下载</text>
            </button>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="tasks.length === 0 && !loading" class="empty-tip">
          <view class="empty-icon">
            <wd-icon name="warn-bold" size="48px" color="#909399" />
          </view>
          <text class="empty-text">暂无已完成任务</text>
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
          <wd-button size="medium" plain class="share-btn" @click="handleClose">取消</wd-button>
          <wd-button size="medium" type="primary" class="share-btn" @click="shareFile">
            立即分享
          </wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'
import { getPublishedTasks, downloadArticle } from '@/service/index/foo'
import type { PublishedTask } from '@/service/index/foo'

// 组件状态
const toast = useToast()
const tasks = ref<PublishedTask[]>([])
const loading = ref(false)
const error = ref(false)
const downloading = ref('') // 记录正在下载的任务ID
const showSharePopup = ref(false)
const downloadFilePath = ref('')

// 页面加载
onMounted(() => {
  loadTasks()
})

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  error.value = false

  try {
    const res = await getPublishedTasks()
    if (res.code === 1) {
      tasks.value = res.data || []
    } else {
      toast.error(res.msg || '加载失败')
    }
  } catch (err) {
    console.error('加载已完成任务列表失败:', err)
    error.value = true
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 复制文章标题
const copyTitle = (title: string) => {
  uni.hideToast()

  setTimeout(() => {
    uni.setClipboardData({
      data: title,
      success: () => {
        uni.hideToast()
        toast.success('复制成功')
      },
      fail: () => {
        toast.error('复制失败')
      },
    })
  }, 50)
}

// 处理下载
const handleDownload = async (task: PublishedTask) => {
  if (downloading.value) {
    toast.warning('有文件正在下载中')
    return
  }
  downloading.value = task.id

  try {
    const res = await downloadArticle({
      articleId: task.articleId,
      accountId: task.accountId,
    })
    if (res.code === 1) {
      await prepareFileToShare(res.data.content)
      showSharePopup.value = true
    }
    if (res.code === 0) {
      toast.error(res.msg)
    }
  } catch (err) {
    toast.error('下载失败')
  } finally {
    downloading.value = ''
  }
}

// 准备文件分享
const prepareFileToShare = (content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 使用文章标题作为文件名，并处理可能的非法字符
    const safeTitle = downloading.value
      ? tasks.value.find((t) => t.id === downloading.value)?.title?.replace(/[\\/:*?"<>|]/g, '_') ||
        'article'
      : 'article'

    downloadFilePath.value = `${wx.env.USER_DATA_PATH}/${safeTitle}.txt`

    uni.getFileSystemManager().writeFile({
      filePath: downloadFilePath.value,
      data: content,
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
      toast.success('分享成功')
    },
    fail: (err) => {
      console.error('分享失败:', err)
      toast.error('分享失败')
    },
  })
}

// 关闭弹窗
const handleClose = () => {
  showSharePopup.value = false
}
</script>

<style lang="scss">
// 复用 unpublishtasks.vue 的样式变量
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

.finished-tasks {
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
    color: $error-color;
  }

  .retry-btn {
    min-width: 160rpx;
  }
}

// 任务列表
.tasks-list {
  .task-item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
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
  margin-bottom: 24rpx;
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
  gap: 24rpx;
  margin-bottom: 8rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.article-link {
  display: block;
  font-size: 28rpx;
  color: $primary-color;
  word-break: break-all;
}

.action-btns {
  display: flex;
  gap: 12rpx;
  align-items: center;
  margin-left: auto;
  white-space: nowrap;
}

.btn {
  min-width: 96rpx;
  height: 64rpx;
  padding: 0 16rpx;
  margin: 0;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 64rpx;
  text-align: center;
  border: none;
  border-radius: 8rpx;
  transition: all 0.3s;

  &.primary-btn {
    color: $card-background;
    background: $primary-color;

    &.is-loading,
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &.secondary-btn {
    color: $text-secondary;
    background: #f5f5f5;
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

// 分享弹窗
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
    }
  }
}
</style>
