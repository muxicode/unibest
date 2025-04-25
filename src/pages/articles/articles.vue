<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '文章列表',
    backgroundColor: '#F8F9FA',
  },
}
</route>

<template>
  <view class="articles">
    <view class="article-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">文章列表</text>
        <text class="section-subtitle">共{{ articles.length }}篇文章</text>
      </view>

      <!-- 搜索框 -->
      <view class="search-box">
        <wd-icon name="search" size="32rpx" color="#999999" />
        <input
          v-model="keyword"
          class="search-input"
          type="text"
          placeholder="搜索文章"
          @input="handleSearch"
        />
        <wd-icon
          v-if="keyword"
          name="close-fill"
          size="32rpx"
          color="#999999"
          @click="clearSearch"
        />
      </view>

      <!-- 加载错误提示 -->
      <view v-if="error" class="error-tip">
        <wd-icon name="warn-bold" size="48px" color="#F56C6C" />
        <text class="error-text">加载失败,请重试</text>
        <wd-button size="small" class="retry-btn" @click="loadArticles">重新加载</wd-button>
      </view>

      <!-- 文章列表 -->
      <view v-else class="article-list">
        <view v-for="item in articles" :key="item.id" class="article-item">
          <!-- 文章内容区 -->
          <view class="article-content">
            <text class="article-title">{{ item.title }}</text>
          </view>

          <!-- 操作按钮区 -->
          <view class="action-btns">
            <button class="btn secondary-btn" @click="copyTitle(item.title)">复制</button>
            <button
              class="btn primary-btn"
              :class="{ 'is-loading': downloading === item.id }"
              :disabled="downloading === item.id"
              @click="handleDownload(item)"
            >
              <text v-if="downloading === item.id">下载中...</text>
              <text v-else>{{ item.isDownload ? '重新下载' : '下载' }}</text>
            </button>
          </view>
        </view>

        <!-- 无数据提示 -->
        <view v-if="articles.length === 0 && !loading" class="empty-tip">
          <view class="empty-icon">
            <wd-icon name="warn-bold" size="48px" color="#909399" />
          </view>
          <text class="empty-text">暂无文章数据</text>
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

    <!-- 相似度检测弹窗 -->
    <wd-popup
      v-model="showSimilarityPopup"
      custom-style="padding: 30px 40px; border-radius: 16px;"
      @close="cancelDownloadSimilar"
    >
      <view class="similarity-popup">
        <view class="similarity-title">相似文章检测</view>
        <view class="similarity-content">
          <text class="similarity-warning">
            检测到{{
              similarityResult?.similarityTitleNum || 0
            }}篇相似文章，建议选择其他文章进行下载。
          </text>

          <view class="similar-list">
            <view
              v-for="(item, index) in similarityResult?.similarityTitles"
              :key="index"
              class="similar-item"
            >
              <view class="similar-title">{{ item.title }}</view>
              <view class="similar-info">
                <text class="similar-date">{{ item.date }}</text>
                <text class="similar-percent">相似度: {{ item.similarity }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="similarity-footer">
          <wd-button size="medium" plain class="cancel-btn" @click="cancelDownloadSimilar">
            取消下载
          </wd-button>
          <wd-button
            size="medium"
            type="primary"
            class="confirm-btn"
            @click="confirmDownloadSimilar"
          >
            继续下载
          </wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'
import { getArticles, downloadArticle, checkTitleSimilarity } from '@/service/index/foo'
import type { ArticleItem, ArticleInfo, SimilarityResult } from '@/service/index/foo'

// 组件状态
const toast = useToast()
const articles = ref<ArticleItem[]>([])
const loading = ref(false)
const error = ref(false)
const accountId = ref('')
const downloading = ref('') // 记录正在下载的文章ID
const showSharePopup = ref(false)
const downloadFilePath = ref('')
const keyword = ref('')

// 相似度检测相关状态
const showSimilarityPopup = ref(false)
const similarityResult = ref<SimilarityResult | null>(null)
const currentArticle = ref<ArticleItem | null>(null)

// 页面加载
onLoad((options: any) => {
  accountId.value = options?.accountId || ''
  loadArticles()
})

// 页面显示时刷新数据
onShow(() => {
  // 如果账号ID存在，刷新文章列表
  if (accountId.value) {
    loadArticles()
  }
})

// 加载文章列表
const loadArticles = async () => {
  if (!accountId.value) {
    toast.error('账号ID不能为空')
    return
  }

  loading.value = true
  error.value = false

  try {
    const res = await getArticles({
      pageNo: 1,
      pageSize: 10,
      accountId: accountId.value,
      keyWord: keyword.value.trim(),
    })
    articles.value = res.data || [] // Handle null response
  } catch (err) {
    console.error('加载文章列表失败:', err)
    error.value = true
    toast.error('加载失败')
    articles.value = [] // Clear list on error
  } finally {
    loading.value = false
  }
}

// 复制文章标题
const copyTitle = (title: string) => {
  uni.hideToast() // 先隐藏可能存在的提示

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
const handleDownload = async (article: ArticleItem) => {
  if (downloading.value) {
    toast.warning('有文件正在下载中')
    return
  }

  // 先检查标题相似度
  try {
    downloading.value = article.id
    currentArticle.value = article

    const res = await checkTitleSimilarity({
      accountId: accountId.value,
      title: article.title,
    })

    // 如果存在相似标题
    if (res.data.similarityTitleNum > 0) {
      similarityResult.value = res.data
      showSimilarityPopup.value = true
      downloading.value = '' // 重置下载状态
      return
    }

    // 如果没有相似标题，直接下载
    await downloadArticleFile(article)
  } catch (err) {
    console.error('检查标题相似度失败:', err)
    toast.error('检查失败')
    downloading.value = ''
  }
}

// 实际下载文章的方法
const downloadArticleFile = async (article: ArticleItem) => {
  downloading.value = article.id

  try {
    const res = await downloadArticle({
      articleId: article.id,
      accountId: accountId.value,
    })

    // 检查响应码
    if (res.code === 1) {
      await prepareFileToShare(res.data)
      showSharePopup.value = true
    }
    // 不需要在这里处理 code === 0 的情况，因为拦截器已经显示了错误提示
  } catch (err) {
    console.error('下载失败:', err)
    toast.error('下载失败')
  } finally {
    // 确保在所有情况下都重置下载状态
    downloading.value = ''
  }
}

// 确认下载相似文章
const confirmDownloadSimilar = async () => {
  showSimilarityPopup.value = false

  if (currentArticle.value) {
    await downloadArticleFile(currentArticle.value)
  }
}

// 取消下载相似文章
const cancelDownloadSimilar = () => {
  showSimilarityPopup.value = false
  loadArticles() // 刷新文章列表
}

// 准备文件分享
const prepareFileToShare = (articleInfo: ArticleInfo): Promise<void> => {
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
  loadArticles() // 刷新文章列表
}

// 处理搜索
let searchTimer: number | null = null
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    loadArticles()
  }, 800) as unknown as number // Increased debounce time
}

