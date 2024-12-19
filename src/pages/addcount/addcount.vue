<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '添加账号',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page-container">
    <wd-message-box />
    <wd-toast />

    <!-- 优化后的顶部区域 -->
    <view class="header-section">
      <view class="gradient-bg"></view>
      <view class="header-content">
        <image src="/static/logo.png" alt="" class="logo" />
        <view class="header-text">
          <view class="title">添加账号</view>
          <view class="subtitle">填写账号信息，开始创作之旅</view>
        </view>
      </view>
    </view>

    <wd-form ref="form" :model="model" :rules="rules">
      <!-- 赛道和平台选择 -->
      <view class="form-card">
        <view class="form-body">
          <wd-select-picker
            label="选择赛道"
            label-width="140rpx"
            prop="track"
            v-model="model.track"
            :columns="trackList"
            placeholder="请选择你的赛道"
            required
          />
          <wd-select-picker
            class="mt-4"
            label="选择平台"
            label-width="140rpx"
            prop="platform"
            v-model="model.platform"
            :columns="platformList"
            placeholder="请选择你的平台"
            required
          />
        </view>
      </view>

      <!-- 账号信息 -->
      <view class="form-card">
        <view class="form-header">账号信息</view>
        <view class="form-body">
          <wd-input
            label="账号昵称"
            label-width="140rpx"
            prop="nickname"
            required
            clearable
            v-model="model.nickname"
            placeholder="请输入账号昵称"
          />

          <wd-input
            class="mt-4"
            label="账号ID"
            label-width="140rpx"
            prop="accountId"
            required
            clearable
            v-model="model.accountId"
            placeholder="请输入账号ID"
          />

          <wd-calendar
            class="mt-4"
            label="注册日期"
            label-width="140rpx"
            placeholder="请选择注册日期"
            prop="registerDate"
            v-model="model.registerDate"
            required
          />

          <wd-cell title="是否违规" title-width="140rpx" center class="mt-4">
            <view style="text-align: left">
              <wd-switch v-model="model.isViolation" />
            </view>
          </wd-cell>

          <wd-input
            class="mt-4"
            label="注册手机"
            label-width="140rpx"
            clearable
            v-model="model.phone"
            :maxlength="11"
            placeholder="非必填"
          />

          <!-- 优化后的图片上传区域 -->
          <view class="upload-section">
            <view class="upload-title">账号截图</view>
            <view class="upload-area" @click="chooseImage" v-if="!imageUrl">
              <view class="upload-placeholder">
                <view class="iconfont icon-camera"></view>
                <view class="upload-text">上传截图</view>
              </view>
            </view>
            <view class="image-preview" v-else>
              <image :src="imageUrl" mode="aspectFill" class="preview-image" />
              <view class="delete-btn" @click.stop="deleteImage">
                <view class="iconfont icon-close"></view>
              </view>
            </view>
            <view class="upload-tip">公众助手【我】页面的截图，需要清晰显示账号信息</view>
          </view>
        </view>
      </view>

      <!-- 提示文字 -->
      <view class="submit-tip">审核通过后，文章领取权限自动开通～</view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <wd-button
          type="primary"
          size="large"
          custom-class="submit-btn"
          :loading="submitting"
          @click="handleSubmit"
          block
        >
          提交审核
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { type FormInstance, type FormRules } from 'wot-design-uni/components/wd-form/types'
import { reactive, ref } from 'vue'

interface AccountForm {
  track: string
  platform: string
  nickname: string
  accountId: string
  registerDate: number | null
  isViolation: boolean
  phone: string
}

// 表单数据
const model = reactive<AccountForm>({
  track: '',
  platform: '',
  nickname: '',
  accountId: '',
  registerDate: null,
  isViolation: false,
  phone: '',
})

// 图片相关
const imageUrl = ref<string>('')
const tempFilePath = ref<string>('')

