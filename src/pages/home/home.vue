<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="home">
    <view class="search" @click="navToSearchPage">
      <wd-search
        custom-class="custom-search"
        hide-cancel
        placeholder-left
        disabled
        placeholder="公众号入门指导手册"
      />
    </view>
    <view class="card-swiper">
      <wd-swiper
        :list="swiperList"
        autoplay
        v-model:current="current"
        :indicator="{ type: 'dots-bar' }"
        @click="handleClick"
        @change="onChange"
      ></wd-swiper>
    </view>
    <view class="content-center">
      <view class="content-center-title">赛道中心</view>
      <view class="home-content-list">
        <view v-for="(item, index) in contentCenterList" :key="index">
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
            <!-- <template #footer>
              <wd-button size="small" plain>查看详情</wd-button>
            </template> -->
          </wd-card>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
//   ----------   轮播图  -------------------
const current = ref<number>(0)

const swiperList = ref([
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
])
function handleClick(e) {
  console.log(e)
}
function onChange(e) {
  console.log(e)
}

function navToSearchPage(value: any) {
  console.log(value)
}

//   ----------   赛道中心  -------------------
const contentCenterList = ref([
  { title: '职场工作', count: 128, info: '职场工作说的是。。。。', hot: '⭐⭐⭐⭐⭐' },
  { title: '情感故事', count: 222, info: '情感生活说的是。。。。', hot: '⭐⭐⭐⭐' },
  { title: '汽车资讯', count: 222, info: '情感生活说的是。。。。', hot: '⭐⭐⭐⭐⭐' },
  { title: '教育高考', count: 222, info: '情感生活说的是。。。。', hot: '⭐⭐⭐' },
])
</script>

<style lang="scss" scoped>
.main-title-color {
  color: #d14328;
}

.home {
  .search {
    margin-bottom: 20rpx;
    :deep(.custom-search) {
      padding: 0;
      border-radius: 38rpx;
    }
    :deep(.wd-search__block) {
      background-color: #fff;
    }
  }
}

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
    padding: 20rpx;
  }
}

.content-center .content-center-title {
  padding-bottom: 10rpx;
  margin: 10rpx 30rpx;
  font-size: 30rpx;
}
</style>
