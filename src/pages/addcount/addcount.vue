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
      <view class="form-card">
        <view class="form-body">
          <wd-picker
            label="选择赛道"
            label-width="140rpx"
            prop="track"
            v-model="model.track"
            :columns="trackList"
            placeholder="请选择你的赛道"
            required
          />
          <wd-picker
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

          <view class="custom-form-item">
            <text class="form-label">账号截图</text>
            <view class="upload-content">
              <view class="upload-area" @click="chooseImage" v-if="!imageUrl">
                <view class="upload-placeholder">
                  <view class="iconfont icon-screenshot"></view>
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
      </view>

      <view class="submit-tip">审核通过后，文章领取权限自动开通～</view>

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
import { getTracks, type TracksInfo } from '@/service/index/foo'

// Initialize empty trackList
const trackList = ref<{ value: string; label: string }[]>([])

// 页面显示时,自动获取赛道信息
onShow(async () => {
  const tracksRes = await getTracks()
  trackList.value = tracksRes.data.map((track) => ({
    value: track.trackId,
    label: track.trackName,
  }))
})

const tracksInfo = reactive<TracksInfo[]>([])

interface AccountForm {
  track: string
  platform: string
  nickname: string
  accountId: string
  registerDate: number | null
  isViolation: boolean
  phone: string
}

const model = reactive<AccountForm>({
  track: '',
  platform: '',
  nickname: '',
  accountId: '',
  registerDate: null,
  isViolation: false,
  phone: '',
})

const imageUrl = ref<string>('')
const tempFilePath = ref<string>('')

const rules: FormRules = {
  track: [{ required: true, message: '请选择赛道' }],
  platform: [{ required: true, message: '请选择平台' }],
  nickname: [{ required: true, message: '请输入账号昵称' }],
  accountId: [{ required: true, message: '请输入账号ID' }],
  registerDate: [{ required: true, message: '请选择注册日期' }],
}

const platformList = ref([{ value: '公众号', label: '公众号' }])

const toast = useToast()
const form = ref<FormInstance>()
const submitting = ref(false)

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

function deleteImage() {
  imageUrl.value = ''
  tempFilePath.value = ''
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function handleSubmit() {
  if (!form.value) return
  if (!tempFilePath.value) {
    toast.error('请上传账号截图')
    return
  }

  try {
    submitting.value = true
    const vRes = await form.value.validate()
    if (vRes.valid === false) {
      return
    }
    const formData = {
      trackId: model.track,
      platform: model.platform,
      accountName: model.nickname,
      accountId: model.accountId,
      registerDate: formatDate(model.registerDate),
      isViolation: String(model.isViolation),
      phone: model.phone || '',
    }
    const fileRes = await uni.uploadFile({
      url: 'https://www.jiesiyunmei.cn:9099/agency/user/account',
      filePath: tempFilePath.value,
      name: 'img',
      formData,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const response = JSON.parse(fileRes.data)
    if (response.code === 1) {
      toast.success('提交成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else if (response.code === 0) {
      throw new Error(response.msg || '提交失败')
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
// .page-container {
//   min-height: 100vh;
//   padding-bottom: 40rpx;
//   background-color: #f8f8f8;
// }

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
/* 以下是修复样式部分 */
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
