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
  <view>
    <page-wraper>
      <wd-message-box />
      <wd-toast />
      <wd-form ref="form" :model="model" :rules="rules">
        <wd-cell-group custom-class="group border-rd-lg" title="职场小精英" border>
          <wd-input
            label="转账订单"
            label-width="100px"
            :maxlength="20"
            show-word-limit
            prop="couponName"
            required
            suffix-icon="warn-bold"
            clearable
            v-model="model.couponName"
            placeholder="复制粘贴转账订单号"
            @clicksuffixicon="handleIconClick"
          />
          <wd-input
            label="本期结算收益"
            label-width="100px"
            :maxlength="20"
            show-word-limit
            prop="couponName"
            required
            suffix-icon="warn-bold"
            clearable
            v-model="model.couponName"
            placeholder="填写本期分成后收益"
            @clicksuffixicon="handleIconClick"
          />
          <wd-input
            label="本期账号收益"
            label-width="100px"
            :maxlength="20"
            show-word-limit
            prop="couponName"
            required
            suffix-icon="warn-bold"
            clearable
            v-model="model.couponName"
            placeholder="填写本期账号总收益"
            @clicksuffixicon="handleIconClick"
          />
        </wd-cell-group>
        <wd-cell-group custom-class="group border-rd-lg" title="订单截图" border>
          <wd-cell title="上传结算单" title-width="100px" prop="fileList">
            <wd-upload
              :file-list="model.fileList"
              action="https://ftf.jd.com/api/uploadImg"
              @change="handleFileChange"
            ></wd-upload>
          </wd-cell>
          <wd-cell title="上传转账截图(含订单号)" title-width="100px" prop="fileList">
            <wd-upload
              :file-list="model.fileList"
              action="https://ftf.jd.com/api/uploadImg"
              @change="handleFileChange"
            ></wd-upload>
          </wd-cell>
        </wd-cell-group>
        <view class="tip">保持平常心，万一发财了呢？</view>
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

import { reactive, ref } from 'vue'

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

const platformList = ref<any>([
  {
    value: '1',
    label: '京东',
  },
  {
    value: '2',
    label: '开普勒',
  },
  {
    value: '3',
    label: '手Q',
  },
  {
    value: '4',
    label: '微信',
  },
  {
    value: '5',
    label: '1号店',
  },
  {
    value: '6',
    label: '十元街',
  },
  {
    value: '7',
    label: '京东极速版',
  },
])
const promotionlist = ref<any[]>([
  {
    value: '1',
    label: '满减',
  },
  {
    value: '2',
    label: '无门槛',
  },
])

const toast = useToast()
const form = ref<FormInstance>()

function handleFileChange({ fileList }: any) {
  model.fileList = fileList
}

function handleSubmit() {
  form
    .value!.validate()
    .then(({ valid, errors }) => {
      console.log(valid)
      console.log(errors)
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

function handleIconClick() {
  toast.info('优惠券提示信息')
}
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
</style>
@wot-design-uni/components/wd-form/type
