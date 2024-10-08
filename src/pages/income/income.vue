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
  <view class="upload">
    <wd-form ref="form" :model="model">
      <view class="head"></view>
      <wd-cell-group custom-class="group" title="账号XXXXX" border>
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
          placeholder="填写转账订单号"
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
          placeholder="本期分成后收益"
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
          placeholder="本期账号总收益"
          @clicksuffixicon="handleIconClick"
        />
        <wd-cell title="上传结算单" prop="fileList" required>
          <wd-upload
            style="display: inline-block"
            :file-list="model.fileList"
            action="https://ftf.jd.com/api/uploadImg"
            @change="handleFileChange"
          ></wd-upload>
        </wd-cell>
        <wd-cell title="上传转账截图(含订单号)" prop="fileList" required>
          <wd-upload
            style="display: inline-block"
            :file-list="model.fileList"
            action="https://ftf.jd.com/api/uploadImg"
            @change="handleFileChange"
          ></wd-upload>
        </wd-cell>
      </wd-cell-group>
      <view class="footer">
        <wd-button type="primary" size="large" @click="handleSubmit" block>主要按钮</wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { type FormInstance, type FormRules } from 'wot-design-uni/components/wd-form/types'

const { success: showSuccess } = useToast()

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: '',
})

const form = ref({})

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

.head {
  height: 20rpx;
}

.footer {
  padding: 12px;
  color: #fff !important;
}

.upload {
  :deep(.wd-cell__left) {
    flex: 0.44;
  }
}
.footer {
  padding: 0 25px 21px;
}
:deep(.label-class) {
  font-size: 12px !important;
  color: #999 !important;
}
</style>
