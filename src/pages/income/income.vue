<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '收益结算',
  },
}
</route>
<template>
  <view class="page-container">
    <page-wraper>
      <wd-message-box />
      <wd-toast />
      <wd-form ref="form" :model="model" :rules="rules">
        <wd-cell-group custom-class="group border-rd-lg" title="结算信息" border>
          <wd-picker
            label="结算方式"
            label-width="140rpx"
            prop="settlementType"
            v-model="model.settlementType"
            :columns="platformList"
            placeholder="请选择结算方式"
            required
          />
          <wd-input
            label="转账订单"
            label-width="140rpx"
            prop="transferOrder"
            required
            clearable
            v-model="model.transferOrder"
            placeholder="复制粘贴转账订单号"
          />
          <wd-input
            label="本期结算收益"
            label-width="140rpx"
            prop="income"
            type="digit"
            required
            clearable
            v-model="model.income"
            placeholder="填写本期分成后收益"
          />
          <wd-input
            label="本期账号收益"
            label-width="140rpx"
            prop="payment"
            type="digit"
            required
            clearable
            v-model="model.payment"
            placeholder="填写本期账号总收益"
          />
        </wd-cell-group>

        <wd-cell-group custom-class="group border-rd-lg" title="订单截图" border>
          <view class="custom-form-item">
            <text class="form-label">上传结算单</text>
            <view class="upload-content">
              <view
                class="upload-area"
                @click="chooseImage('settlement')"
                v-if="!settlementImageUrl"
              >
                <view class="upload-placeholder">
                  <view class="iconfont icon-screenshot"></view>
                  <view class="upload-text">上传截图</view>
                </view>
              </view>
              <view class="image-preview" v-else>
                <image :src="settlementImageUrl" mode="aspectFill" class="preview-image" />
                <view class="delete-btn" @click.stop="deleteImage('settlement')">
                  <view class="iconfont icon-close"></view>
                </view>
              </view>
              <view class="upload-tip">请上传结算单</view>
            </view>
          </view>

          <view class="custom-form-item mt-4" v-if="model.settlementType !== 'NO_NEED_PAY'">
            <text class="form-label">上传转账截图</text>
            <view class="upload-content">
              <view class="upload-area" @click="chooseImage('payment')" v-if="!paymentImageUrl">
                <view class="upload-placeholder">
                  <view class="iconfont icon-screenshot"></view>
                  <view class="upload-text">上传截图</view>
                </view>
              </view>
              <view class="image-preview" v-else>
                <image :src="paymentImageUrl" mode="aspectFill" class="preview-image" />
                <view class="delete-btn" @click.stop="deleteImage('payment')">
                  <view class="iconfont icon-close"></view>
                </view>
              </view>
              <view class="upload-tip">请上传转账截图</view>
            </view>
          </view>
        </wd-cell-group>

        <view class="tip">请确保上传的截图清晰可见，包含必要信息</view>
        <view class="footer">
          <wd-button type="primary" size="large" @click="handleSubmit" block>提交审核</wd-button>
        </view>
      </wd-form>
    </page-wraper>
  </view>
</template>
<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { isArray } from 'wot-design-uni/components/common/util'
import type { ColPickerColumnChange } from 'wot-design-uni/components/wd-col-picker/types'
import { type FormInstance, type FormRules } from 'wot-design-uni/components/wd-form/types'
import type { UploadFileItem } from 'wot-design-uni/components/wd-upload/types'
import { onLoad } from '@dcloudio/uni-app'
import { uploadImage, commitSettlement } from '@/service/index/foo'

import { reactive, ref } from 'vue'

const settlementImageUrl = ref<string>('')
const paymentImageUrl = ref<string>('')
const settlementTempFilePath = ref<string>('')
const paymentTempFilePath = ref<string>('')

