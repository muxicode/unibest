<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: 'Markdown格式化',
    backgroundColor: '#F8F9FA',
  },
}
</route>

<template>
  <view class="article-format">
    <view class="format-card">
      <!-- 卡片头部 -->
      <view class="card-header">
        <text class="section-title">Markdown格式化</text>
        <text class="section-subtitle">支持主题切换</text>
      </view>

      <!-- 主题选择 -->
      <view class="format-options">
        <view class="theme-selector">
          <text class="theme-label">主题：</text>
          <wd-picker
            v-model="currentTheme"
            :columns="themes"
            :label-key="'label'"
            :value-key="'value'"
            @confirm="handleThemeChange"
          >
            <text class="picker-text">
              {{ themes.find((t) => t.value === currentTheme)?.label }}
            </text>
          </wd-picker>
        </view>

        <image-downloader v-if="content" :content="content" />
      </view>

      <!-- 文件导入区域 -->
      <view v-if="!content" class="upload-area" @click="handleChooseFile">
        <wd-icon name="upload" size="48px" color="#999999" />
        <text class="upload-text">点击选择Markdown文件</text>
        <text class="upload-tip">支持.txt、.md格式</text>
        <text v-if="isIOS" class="upload-tip">请先将文件发送至微信聊天，再从聊天记录中选择</text>
      </view>

      <!-- 预览区域 -->
      <view v-else class="preview-area">
        <rich-text
          :nodes="formattedContent"
          :selectable="true"
          class="article-content"
          space="nbsp"
        />
      </view>

      <!-- 操作按钮 -->
      <view v-if="content" class="action-btns">
        <wd-button class="btn" type="warning" @click="handleReset">重新选择</wd-button>
      </view>

      <!-- 操作提示 -->
      <view v-if="content" class="operation-tips">
        <text class="tip-text">长按文章内容可以选择并复制</text>
      </view>
    </view>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useToast } from 'wot-design-uni'
import { convertMarkdownToHtml, convertHtmlToNodes } from './utils/markdown'
import ImageDownloader from './components/ImageDownloader.vue'

const toast = useToast()

// 状态
const content = ref('')
const currentTheme = ref('theme-default')

// 主题列表
const themes = [
  { label: '默认主题', value: 'theme-default' },
  { label: '暗色主题', value: 'theme-dark' },
  { label: '护眼主题', value: 'theme-green' },
]

// 判断是否为 iOS 平台
const isIOS = computed(() => uni.getSystemInfoSync().platform === 'ios')

// 格式化后的内容
const formattedContent = computed(() => {
  if (!content.value) return []
  console.log('Original content:', JSON.stringify(content.value))
  const html = convertMarkdownToHtml(content.value, currentTheme.value)
  console.log('Converted HTML:', JSON.stringify(html))
  const nodes = convertHtmlToNodes(html)
  console.log('Final nodes:', JSON.stringify(nodes))
  return nodes
})

// 选择文件
const handleChooseFile = () => {
  // 统一使用 chooseMessageFile，但针对不同平台使用不同的配置
  const options: any = {
    count: 1,
    type: 'file',
    extension: ['.txt', '.md'],
    success: handleFileSuccess,
    fail: (err) => {
      console.error('Choose file error:', JSON.stringify(err))
      // 针对 iOS 平台给出更详细的提示
      if (isIOS.value) {
        toast.error('请先将文件发送至微信聊天，再从聊天记录中选择')
      } else {
        toast.error('选择文件失败')
      }
    },
  }

  // iOS 平台尝试不同的类型
  if (isIOS.value) {
    options.type = 'all'
  }

  uni.chooseMessageFile(options)
}

// 处理文件选择成功
const handleFileSuccess = (res: any) => {
  const file = res.tempFiles[0]
  console.log('Selected file:', JSON.stringify(file))

  // 读取文件内容
  uni.getFileSystemManager().readFile({
    filePath: file.path,
    encoding: 'utf8',
    success: (res) => {
      console.log('File content:', JSON.stringify(res.data))
      content.value = String(res.data)
      toast.success('导入成功')
    },
    fail: (err) => {
      console.error('Read file error:', JSON.stringify(err))
      toast.error('读取文件失败')
    },
  })
}

// 主题切换
const handleThemeChange = () => {
  // 主题切换时会自动重新计算 formattedContent
}

// 重置
const handleReset = () => {
  content.value = ''
  currentTheme.value = 'theme-default'
}
</script>

