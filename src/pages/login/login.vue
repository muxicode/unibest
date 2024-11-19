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
        <wd-input
          label="手机号"
          label-width="100px"
          :maxlength="20"
          show-word-limit
          prop="couponName"
          required
          suffix-icon="warn-bold"
          clearable
          v-model="model.couponName"
          placeholder="请填写手机号"
          @clicksuffixicon="handleIconClick"
        />
        <wd-input
          label="验证码"
          label-width="100px"
          :maxlength="20"
          show-word-limit
          prop="phoneCode"
          required
          suffix-icon="warn-bold"
          clearable
          v-model="model.couponName"
          placeholder="填写手机验证码"
          @clicksuffixicon="handleIconClick"
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
import { reactive, ref } from 'vue'

import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
const code = ref('')
const openId = ref('')

onShow(() => {
  console.log('login on Show')
  wx.showLoading({
    title: '登录微信用户',
    mask: true,
  })
  uni.login({
    success: (res) => {
      if (res.code) {
        wx.hideLoading()
        code.value = res.code
        // console.log('wx.login获得code成功', res)
        // vuex中的openId/unionId若存在就直接调用获取token接口
        if (openId.value) {
          getAccessToken(openId.value)
        } else {
          getOpenId({ code: code.value })
        }
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    },
    fail(err) {
      wx.hideLoading()
      wx.showToast({
        title: 'wx.login失败' + err,
        icon: 'none',
        duration: 1000,
      })
    },
  })
})

// 获取openid
const getOpenId = function (parameter) {
  uni.showLoading({
    title: '获取openId',
    mask: true,
  })
  const res = this.$http('getOpenId', parameter)
  console.log('获取openId', res)
  wx.hideLoading()
  if (res.success) {
    // 生成唯一值
    this.setOpenId(res.data.openid)
    // console.log('获取openId---值', res.data.openid)
    this.getAccessToken(res.data.openid)
  }
}

// 获取token
const getAccessToken = function (openId) {
  const res = this.$http('getAccessToken', { openid: openId })
  // console.log('获取token', res)
  if (res.success) {
    if (res.data) {
      this.isShowPhone = false
      this.setToken(res.data)
      this.$reLaunch('/pages/tabbarPage/main')
    } else {
      // 是否显示 一键登录按钮
      this.isShowPhone = true
    }
  }
}

const read = ref(false)

const showDeal = () => {
  console.log('showDeal')
  uni.navigateTo({ url: '/pages/deal/deal' })
}
const quickLogin = () => {
  console.log('quickLogin')
}

const model = reactive<{
  couponName: string
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
  phone: string
  read: boolean
  fileList: UploadFileItem[]
}>({
  couponName: '',
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
  phone: '',
  read: false,
  fileList: [],
})

const rules: FormRules = {
  couponName: [
    {
      required: true,
      pattern: /\d{6}/,
      message: '优惠券名称6个字以上',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入优惠券名称')
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
  phone: [
    {
      required: true,
      message: '请输入玛卡巴卡',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject()
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
</style>
