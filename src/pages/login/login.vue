<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '注册登录',
  },
}
</route>

<template>
  <view>
    <wd-message-box />
    <wd-toast />
    <wd-form ref="form" :model="model" :rules="rules">
      <wd-cell-group custom-class="group border-rd-lg" title="欢迎加入杰思云媒" border>
        <view class="phone-input-wrapper">
          <wd-input
            class="phone-input"
            label="手机号"
            label-width="100px"
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
            custom-class="code-btn"
            @click="handleGetCode"
          >
            {{ counting ? `${countdown}s` : '验证码' }}
          </wd-button>
        </view>
        <wd-input
          class="code-input"
          label="验证码"
          label-width="100px"
          :maxlength="6"
          show-word-limit
          prop="phoneCode"
          required
          clearable
          v-model="model.phoneCode"
          placeholder="填写手机验证码"
        />
        <wd-input
          class="code-input"
          label="邀请码"
          label-width="100px"
          :maxlength="4"
          show-word-limit
          prop="phoneCode"
          required
          clearable
          v-model="model.phoneCode"
          placeholder="填写邀请码"
        />
      </wd-cell-group>
      <view class="tip">
        <wd-checkbox v-model="read" prop="read" custom-label-class="label-class">
          已阅读并同意
          <text style="color: #4d80f0" @click="showDeal">《隐私政策条款》</text>
        </wd-checkbox>
      </view>
      <view class="footer">
        <wd-button type="primary" size="large" @click="quickLogin" block>一键登录/注册</wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onUnmounted } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { isArray } from '@vue/shared'

interface UploadFileItem {
  url: string
  name?: string
  type?: string
}

interface FormRules {
  [key: string]: {
    required: boolean
    message: string
    pattern?: RegExp
    validator: (value: any) => Promise<void>
  }[]
}

const code = ref('')
const openId = ref('')
const read = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
const counting = ref(false)
const countdown = ref(60)

const showDeal = () => {
  uni.navigateTo({ url: '/pages/deal/deal?showButtons=false' })
}

const quickLogin = () => {
  console.log('quickLogin')
}

const model = reactive<{
  phone: string
  phoneCode: string
  platform: any[]
  promotion: string
  threshold: string
  price: string
  time: number | string
  date: null | number
  address: string[]
  count: number
  content: string
  switchVal: boolean
  cardId: string
  read: boolean
  fileList: UploadFileItem[]
}>({
  phone: '',
  phoneCode: '',
  platform: [],
  promotion: '',
  threshold: '',
  price: '',
  date: null,
  time: '',
  address: [],
  count: 1,
  content: '',
  switchVal: true,
  cardId: '',
  read: false,
  fileList: [],
})

// 验证手机号是否有效
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
    // TODO: 调用获取验证码接口
    // const res = await getVerificationCode(model.phone)

    // 开始倒计时
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

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// 初始化登录
const initLogin = async () => {
  try {
    const loginResult = await uni.login()

    if (loginResult.code) {
      code.value = loginResult.code
      if (openId.value) {
        await getAccessToken(openId.value)
      } else {
        await getOpenId({ code: code.value })
      }
    } else {
      console.log('获取用户登录态失败！' + loginResult.errMsg)
      uni.showToast({
        title: '登录失败',
        icon: 'none',
      })
    }
  } catch (err) {
    console.error('登录失败:', err)
    uni.showToast({
      title: '登录失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

onShow(() => {
  initLogin()
})

const getOpenId = async (parameter) => {
  // try {
  //   const res = await this.$http('getOpenId', parameter)
  //   if (res.success) {
  //     this.setOpenId(res.data.openid)
  //     await getAccessToken(res.data.openid)
  //   } else {
  //     throw new Error('获取openId失败')
  //   }
  // } catch (error) {
  //   console.error('获取openId失败:', error)
  //   throw error
  // }
}

const getAccessToken = async (openId) => {
  // try {
  //   const res = await this.$http('getAccessToken', { openid: openId })
  //   if (res.success) {
  //     if (res.data) {
  //       this.isShowPhone = false
  //       this.setToken(res.data)
  //       this.$reLaunch('/pages/tabbarPage/main')
  //     } else {
  //       this.isShowPhone = true
  //     }
  //   } else {
  //     throw new Error('获取token失败')
  //   }
  // } catch (error) {
  //   console.error('获取token失败:', error)
  //   throw error
  // }
}

const rules: FormRules = {
  phone: [
    {
      required: true,
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      validator: (value) => {
        if (value && /^1[3456789]\d{9}$/.test(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入正确的手机号')
        }
      },
    },
  ],
  phoneCode: [
    {
      required: true,
      pattern: /^\d{6}$/,
      message: '请输入6位数字验证码',
      validator: (value) => {
        if (value && /^\d{6}$/.test(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入6位数字验证码')
        }
      },
    },
  ],
  content: [
    {
      required: true,
      message: '请输入活动细则信息',
      validator: (value) => {
        if (value && value.length > 2) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入活动细则信息')
        }
      },
    },
  ],
  threshold: [
    {
      required: true,
      message: '请输入满减金额',
      validator: (value) => {
        if (value && model.price) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      },
    },
  ],
  platform: [
    {
      required: true,
      message: '请选择推广平台',
      validator: (value) => {
        if (value && isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject('请选择推广平台')
        }
      },
    },
  ],
  promotion: [
    {
      required: true,
      message: '请选择推广平台',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请选择推广平台')
        }
      },
    },
  ],
  time: [
    {
      required: true,
      message: '请选择时间',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请选择时间')
        }
      },
    },
  ],
  date: [
    {
      required: true,
      message: '请选择日期',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      },
    },
  ],
  address: [
    {
      required: true,
      message: '请选择地址',
      validator: (value) => {
        if (isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject('请选择地址')
        }
      },
    },
  ],
  count: [
    {
      required: true,
      message: '发货数量需要大于1',
      validator: (value) => {
        if (Number(value) > 1) {
          return Promise.resolve()
        } else {
          return Promise.reject('发货数量需要大于1')
        }
      },
    },
  ],
  cardId: [
    {
      required: true,
      message: '请输入歪比巴卜',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入歪比巴卜')
        }
      },
    },
  ],
  fileList: [
    {
      required: true,
      message: '请选择活动图片',
      validator: (value) => {
        if (isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      },
    },
  ],
}
</script>

<style lang="scss" scoped>
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
:deep(.group) {
  padding: 20rpx 0;
  margin-top: 12px;
}

.phone-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 12px;

  .phone-input {
    flex: 1;
  }

  .code-btn {
    min-width: 60px;
    height: 28px;
    margin-left: -70px;
    font-size: 12px;
    line-height: 28px;
  }
}

.code-input {
  margin-top: 10px;
}
</style>