// 清除搜索
const clearSearch = () => {
  keyword.value = ''
  loadArticles()
}

// 清理定时器
onUnmounted(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})
</script>

<style lang="scss" scoped>
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

.articles {
  min-height: 100vh;
  padding: $spacing-base;
  background: $background-color;
}

.article-card {
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

// 文章列表
.article-list {
  .article-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 88rpx;
    padding: $spacing-base;
    background: $card-background;
    border-bottom: 2rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }
}

.article-content {
  flex: 1;
  margin-right: 16rpx;
  overflow: hidden;
}

.article-title {
  display: -webkit-box;
  overflow: hidden;
  font-size: 30rpx;
  line-height: 1.5;
  color: $text-primary;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.action-btns {
  display: flex;
  gap: 12rpx;
  align-items: center;
  white-space: nowrap;
}

.btn {
  min-width: 112rpx;
  height: 64rpx;
  padding: 0 20rpx;
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

.search-box {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  margin: 0 12rpx 24rpx;
  background: #f7f8fa;
  border-radius: $border-radius;

  .wd-icon {
    flex-shrink: 0;
  }
}

.search-input {
  flex: 1;
  width: 100%;
  height: 48rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: $text-primary;
  background: transparent;
  border: none;

  &::placeholder {
    color: $text-tertiary;
  }
}

// 相似度检测弹窗
.similarity-popup {
  min-width: 560rpx;
  max-width: 90vw;

  .similarity-title {
    margin-bottom: 24rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
  }

  .similarity-content {
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;
    font-size: 28rpx;
    color: $text-secondary;
    border-bottom: 2rpx solid $border-color;

    .similarity-warning {
      display: block;
      margin-bottom: 20rpx;
      font-weight: 500;
      color: $warning-color;
    }
  }

  .similar-list {
    max-height: 400rpx;
    overflow-y: auto;

    .similar-item {
      padding: 16rpx;
      margin-bottom: 16rpx;
      background-color: $background-color;
      border-radius: 8rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .similar-title {
        margin-bottom: 8rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: $text-primary;
      }

      .similar-info {
        display: flex;
        justify-content: space-between;

        .similar-date {
          font-size: 24rpx;
          color: $text-tertiary;
        }

        .similar-percent {
          font-size: 24rpx;
          font-weight: 500;
          color: $error-color;
        }
      }
    }
  }

  .similarity-footer {
    display: flex;
    gap: 16rpx;
    justify-content: flex-end;

    .cancel-btn,
    .confirm-btn {
      min-width: 180rpx;
    }
  }
}
</style>