// 表单验证规则
const rules: FormRules = {
  track: [{ required: true, message: '请选择赛道' }],
  platform: [{ required: true, message: '请选择平台' }],
  nickname: [{ required: true, message: '请输入账号昵称' }],
  accountId: [{ required: true, message: '请输入账号ID' }],
  registerDate: [{ required: true, message: '请选择注册日期' }],
}

// 赛道选项
const trackList = ref([
  { value: '1', label: '情感赛道' },
  { value: '2', label: '职场赛道' },
  { value: '3', label: '育儿赛道' },
])

// 平台选项
const platformList = ref([{ value: '1', label: '公众号' }])

const toast = useToast()
const form = ref<FormInstance>()
const submitting = ref(false)

// 选择图片
async function chooseImage() {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    imageUrl.value = res.tempFilePaths[0]
    tempFilePath.value = res.tempFilePaths[0]
  } catch (error) {
    console.error('选择图片失败:', error)
  }
}

// 删除图片
function deleteImage() {
  imageUrl.value = ''
  tempFilePath.value = ''
}

// 格式化日期
function formatDate(timestamp: number | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 提交表单
async function handleSubmit() {
  if (!form.value) return
  if (!tempFilePath.value) {
    toast.error('请上传账号截图')
    return
  }

  try {
    submitting.value = true
    await form.value.validate()

    // 准备表单数据对象
    const formData = {
      track: model.track,
      platform: model.platform,
      nickname: model.nickname,
      accountId: model.accountId,
      registerDate: formatDate(model.registerDate),
      isViolation: String(model.isViolation),
      phone: model.phone || '',
    }

    // 使用uni.uploadFile上传
    const fileRes = await uni.uploadFile({
      url: 'http://192.168.10.135:9099/agency/user/createAccount',
      filePath: tempFilePath.value,
      name: 'account_screenshot',
      formData,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (fileRes.statusCode === 200) {
      toast.success('提交成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      const response = JSON.parse(fileRes.data)
      throw new Error(response.message || '提交失败')
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
.page-container {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background-color: #f8f8f8;
}

.header-section {
  position: relative;
  padding: 40rpx 30rpx;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 200rpx;
  background: linear-gradient(135deg, #4d80f0 0%, #6c9cf5 100%);
  opacity: 0.1;
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

.upload-section {
  margin-top: 24rpx;
}

.upload-title {
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 200rpx;
  cursor: pointer;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  transition: all 0.3s;

  &:active {
    opacity: 0.8;
  }
}

.upload-placeholder {
  color: #999;
  text-align: center;
}

.iconfont {
  font-size: 48rpx;
  &.icon-camera::before {
    content: '📷';
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
  box-shadow: 0 8rpx 16rpx rgba(77, 128, 240, 0.2);
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
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-select-picker__value) {
  font-size: 28rpx;
  color: #333;
}

:deep(.wd-calendar__value) {
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
  transform: translateY(2rpx);
}

.form-enter-active {
  transition: all 0.3s ease-out;
}

.form-enter-from {
  opacity: 0;
  transform: translateY(30rpx);
}

.form-enter-to {
  opacity: 1;
  transform: translateY(0);
}
/* 添加必填标识的样式 */
:deep(.wd-input__label--required)::before,
:deep(.wd-select-picker__label--required)::before,
:deep(.wd-calendar__label--required)::before {
  margin-right: 4rpx;
  color: #fa4350;
  content: '*';
}
/* 添加hover效果 */
.form-card:active {
  transform: scale(0.995);
}
/* 优化placeholder样式 */
:deep(.wd-input__input::placeholder) {
  font-size: 26rpx;
  color: #999;
}
/* 自定义日历样式 */
:deep(.wd-calendar__item--selected) {
  background-color: #4d80f0 !important;
}
/* 优化开关组件大小 */
:deep(.wd-switch) {
  margin-left: -8rpx;
  transform: scale(0.9);
}
/* 添加图片上传的过渡动画 */
.image-preview,
.upload-area {
  transition: all 0.3s ease;
}

.image-preview:active,
.upload-area:active {
  transform: scale(0.98);
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
