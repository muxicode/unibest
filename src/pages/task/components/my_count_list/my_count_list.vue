<template>
  <view class="content-center">
    <view class="content-center-title">账号列表</view>
    <view class="home-content-list">
      <view v-for="(item, index) in countList" :key="index">
        <wd-card :title="item.title">
          <view class="content">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              alt="joy"
              style="width: 70px; height: 70px; margin-right: 12px; border-radius: 4px"
            />
            <view>
              <view>{{ item.info }}</view>
              <view>剩余：{{ item.count }}件</view>
              <view>热门指数：{{ item.hot }}</view>
            </view>
          </view>
        </wd-card>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const countList = ref([
  { title: '公众号名称', count: 128, info: '公众号名称简介', hot: '⭐⭐⭐⭐⭐' },
])
</script>

<style lang="scss" scoped>
.content,
.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 24rpx;
}
.content {
  justify-content: flex-start;
}
.title {
  justify-content: space-between;
}
.title-tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
}
.content image {
  margin-right: 12rpx;
  border-radius: 4rpx;
}

.content-center {
  padding: 20rpx 0;
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  :deep(.wd-card) {
    background-color: #f5f5f5;
  }
  :deep(.wd-card__title-content) {
    padding: 10rpx;
  }
}

.content-center .content-center-title {
  padding-bottom: 10rpx;
  margin: 10rpx 30rpx;
  font-size: 30rpx;
}
</style>