const model = reactive<{
  id: string
  accountId: string
  income: number
  settlementType: 'ALI_PAY' | 'WECHAT' | 'OTHER' | 'NO_NEED_PAY'
  transferOrder: string
  payment: number
}>({
  id: '',
  accountId: '',
  income: 0,
  settlementType: 'ALI_PAY',
  transferOrder: '',
  payment: 0,
})

const rules: FormRules = {
  settlementType: [
    {
      required: true,
      message: '请选择结算方式',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请选择结算方式'))
        }
      },
    },
  ],
  transferOrder: [
    {
      required: true,
      message: '请输入转账订单号',
      validator: (value) => {
        if (model.settlementType === 'NO_NEED_PAY') {
          return Promise.resolve()
        }
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请输入转账订单号'))
        }
      },
    },
  ],
  income: [
    {
      required: true,
      message: '请输入本期结算收益',
      validator: (value) => {
        if (value >= 0) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('结算收益不能为负数'))
        }
      },
    },
  ],
  payment: [
    {
      required: true,
      message: '请输入本期账号收益',
      validator: (value) => {
        if (value >= 0) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('账号收益不能为负数'))
        }
      },
    },
  ],
}

const platformList = ref([
  { value: 'ALI_PAY', label: '支付宝' },
  { value: 'WECHAT', label: '微信' },
  { value: 'OTHER', label: '其他' },
  { value: 'NO_NEED_PAY', label: '无需支付' },
])

const toast = useToast()
const form = ref<FormInstance>()

async function chooseImage(type: 'settlement' | 'payment') {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    const uploadRes = await uploadImage({
      filePath: res.tempFilePaths[0],
      type: 'SETTLEMENT',
    })

    if (type === 'settlement') {
      settlementImageUrl.value = uploadRes
      settlementTempFilePath.value = uploadRes
    } else {
      paymentImageUrl.value = uploadRes
      paymentTempFilePath.value = uploadRes
    }
  } catch (error) {
    console.error('选择或上传图片失败:', error)
    toast.error('图片上传失败')
  }
}

function deleteImage(type: 'settlement' | 'payment') {
  if (type === 'settlement') {
    settlementImageUrl.value = ''
    settlementTempFilePath.value = ''
  } else {
    paymentImageUrl.value = ''
    paymentTempFilePath.value = ''
  }
}

async function handleSubmit() {
  try {
    const { valid } = await form.value!.validate()
    if (!valid) return

    if (!settlementTempFilePath.value) {
      toast.error('请上传结算单')
      return
    }

    if (model.settlementType !== 'NO_NEED_PAY' && !paymentTempFilePath.value) {
      toast.error('请上传转账截图')
      return
    }

    const params = {
      id: model.id,
      income: parseFloat(model.income.toString()),
      settlementType: model.settlementType,
      transferOrder: model.settlementType === 'NO_NEED_PAY' ? '' : model.transferOrder,
      payment: parseFloat(model.payment.toString()),
      paymentImg: model.settlementType === 'NO_NEED_PAY' ? '' : paymentTempFilePath.value || '',
      settlementOrder: settlementTempFilePath.value || '',
    }

    await commitSettlement(params)
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error: any) {
    toast.error(error.message || '提交失败')
  }
}

function handleIconClick() {
  toast.info('优惠券提示信息')
}

onLoad((options: any) => {
  model.id = options?.id || ''
  model.accountId = options?.accountId || ''

  if (!model.id || !model.accountId) {
    toast.error('参数错误')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>
<style lang="scss" scoped>
.wot-theme-dark {
  .inline-txt {
    color: dark;
  }
}
.inline-txt {
  display: inline-block;
  margin: 0 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  vertical-align: middle;
}
:deep(.group) {
  padding: 20rpx 0;
  margin-top: 12px;
}
.tip {
  margin: 10px 15px 21px;
  font-size: 12px;
  color: #999;
}
.footer {
  padding: 0 25px 21px;
}
:deep(.label-class) {
  font-size: 12px !important;
  color: #999 !important;
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

.mt-4 {
  margin-top: 16rpx;
}
</style>
@wot-design-uni/components/wd-form/type
