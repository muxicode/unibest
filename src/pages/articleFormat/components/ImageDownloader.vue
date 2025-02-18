<template>
  <view class="image-downloader">
    <!-- 下载按钮 -->
    <view class="action-section">
      <wd-button
        type="primary"
        size="small"
        :loading="isDownloading"
        @click="handleDownload"
        v-if="!downloadedImages.length"
      >
        <wd-icon name="download" size="28rpx" />
        <text class="btn-text">下载图片</text>
      </wd-button>
    </view>

    <!-- 图片预览和选择区域 -->
    <view v-if="downloadedImages.length" class="image-preview">
      <view class="preview-header">
        <text class="preview-title">已下载 {{ downloadedImages.length }} 张图片</text>
        <view class="preview-actions">
          <wd-button
            type="primary"
            size="small"
            :disabled="!selectedImages.length"
            @click="handleShare"
          >
            分享选中图片
          </wd-button>
          <wd-button type="warning" size="small" @click="handleReset">重新下载</wd-button>
        </view>
      </view>

      <scroll-view scroll-y class="image-grid-container">
        <view class="image-grid">
          <view
            v-for="(image, index) in downloadedImages"
            :key="index"
            class="image-item"
            :class="{ selected: selectedImages.includes(image.path) }"
            @click="toggleImageSelection(image.path)"
          >
            <image :src="image.path" mode="aspectFill" />
            <view class="image-checkbox">
              <wd-icon
                :name="selectedImages.includes(image.path) ? 'check-circle-fill' : 'circle'"
                size="36rpx"
                :color="selectedImages.includes(image.path) ? '#1989fa' : '#999'"
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()
const isDownloading = ref(false)
const downloadedImages = ref<{ url: string; path: string }[]>([])
const selectedImages = ref<string[]>([])
const currentIndex = ref(0)

const props = defineProps<{
  content: string
}>()

// 提取图片URL
const extractImageUrls = (content: string): string[] => {
  // 匹配 markdown 图片语法
  const markdownRegex = /!\[.*?\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif)(?:\?.*?)?)\)/gi
  // 匹配 HTML 图片标签
  const htmlRegex = /<img.*?src=["'](https?:\/\/.*?\.(?:png|jpg|jpeg|gif)(?:\?.*?)?)["']/gi
  // 匹配纯URL
  const urlRegex = /(https?:\/\/.*?\.(?:png|jpg|jpeg|gif)(?:\?.*?)?)(?:\s|$)/gi

  const urls = new Set<string>()
  let match

    // 收集所有匹配的URL
  ;[markdownRegex, htmlRegex, urlRegex].forEach((regex) => {
    while ((match = regex.exec(content)) !== null) {
      urls.add(match[1])
    }
  })

  return Array.from(urls)
}

// 下载单个图片
const downloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error(`下载失败: ${res.statusCode}`))
        }
      },
      fail: reject,
    })
  })
}

// 分享单个文件
const shareFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    uni.shareFileMessage({
      filePath,
      success: () => resolve(),
      fail: reject,
    })
  })
}

// 切换图片选择状态
const toggleImageSelection = (path: string) => {
  selectedImages.value = [path]
  currentIndex.value = downloadedImages.value.findIndex((img) => img.path === path)
}

// 更新下载处理函数
const handleDownload = async () => {
  const imageUrls = extractImageUrls(props.content)
  console.log('Found image URLs:', imageUrls)

  if (imageUrls.length === 0) {
    toast.error('未找到图片')
    return
  }

  isDownloading.value = true
  downloadedImages.value = []
  selectedImages.value = []
  currentIndex.value = 0 // 重置索引

  try {
    // 下载所有图片
    for (const url of imageUrls) {
      try {
        const path = await downloadImage(url)
        downloadedImages.value.push({ url, path })
      } catch (error) {
        console.error(`下载图片失败: ${url}`, error)
      }
    }

    if (downloadedImages.value.length > 0) {
      // 只默认选中第一张图片
      selectedImages.value = [downloadedImages.value[0].path]
      toast.success(`成功下载 ${downloadedImages.value.length} 张图片`)
    } else {
      toast.error('所有图片下载失败')
    }
  } catch (error) {
    console.error('Download error:', error)
    toast.error('下载失败')
  } finally {
    isDownloading.value = false
  }
}

// 更新分享处理函数
const handleShare = async () => {
  if (selectedImages.value.length === 0) {
    toast.error('请选择要分享的图片')
    return
  }

  try {
    // 分享当前选中的图片
    await shareFile(selectedImages.value[0])
    toast.success('分享成功')

    // 更新选中状态到下一张图片
    currentIndex.value++
    if (currentIndex.value < downloadedImages.value.length) {
      // 还有下一张图片，更新选中
      selectedImages.value = [downloadedImages.value[currentIndex.value].path]
      toast.info(`请继续分享第 ${currentIndex.value + 1} 张图片`)
    } else {
      // 已经分享完所有图片
      selectedImages.value = []
      currentIndex.value = 0
      toast.success('已分享完所有图片')
    }
  } catch (error) {
    console.error('Share error:', error)
    toast.error('分享失败')
  }
}

// 更新重置函数
const handleReset = () => {
  downloadedImages.value = []
  selectedImages.value = []
  currentIndex.value = 0
}
</script>

<style lang="scss" scoped>
.image-downloader {
  width: 100%;

  .action-section {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;

    .btn-text {
      margin-left: 8rpx;
      font-size: 28rpx;
    }
  }
}

.image-preview {
  margin-top: 20rpx;

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    margin-bottom: 20rpx;

    .preview-title {
      font-size: 28rpx;
      color: #666;
    }

    .preview-actions {
      display: flex;
      gap: 16rpx;
    }
  }

  .image-grid-container {
    max-height: 800rpx;
    padding: 0 20rpx;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding-bottom: 20rpx;

    .image-item {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      border: 1px solid #eee;
      border-radius: 6rpx;

      &.selected {
        border: 2px solid #1989fa;
      }

      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-checkbox {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
      }
    }
  }
}
</style>
