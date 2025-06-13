<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '未完成任务详细',
  },
}
</route>

<template>
  <view class="unpublish-tasks">
    <view class="tasks-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">未发布任务</text>
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
            <text class="account-name">账号: {{ item.accountName }}</text>
          </view>

          <!-- 操作按钮区 -->
          <view class="action-btns">
            <button
              class="btn primary-btn"
              :class="{ 'is-loading': downloading === item.id }"
              :disabled="downloading === item.id"
              @click="handleDownload(item)"
            >
              <text v-if="downloading === item.id">下载中...</text>
              <text v-else>下载</text>
            </button>
            <button
              class="btn publish-btn"
              :disabled="publishing === item.id"
              @click="handlePublish(item)"
            >
              <text v-if="publishing === item.id">发布中...</text>
              <text v-else>发布</text>
            </button>
            <button
              class="btn publish-btn"
              :disabled="submitting === item.id"
              @click="showPublishDialog(item)"
            >
              <text v-if="submitting === item.id">回填中...</text>
              <text v-else>回填地址</text>
            </button>
            <button
              class="btn reject-btn"
              :disabled="rejecting === item.id"
              @click="showRejectDialog(item)"
            >
              <text v-if="rejecting === item.id">拒绝中...</text>
              <text v-else>拒绝</text>
            </button>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="tasks.length === 0 && !loading" class="empty-tip">
          <view class="empty-icon">
            <wd-icon name="warn-bold" size="48px" color="#909399" />
          </view>
          <text class="empty-text">暂无未发布任务</text>
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

    <!-- 发表文章弹窗 -->
    <wd-message-box selector="publish-article-dialog">
      <view class="publish-dialog">
        <view class="dialog-title">{{ currentTask?.title }}</view>
        <view class="dialog-account">账号：{{ currentTask?.accountName }}</view>
        <view class="dialog-input">
          <wd-input v-model="articleAddress" placeholder="请输入文章地址" clearable />
        </view>
      </view>
    </wd-message-box>

    <!-- 拒绝任务弹窗 -->
    <wd-message-box selector="reject-task-dialog">
      <view class="reject-dialog">
        <view class="dialog-title">{{ currentTask?.title }}</view>
        <view class="dialog-account">账号：{{ currentTask?.accountName }}</view>
        <view class="dialog-input">
          <wd-input v-model="rejectReason" placeholder="请输入拒绝原因" type="textarea" clearable />
        </view>
      </view>
    </wd-message-box>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast, useMessage } from 'wot-design-uni'
import {
  getUnpublishedTasks,
  downloadArticle,
  fillArticleAddress,
  rejectTask,
} from '@/service/index/foo'
import type { UnpublishedTask } from '@/service/index/foo'

// 组件状态
const toast = useToast()
const message = useMessage('publish-article-dialog')
const rejectDialog = useMessage('reject-task-dialog')
const tasks = ref<UnpublishedTask[]>([])
const loading = ref(false)
const error = ref(false)
const downloading = ref('') // 记录正在下载的任务ID
const publishing = ref('') // 记录正在发布的任务ID
const submitting = ref('') // 记录正在提交的任务ID
const showSharePopup = ref(false)
const downloadFilePath = ref('')
const articleAddress = ref('')
const currentTask = ref<UnpublishedTask | null>(null)
const rejectReason = ref('')
const rejecting = ref('') // 记录正在拒绝的任务ID

