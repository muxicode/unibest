<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '数据上报',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page-container">
    <wd-message-box />
    <wd-toast />

    <view class="header-section">
      <view class="gradient-bg"></view>
      <view class="header-content">
        <image src="/static/logo.png" alt="" class="logo" />
        <view class="header-text">
          <view class="title">数据上报</view>
          <view class="subtitle">上报昨日数据，记录成长轨迹</view>
        </view>
      </view>
    </view>

    <wd-form ref="form" :model="model" :rules="rules">
      <view class="form-card">
        <view class="form-header">昨日数据</view>
        <view class="form-body">
          <wd-input
            label="阅读数"
            label-width="140rpx"
            prop="lastReadingNum"
            type="number"
            required
            clearable
            v-model.number="model.lastReadingNum"
            placeholder="请输入昨日阅读数"
          />

          <wd-input
            class="mt-4"
            label="昨日收入"
            label-width="140rpx"
            prop="lastIncome"
            type="digit"
            required
            clearable
            v-model.number="model.lastIncome"
            placeholder="请输入昨日收入"
          />

          <wd-input
            class="mt-4"
            label="当月收入"
            label-width="140rpx"
            prop="incomeOfMonth"
            type="digit"
            required
            clearable
            v-model.number="model.incomeOfMonth"
            placeholder="请输入当月收入"
          />
        </view>
      </view>

      <view class="form-card">
        <view class="form-header">数据截图</view>
        <view class="form-body">
          <view class="custom-form-item">
            <text class="form-label">阅读截图</text>
            <view class="upload-content">
              <view class="upload-area" @click="chooseImage('reading')" v-if="!readingImageUrl">
                <view class="upload-placeholder">
                  <view class="iconfont icon-screenshot"></view>
                  <view class="upload-text">上传截图</view>
                </view>
              </view>
              <view class="image-preview" v-else>
                <image :src="readingImageUrl" mode="aspectFill" class="preview-image" />
                <view class="delete-btn" @click.stop="deleteImage('reading')">
                  <view class="iconfont icon-close"></view>
                </view>
              </view>
              <view class="upload-tip">请上传后台阅读数据统计页面截图</view>
            </view>
          </view>

          <view class="custom-form-item mt-4">
            <text class="form-label">收入截图</text>
            <view class="upload-content">
              <view class="upload-area" @click="chooseImage('income')" v-if="!incomeImageUrl">
                <view class="upload-placeholder">
                  <view class="iconfont icon-screenshot"></view>
                  <view class="upload-text">上传截图</view>
                </view>
              </view>
              <view class="image-preview" v-else>
                <image :src="incomeImageUrl" mode="aspectFill" class="preview-image" />
                <view class="delete-btn" @click.stop="deleteImage('income')">
                  <view class="iconfont icon-close"></view>
                </view>
              </view>
              <view class="upload-tip">请上传后台收入统计页面截图</view>
            </view>
          </view>
        </view>
      </view>

      <view class="submit-tip">请确保数据真实有效，如有作假将被永久禁用</view>

      <view class="submit-section">
        <wd-button
          type="primary"
          size="large"
          custom-class="submit-btn"
          :loading="submitting"
          @click="handleSubmit"
          block
        >
          提交上报
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { type FormInstance, type FormRules } from 'wot-design-uni/components/wd-form/types'
import { reactive, ref } from 'vue'

interface UploadForm {
  lastReadingNum: number
  lastIncome: number
  incomeOfMonth: number
  accountId: string
}

const model = reactive<UploadForm>({
  lastReadingNum: 0,
  lastIncome: 0,
  incomeOfMonth: 0,
  accountId: '',
})

// 获取路由参数
onLoad((options: any) => {
  model.accountId = options?.accountId
})

// 表单校验规则
const rules: FormRules = {
  lastReadingNum: [{ required: true, message: '请输入昨日阅读数' }],
  lastIncome: [{ required: true, message: '请输入昨日收入' }],
  incomeOfMonth: [{ required: true, message: '请输入当月收入' }],
}

// 图片相关状态
const readingImageUrl = ref<string>('')
const incomeImageUrl = ref<string>('')
const readingTempFilePath = ref<string>('')
const incomeTempFilePath = ref<string>('')

const toast = useToast()
const form = ref<FormInstance>()
const submitting = ref(false)

// 选择图片
async function chooseImage(type: 'reading' | 'income') {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    if (type === 'reading') {
      readingImageUrl.value = res.tempFilePaths[0]
      readingTempFilePath.value = res.tempFilePaths[0]
    } else {
      incomeImageUrl.value = res.tempFilePaths[0]
      incomeTempFilePath.value = res.tempFilePaths[0]
    }
  } catch (error) {
    console.error('选择图片失败:', error)
  }
}

// 删除图片
function deleteImage(type: 'reading' | 'income') {
  if (type === 'reading') {
    readingImageUrl.value = ''
    readingTempFilePath.value = ''
  } else {
    incomeImageUrl.value = ''
    incomeTempFilePath.value = ''
  }
}

