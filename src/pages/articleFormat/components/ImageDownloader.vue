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
          <wd-button type="primary" size="small" @click="handlePreviewAll">预览所有图片</wd-button>
          <wd-button type="warning" size="small" @click="handleReset">重新下载</wd-button>
        </view>
      </view>

      <scroll-view scroll-y class="image-grid-container">
        <view class="image-grid">
          <view
            v-for="(image, index) in downloadedImages"
            :key="index"
            class="image-item"
            @click="handleImagePreview(index)"
          >
            <image :src="image.path" mode="aspectFill" />
            <view class="image-tip">
              <text>点击预览</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useToast } from 'wot-design-uni'

export default defineComponent({
  name: 'ImageDownloader',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const toast = useToast()
    const isDownloading = ref(false)
    const downloadedImages = ref<{ url: string; path: string }[]>([])

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

    // 预览单张图片
    const handleImagePreview = (index: number) => {
      const imagePaths = downloadedImages.value.map((img) => img.path)
      uni.previewImage({
        current: index,
        urls: imagePaths,
        success: () => {
          toast.info('长按图片可保存到相册')
        },
        fail: (error) => {
          console.error('Preview error:', error)
          toast.error('预览失败')
        },
      })
    }

    // 预览所有图片
    const handlePreviewAll = () => {
      if (downloadedImages.value.length === 0) {
        toast.error('没有可预览的图片')
        return
      }

      const imagePaths = downloadedImages.value.map((img) => img.path)
      uni.previewImage({
        current: 0,
        urls: imagePaths,
        success: () => {
          toast.info('长按图片可保存到相册')
        },
        fail: (error) => {
          console.error('Preview error:', error)
          toast.error('预览失败')
        },
      })
    }

    // 下载处理函数
    const handleDownload = async () => {
      const imageUrls = extractImageUrls(props.content)
      console.log('Found image URLs:', imageUrls)

      if (imageUrls.length === 0) {
        toast.error('未找到图片')
        return
      }

      isDownloading.value = true
      downloadedImages.value = []

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

    // 重置函数
    const handleReset = () => {
      downloadedImages.value = []
    }

    return {
      isDownloading,
      downloadedImages,
      handleDownload,
      handleImagePreview,
      handlePreviewAll,
      handleReset,
    }
  },
})
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
      transition: all 0.2s ease;

      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }

      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-tip {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 8rpx 4rpx 4rpx;
        font-size: 20rpx;
        color: white;
        text-align: center;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover .image-tip {
        opacity: 1;
      }
    }
  }

  .usage-tip {
    padding: 20rpx;
    margin: 20rpx;
    font-size: 24rpx;
    color: #666;
    text-align: center;
    background: #f8f9fa;
    border-radius: 8rpx;
  }
}
</style>