<style lang="scss" scoped>
$card-padding: 24rpx;
$border-radius: 20rpx;
$primary-color: #1989fa;
$warning-color: #ff976a;
$text-primary: #333333;
$text-secondary: #666666;
$text-tertiary: #999999;
$border-color: #f0f0f0;
$background-color: #f5f5f5;
$card-background: #ffffff;

.article-format {
  min-height: 100vh;
  padding: $card-padding;
  background: $background-color;
}

.format-card {
  padding: $card-padding;
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

.format-options {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.theme-selector {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;

  .theme-label {
    margin-right: 16rpx;
    font-size: 28rpx;
    color: $text-secondary;
  }

  .picker-text {
    font-size: 28rpx;
    color: $text-primary;
  }
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  margin: 24rpx 0;
  cursor: pointer;
  background: #f8f9fa;
  border: 2rpx dashed #dcdfe6;
  border-radius: 12rpx;

  .upload-text {
    margin-top: 24rpx;
    font-size: 32rpx;
    color: $text-secondary;
  }

  .upload-tip {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: $text-tertiary;
    text-align: center;
  }
}

.preview-area {
  min-height: 400rpx;
  margin: 24rpx 0;
  overflow-x: auto;
  background: #ffffff;
  border: 2rpx solid #ebeef5;
  border-radius: 12rpx;

  :deep(.article-content) {
    // 精确控制文本区域
    display: block;
    max-width: 100%; // 限制最大宽度
    padding: 32rpx;
    margin: 0;

    // 设置合适的文本样式
    font-size: 28rpx;
    line-height: 1.8;
    color: inherit;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word; // 确保长单词也能换行

    // 移除可能影响选择的空白
    white-space: pre-wrap;

    // 优化选择体验
    cursor: text;
    // 确保文本可以选择
    -webkit-user-select: text !important;
    user-select: text !important;

    // 移除可能影响选择的样式
    -webkit-touch-callout: default;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);

    // 图片样式优化
    :deep(.md-img) {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 16rpx auto;
    }

    // 保留文章样式
    :deep(.md-strong) {
      font-weight: bold;
    }

    // 标题样式
    :deep(.md-h1),
    :deep(.md-h2),
    :deep(.md-h3),
    :deep(.md-h4),
    :deep(.md-h5),
    :deep(.md-h6) {
      margin: 24rpx 0 16rpx;
      font-weight: bold;
      line-height: 1.4;
    }

    :deep(.md-h1) {
      font-size: 40rpx;
    }
    :deep(.md-h2) {
      font-size: 36rpx;
    }
    :deep(.md-h3) {
      font-size: 32rpx;
    }
    :deep(.md-h4) {
      font-size: 30rpx;
    }
    :deep(.md-h5) {
      font-size: 28rpx;
    }
    :deep(.md-h6) {
      font-size: 26rpx;
    }

    // 段落样式
    :deep(.md-p) {
      padding: 0;
      margin: 16rpx 0;
    }

    // 列表样式
    :deep(.md-ul),
    :deep(.md-ol) {
      padding-left: 32rpx;
      margin: 16rpx 0;
    }

    // 引用样式
    :deep(.md-blockquote) {
      padding: 16rpx 24rpx;
      margin: 16rpx 0;
      background: #f9f9f9;
      border-left: 4rpx solid #ddd;
    }

    // 链接样式
    :deep(.md-a) {
      color: #1989fa;
      text-decoration: none;
    }

    // 代码样式
    :deep(.md-code) {
      padding: 4rpx 8rpx;
      background: #f5f5f5;
      border-radius: 4rpx;
    }

    :deep(.md-pre) {
      padding: 16rpx;
      margin: 16rpx 0;
      overflow-x: auto;
      background: #f5f5f5;
      border-radius: 8rpx;

      .md-code {
        padding: 0;
        background: none;
      }
    }
  }
}

// 移除 preview-area 的内边距，由 article-content 控制
.preview-area {
  padding: 0;
}

.action-btns {
  display: flex;
  gap: 24rpx;
  justify-content: center;
  margin-top: 32rpx;

  .btn {
    min-width: 180rpx;
    height: 80rpx;
    font-size: 28rpx;
  }
}

.operation-tips {
  padding: 24rpx;
  margin-top: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;

  .tip-text {
    display: block;
    font-size: 26rpx;
    line-height: 1.5;
    color: $text-secondary;
    text-align: center;
  }
}

// 优化选中效果
:deep(.rich-text) {
  position: relative;
  -webkit-user-select: text;
  user-select: text;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    content: '';
    opacity: 0;
    transition: opacity 0.2s;
  }

  &.selecting::after {
    background: rgba($primary-color, 0.1);
    opacity: 1;
  }
}
/* 主题相关样式会从theme.scss中继承 */
</style>
