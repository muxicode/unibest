<template>
  <view class="mb-3 rounded-t-2 bg-white overflow-hidden">
    <wd-cell-group :border="false" v-if="isTop">
      <wd-cell :title="title" :value="desc" is-link @click="onClickTop" />
    </wd-cell-group>
    <view class="overflow-hidden w-full h-164rpx flex bg-white">
      <view
        class="order-group__item overflow-hidden flex flex-auto flex-items-center flex-justify-center flex-col"
        v-for="(item, index) in orderTagInfosRef"
        :key="index"
        @click="() => onClickItem(item)"
      >
        <view class="mb-2 w-56rpx h-56rpx relative">
          <wd-badge :model-value="item.orderNum" :max="99" color="#FF4646">
            <wd-icon
              :name="item.iconName"
              size="56rpx"
              customStyle="background-image: -webkit-linear-gradient(90deg, #6a6a6a 0%,#929292 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
            />
          </wd-badge>
        </view>
        <view class="text-3 line-height-4 text-gray-600">{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue'

const props = defineProps({
  orderTagInfos: {
    type: Array as () => Array<any>,
    default: () => [],
  },
  title: {
    type: String,
    default: '我的订单',
  },
  desc: {
    type: String,
    default: '全部订单',
  },
  isTop: {
    type: Boolean,
    default: true,
  },
})

// 使用 ref 包装变量
const orderTagInfosRef = ref(props.orderTagInfos)
const titleRef = ref(props.title)
const descRef = ref(props.desc)
const isTopRef = ref(props.isTop)
orderTagInfosRef.value.push({
  orderNum: 10,
  iconName: '',
  title: '111',
})

const emit = defineEmits(['onClickTop', 'onClickItem'])

// 定义点击事件处理函数
const onClickItem = (item: any) => {
  emit('onClickItem', item)
}

const onClickTop = () => {
  emit('onClickTop', {})
}
</script>
