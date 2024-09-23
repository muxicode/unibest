<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '每日上报',
  },
}
</route>
<template>
  <view class="upload">
    <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <view class="p-4 bg-opacity-100">账号名称xxxx</view>
        <wd-input
          label="昨日账号阅读"
          label-width="100px"
          prop="value1"
          clearable
          v-model="model.value1"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <wd-input
          label="昨日账号收益"
          label-width="100px"
          prop="value1"
          clearable
          v-model="model.value1"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <wd-input
          label="本月账号收益"
          label-width="100px"
          prop="value1"
          clearable
          v-model="model.value1"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
      </wd-cell-group>
      <wd-upload
        :file-list="fileList1"
        image-mode="aspectFill"
        :action="action"
        @change="handleChange1"
      ></wd-upload>
      <view class="footer">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'

const { success: showSuccess } = useToast()

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: '',
})

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        showSuccess({
          msg: '校验通过',
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

// 图片上传
const fileList = ref<any[]>([
  {
    url: 'https://img12.360buyimg.com//n0/jfs/t1/29118/6/4823/55969/5c35c16bE7c262192/c9fdecec4b419355.jpg',
  },
])

const action: string =
  'https://mockapi.eolink.com/zhTuw2P8c29bc981a741931bdd86eb04dc1e8fd64865cb5/upload'

function handleChange({ fileList: files }) {
  fileList.value = files
}
</script>

<style lang="scss" scoped>
:root {
  --wot-input-cell-bg: transparent;
  --wot-color-white: transparent;
}

.upload {
  background-color: #fff;
  border-radius: 20rpx;
}

.footer {
  padding: 12px;
}
</style>
