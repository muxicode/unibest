<route lang="json5" type="home">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '注册登录',
  },
}
</route>

<template>
  <view class="py-4 px-6">
    <wd-message-box />
    <wd-toast />

    <!-- 欢迎区域 -->
    <view class="mt-4 mb-8">
      <image src="/static/logo.png" alt="" class="w-24 h-24 block mx-auto rounded-3xl shadow-md" />
      <view class="text-center text-xl font-bold text-gray-800 mt-4">杰思云媒</view>
      <view class="text-center text-gray-500 mt-1 text-sm">让内容创作更简单</view>
    </view>

    <wd-form ref="form" :model="model" :rules="rules">
      <!-- 表单卡片 -->
      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <view class="form-body">
          <view class="phone-input-wrapper">
            <wd-input
              class="flex-1"
              label="手机号"
              label-width="140rpx"
              :maxlength="11"
              prop="phone"
              required
              clearable
              v-model="model.phone"
              placeholder="请填写手机号"
            />
            <wd-button
              size="small"
              :type="counting ? 'info' : 'primary'"
              :disabled="counting || !isPhoneValid"
              custom-class="verify-btn"
              @click="handleGetCode"
            >
              {{ counting ? `${countdown}s` : '获取验证码' }}
            </wd-button>
          </view>

          <wd-input
            class="mt-4"
            label="验证码"
            label-width="140rpx"
            :maxlength="6"
            show-word-limit
            prop="phoneCode"
            required
            clearable
            v-model="model.phoneCode"
            placeholder="填写手机验证码"
          />

          <wd-input
            class="mt-4"
            label="邀请码"
            label-width="140rpx"
            :maxlength="6"
            show-word-limit
            prop="inviteCode"
            required
            clearable
            v-model="model.inviteCode"
            placeholder="填写邀请码"
          />
        </view>
      </view>

      <!-- 协议 -->
      <view class="mt-3 flex items-center justify-center agreement-wrapper">
        <wd-checkbox v-model="read" prop="read" custom-label-class="agreement-text">
          <view class="agreement-content">
            <text>我已阅读并同意</text>
            <text class="text-primary mx-1" @click.stop="showDeal">《隐私政策条款》</text>
            <text>和</text>
            <text class="text-primary ml-1" @click.stop="showUserServiceDeal">
              《用户服务协议》
            </text>
          </view>
        </wd-checkbox>
      </view>

      <!-- 按钮 -->
      <view class="mt-6 px-2">
        <wd-button
          type="primary"
          size="large"
          :loading="loading"
          custom-class="submit-btn"
          @click="handleLogin"
          block
        >
          一键登录/注册
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { getVerificationCodeAPI, phoneLoginAPI, type PhoneLoginParams } from '@/service/user/login'
import { onShow } from '@dcloudio/uni-app'

defineOptions({
  name: 'Login',
})

// 表单数据
const curCode = ref('')
const form = ref()
const model = reactive({
  code: '',
  phone: '',
  phoneCode: '',
  inviteCode: '',
})

// 协议阅读状态
const read = ref(false)

// 验证码倒计时
const counting = ref(false)
const countdown = ref(60)
let timer: ReturnType<typeof setInterval> | null = null

// 加载状态
const loading = ref(false)

// 计算手机号是否有效
const isPhoneValid = computed(() => {
  return /^1[3456789]\d{9}$/.test(model.phone)
})

// 获取验证码
const handleGetCode = async () => {
  if (!isPhoneValid.value) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  try {
    await getVerificationCodeAPI(model.phone)
    counting.value = true
    countdown.value = 60
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        counting.value = false
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      }
    }, 1000)
  } catch (error) {
    uni.showToast({
      title: '获取验证码失败',
      icon: 'none',
    })
  }
}

// 微信登录
const wxLogin = async () => {
  try {
    const { code } = await uni.login()
    if (!code) {
      throw new Error('获取登录code失败')
    }
    model.code = code
  } catch (error) {
    uni.showToast({
      title: '获取登录code失败',
      icon: 'none',
    })
  }
}

// 手机号登录
const handleLogin = async () => {
  if (!read.value) {
    uni.showToast({
      title: '请先阅读并同意协议',
      icon: 'none',
    })
    return
  }

  try {
    loading.value = true
    await form.value.validate()

    const params: PhoneLoginParams = {
      code: model.code,
      phone: model.phone,
      phoneCode: model.phoneCode,
      inviteCode: model.inviteCode,
    }

    const res = await phoneLoginAPI(params)
    uni.setStorageSync('token', res.data.token)
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 显示协议
const showDeal = () => {
  uni.navigateTo({ url: '/pages/deal/deal?showButtons=false' })
}

const showUserServiceDeal = () => {
  uni.navigateTo({ url: '/pages/deal/user_service_deal' })
}

// 表单验证规则
const rules = {
  phone: [
    {
      required: true,
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
    },
  ],
  phoneCode: [
    {
      required: true,
      pattern: /^\d{6}$/,
      message: '请输入6位数字验证码',
    },
  ],
  inviteCode: [
    {
      required: true,
      pattern: /^\d{6}$/,
      message: '请输入6位数字邀请码',
    },
  ],
}

// 页面显示时自动登录
onShow(() => {
  wxLogin()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.form-body {
  padding: 24rpx;
}

.phone-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.verify-btn {
  min-width: 160rpx;
  height: 56rpx;
  margin-left: -180rpx;
  font-size: 24rpx;
  line-height: 56rpx;
  border-radius: 28rpx;
}

.submit-btn {
  height: 88rpx;
  font-size: 32rpx;
  border-radius: 44rpx;
}

.agreement-wrapper {
  min-width: 0;
  padding: 0 24rpx;
}

.agreement-content {
  display: inline-flex;
  align-items: center;
  font-size: 20rpx;
  color: #999;
  white-space: nowrap;
}

:deep(.agreement-text) {
  font-size: 18rpx !important;
  line-height: 1;
  color: #999;
}

:deep(.text-primary) {
  color: #4d80f0;
}

:deep(.wd-input) {
  padding: 0;
}

:deep(.wd-checkbox) {
  display: inline-flex;
  align-items: center;
}

:deep(.wd-checkbox__shape) {
  font-size: 24rpx;
  transform: scale(0.8);
}

:deep(.wd-checkbox__label) {
  padding-left: 8rpx;
  line-height: 1;
}
</style>