// 创建 FormData
function createFormData(data: Record<string, any>, files: Record<string, string>) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2)
  let formData = ''

  // 添加文本字段
  Object.keys(data).forEach((key) => {
    formData += `--${boundary}\r\n`
    formData += `Content-Disposition: form-data; name="${key}"\r\n\r\n`
    formData += `${data[key]}\r\n`
  })

  // 读取并添加文件
  const filePromises = Object.keys(files).map((key) => {
    return new Promise<string>((resolve, reject) => {
      // 获取文件扩展名和MIME类型
      const filePath = files[key]
      const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase()
      const mimeType = getMimeType(fileExt)
      // 使用key作为文件名前缀，确保文件名唯一
      const fileName = `${key}_image.${fileExt}`

      const fileSystem = uni.getFileSystemManager()
      fileSystem.readFile({
        filePath: files[key],
        success: (res) => {
          let fileData = ''
          fileData += `--${boundary}\r\n`
          fileData += `Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`
          fileData += `Content-Type: ${mimeType}\r\n\r\n`
          // FileSystemManager.readFile returns ArrayBuffer that needs to be appended to string
          // Using a type assertion instead of ts-expect-error
          fileData += (res.data as unknown as string) + '\r\n'
          resolve(fileData)
        },
        fail: reject,
      })
    })
  })

  return Promise.all(filePromises).then((fileParts) => {
    formData += fileParts.join('')
    formData += `--${boundary}--`
    return {
      contentType: `multipart/form-data; boundary=${boundary}`,
      data: formData,
    }
  })
}

// 获取MIME类型
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
  }

  return mimeTypes[extension] || 'application/octet-stream'
}

// 提交表单
async function handleSubmit() {
  if (!form.value) return
  if (!readingTempFilePath.value || !incomeTempFilePath.value) {
    toast.error('请上传所有必需的截图')
    return
  }

  try {
    submitting.value = true
    const vRes = await form.value.validate()
    if (vRes.valid === false) {
      return
    }

    const formData = {
      lastReadingNum: Number(model.lastReadingNum),
      lastIncome: Number(model.lastIncome),
      incomeOfMonth: Number(model.incomeOfMonth),
      accountId: model.accountId,
    }

    const files = {
      reading: readingTempFilePath.value,
      income: incomeTempFilePath.value,
    }

    const { contentType, data } = await createFormData(formData, files)

    const result = await uni.request({
      url: 'https://www.jiesiyunmei.cn:9099/agency/ldd/upload',
      method: 'POST',
      header: {
        'Content-Type': contentType,
      },
      data,
    })

    // Using type assertion instead of ts-expect-error
    const response = result.data as any
    if (response && typeof response === 'object' && 'code' in response) {
      if (response.code === 1) {
        toast.success('提交成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } else {
        throw new Error(response.msg || '提交失败')
      }
    } else {
      throw new Error('服务器返回数据格式错误')
    }
  } catch (error: any) {
    console.error('提交失败:', error)
    toast.error(error.message || '提交失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.header-section {
  position: relative;
  padding: 40rpx 30rpx;
  margin: 24rpx;
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.gradient-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(135deg, #4d80f0 0%, #6c9cf5 100%);
  opacity: 0.06;
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.header-text {
  margin-left: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
}

.subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.form-card {
  position: relative;
  margin: 24rpx 24rpx 0;
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-header {
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  background-color: #f8f8f8;
}

.form-body {
  padding: 24rpx;
}

.custom-form-item {
  display: flex;
  padding: 0 0 12rpx;
  margin-top: 24rpx;
}

.form-label {
  width: 140rpx;
  padding-top: 4rpx;
  font-size: 28rpx;
  color: #333;
}

.upload-content {
  flex: 1;
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 200rpx;
  cursor: pointer;
  background: #f8f8f8;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
}

.upload-placeholder {
  color: #999;
  text-align: center;
}

.iconfont {
  font-size: 48rpx;
  &.icon-screenshot::before {
    content: '📲';
  }
  &.icon-close::before {
    content: '✕';
  }
}

.upload-text {
  margin-top: 12rpx;
  font-size: 24rpx;
}

.image-preview {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
  border-radius: 12rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  font-size: 24rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.upload-tip {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}

.submit-tip {
  margin: 32rpx 0;
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.submit-section {
  margin: 0 24rpx;
}

.submit-btn {
  height: 88rpx;
  font-size: 32rpx;
  background: linear-gradient(135deg, #4d80f0 0%, #6c9cf5 100%) !important;
  border: none !important;
  border-radius: 44rpx !important;
}
/* 修复样式部分 */
:deep(.wd-select-picker__popup),
:deep(.wd-calendar__popup) {
  position: fixed !important;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
}

:deep(.wd-action-sheet__modal),
:deep(.wd-picker__modal),
:deep(.wd-calendar__modal) {
  position: fixed !important;
  z-index: 998;
}

:deep(.wd-input) {
  padding: 0;
}

:deep(.wd-cell__title) {
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-input__label),
:deep(.wd-select-picker__label) {
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-calendar__label) {
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-input__input) {
  height: 88rpx;
  padding-left: 16rpx;
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-select-picker__value) {
  padding-left: 16rpx;
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-calendar__value) {
  padding-left: 16rpx;
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-cell) {
  padding: 24rpx !important;
}

:deep(.wd-switch__button) {
  background: #4d80f0 !important;
}

:deep(.wd-button--primary:not(:disabled):active) {
  opacity: 0.9;
}
/* 添加必填标识的样式 */
:deep(.wd-input__label--required)::before,
:deep(.wd-select-picker__label--required)::before,
:deep(.wd-calendar__label--required)::before {
  margin-right: 4rpx;
  color: #fa4350;
  content: '*';
}

:deep(.wd-input__input::placeholder) {
  font-size: 26rpx;
  color: #999;
}

:deep(.wd-calendar__item--selected) {
  background-color: #4d80f0 !important;
}

:deep(.wd-switch) {
  margin-left: -8rpx;
  transform: scale(0.9);
}
/* 添加错误提示样式 */
:deep(.wd-form__error-message) {
  margin-top: 4rpx;
  font-size: 24rpx;
  color: #fa4350;
}
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6rpx;
  height: 6rpx;
}

::-webkit-scrollbar-track {
  background: #f8f8f8;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
