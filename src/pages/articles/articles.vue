<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '文章列表',
  },
}
</route>
<template>
  <view class="articles">
    <wd-card v-for="(item, index) in articles" :key="item.id">
      <view class="article-title">{{ item.title }}</view>
      <template #footer>
        <view style="display: inline-block; margin: 0 10rpx">
          <wd-button size="small">复制标题</wd-button>
        </view>
        <wd-button size="small">点击下载</wd-button>
      </template>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const articles = ref([
  {
    title:
      '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。11111111111111111111111111111111111111111111111111111111111111',
    id: '1',
  },
  {
    title: '鹤断矶头，故人曾到否？旧江山浑是新愁。',
    id: '2',
  },
  {
    title: '黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。',
    id: '3',
  },
])
</script>

<style lang="scss" scoped>
:root {
  --wot-card-bg: #fff;
}

.articles {
  :deep(.wd-card__title-content) {
    padding: 15rpx;
  }
}

.article-title {
  width: 100%;
  height: 80rpx;
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 1000;
  line-height: 40rpx;
}
</style>