// 页面加载
onMounted(() => {
  loadTasks()
})

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  error.value = false

  try {
    const res = await getUnpublishedTasks()
    if (res.code === 1) {
      tasks.value = res.data || [] // 确保当 data 为 null 或 undefined 时设置为空数组
    } else {
      toast.error(res.msg || '加载失败')
    }
  } catch (err) {
    console.error('加载未发布任务列表失败:', err)
    error.value = true
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 处理下载
const handleDownload = async (task: UnpublishedTask) => {
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
    downloadFilePath.value = `${wx.env.USER_DATA_PATH}/article.txt`

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

// 显示发表文章弹窗
const showPublishDialog = (task: UnpublishedTask) => {
  currentTask.value = task
  articleAddress.value = ''

  message
    .confirm({
      title: '发表文章',
      confirmButtonText: '提交',
      cancelButtonText: '取消',
    })
    .then(() => {
      handleSubmitAddress()
    })
    .catch(() => {
      currentTask.value = null
    })
}

// 处理提交文章地址
const handleSubmitAddress = async () => {
  if (!currentTask.value || !articleAddress.value.trim()) {
    toast.error('请输入文章地址')
    return
  }

  submitting.value = currentTask.value.id

  try {
    const res = await fillArticleAddress({
      id: currentTask.value.id,
      accountId: currentTask.value.accountId,
      articleAddr: articleAddress.value.trim(),
    })

    if (res.code === 1) {
      message.close()
      toast.success('提交成功')
      await loadTasks() // 刷新列表
    } else {
      toast.error(res.msg || '提交失败')
    }
  } catch (err) {
    console.error('提交文章地址失败:', err)
    toast.error('提交失败')
  } finally {
    submitting.value = ''
    currentTask.value = null
    articleAddress.value = ''
  }
}

// 处理发布
const handlePublish = async (task: UnpublishedTask) => {
  if (publishing.value) {
    toast.warning('有文章正在发布中')
    return
  }
  publishing.value = task.id

  try {
    const res = await downloadArticle({
      articleId: task.articleId,
      accountId: task.accountId,
    })

    if (res.code === 1) {
      // 跳转到文章格式化页面，并传递文章数据
      uni.navigateTo({
        url: `/pages/articleFormat/articleFormat?title=${encodeURIComponent(res.data.title)}&content=${encodeURIComponent(res.data.content)}`,
        success: () => {
          toast.success('准备发布')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          toast.error('跳转失败')
        },
      })
    } else {
      toast.error(res.msg || '下载失败')
    }
  } catch (err) {
    console.error('发布失败:', err)
    toast.error('发布失败')
  } finally {
    publishing.value = ''
  }
}

// 显示拒绝任务弹窗
const showRejectDialog = (task: UnpublishedTask) => {
  currentTask.value = task
  rejectReason.value = ''

  rejectDialog
    .confirm({
      title: '拒绝任务',
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
    })
    .then(() => {
      handleReject()
    })
    .catch(() => {
      currentTask.value = null
    })
}

// 处理拒绝任务
const handleReject = async () => {
  if (!currentTask.value) {
    toast.error('任务信息错误')
    return
  }

  rejecting.value = currentTask.value.id

  try {
    const res = await rejectTask({
      id: currentTask.value.id,
      reason: rejectReason.value.trim(),
    })

    if (res.code === 1) {
      rejectDialog.close()
      toast.success('拒绝成功')
      await loadTasks() // 刷新列表
    } else {
      toast.error(res.msg || '拒绝失败')
    }
  } catch (err) {
    console.error('拒绝任务失败:', err)
    toast.error('拒绝失败')
  } finally {
    rejecting.value = ''
    currentTask.value = null
    rejectReason.value = ''
  }
}
</script>

<style lang="scss">
// 变量定义
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

.unpublish-tasks {
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
  overflow: hidden;
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

.account-name {
  display: block;
  font-size: 28rpx;
  color: $text-secondary;
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

  &.publish-btn {
    color: $card-background;
    background: $success-color;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &.reject-btn {
    color: $card-background;
    background: $error-color;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
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

// 发表文章弹窗
.publish-dialog {
  max-height: 70vh;
  padding: 24rpx 0;

  .dialog-title {
    padding: 0 24rpx;
    margin-bottom: 16rpx;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 1.5;
    color: $text-primary;
    text-align: center;
    word-break: break-all;
    word-wrap: break-word;
  }

  .dialog-account {
    margin-bottom: 24rpx;
    font-size: 28rpx;
    color: $text-secondary;
    text-align: center;
  }

  .dialog-input {
    padding: 0 24rpx;
  }
}

// 拒绝任务弹窗
.reject-dialog {
  max-height: 70vh;
  padding: 24rpx 0;

  .dialog-title {
    padding: 0 24rpx;
    margin-bottom: 16rpx;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 1.5;
    color: $text-primary;
    text-align: center;
    word-break: break-all;
    word-wrap: break-word;
  }

  .dialog-account {
    margin-bottom: 24rpx;
    font-size: 28rpx;
    color: $text-secondary;
    text-align: center;
  }

  .dialog-input {
    padding: 0 24rpx;
  }
}

// 全局覆盖弹窗样式
:deep(.wd-message-box) {
  width: 640rpx !important;
  padding: 40rpx !important;
  border-radius: 16rpx !important;
}

:deep(.wd-message-box__btns) {
  margin-top: 32rpx !important;
}
</style>
