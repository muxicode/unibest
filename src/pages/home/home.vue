<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <view class="home">
    <!-- 轮播图区域 -->
    <view class="banner-area">
      <wd-swiper
        :list="swiperList"
        autoplay
        v-model:current="current"
        :indicator="{ type: 'dots', color: '#fff' }"
        @click="handleSwiperClick"
        @change="handleSwiperChange"
        height="360rpx"
      >
        <template #default>
          <view class="banner-content">
            <view class="banner-title">AI公众号流量主私教课</view>
            <view class="banner-actions">
              <view class="action-item">
                <wd-icon name="plus" size="40rpx" color="#fff" />
                <text>账号分析</text>
              </view>
              <view class="action-item">
                <wd-icon name="close" size="40rpx" color="#fff" />
                <text>提示词胡价</text>
              </view>
              <view class="action-item">
                <wd-icon name="square" size="36rpx" color="#fff" />
                <text>文章排版</text>
              </view>
            </view>
          </view>
        </template>
      </wd-swiper>
    </view>

    <!-- 数据统计区域 -->
    <view class="stats-area">
      <view class="stats-item" @click="handleStatsClick('data')">
        <view class="stats-icon data">
          <image src="/static/home/daily_report.svg" class="stats-svg" mode="aspectFit" />
        </view>
        <text class="stats-text">今日数据</text>
        <view
          class="notification"
          v-show="showDataNotification"
          @click.stop="toggleNotification('data')"
        ></view>
      </view>
      <view class="stats-item" @click="handleStatsClick('income')">
        <view class="stats-icon income">
          <image src="/static/home/income_settlement.svg" class="stats-svg" mode="aspectFit" />
        </view>
        <text class="stats-text">结算收益</text>
        <view
          class="notification income"
          v-show="showIncomeNotification"
          @click.stop="toggleNotification('income')"
        ></view>
      </view>
    </view>

    <!-- 赛道中心 -->
    <view class="track-center">
      <view class="track-card">
        <view class="section-header">
          <text class="section-title">赛道中心</text>
          <text class="section-subtitle">精选优质内容赛道</text>
        </view>
        <view class="track-list">
          <view
            v-for="(item, index) in trackList"
            :key="index"
            class="track-item"
            :class="{ 'first-item': index === 0, 'last-item': index === trackList.length - 1 }"
            @click="handleTrackClick(item)"
          >
            <view class="track-icon-wrapper">
              <image
                :src="item.image || '/static/placeholder.png'"
                class="track-icon"
                mode="aspectFill"
              />
            </view>
            <view class="track-info">
              <view class="info-header">
                <text class="title">{{ item.title }}</text>
                <view class="tag-wrapper">
                  <text class="tag">优选</text>
                </view>
              </view>
              <text class="desc text-truncate">{{ item.desc }}</text>
              <view class="auth-wrapper">
                <text class="auth">剩余授权：</text>
                <text class="auth-number">{{ item.auth }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { loginJieSi } from '@/service/index/foo'

// -------  自动登录 start --------
const loginCode = ref('')
onShow(async () => {
  await wxLogin()
  if (loginCode.value !== '') {
    console.log('code', loginCode.value)
    const res = await loginJieSi(loginCode.value)
    console.log('login res', res)
  }
})

// 微信登录
const wxLogin = async () => {
  try {
    const { code } = await uni.login()
    if (!code) {
      throw new Error('获取登录code失败')
    }
    loginCode.value = code
  } catch (error) {
    uni.showToast({
      title: '获取登录code失败',
      icon: 'none',
    })
  }
}
// -------  自动登录  start ---------

interface TrackItem {
  title: string
  desc: string
  auth: number
  image: string
}

// 轮播图数据
const current = ref<number>(0)
const swiperList = ref<string[]>(['/static/banner/new_tech.svg', '/static/banner/notice.svg'])

// 通知显示控制
const showDataNotification = ref<boolean>(true)
const showIncomeNotification = ref<boolean>(true)

// 轮播图事件
const handleSwiperClick = (e: any) => {
  console.log('Swiper clicked:', e)
}

const handleSwiperChange = (e: any) => {
  console.log('Swiper changed:', e)
}

// 统计按钮点击
const handleStatsClick = (type: 'data' | 'income') => {
  console.log('Stats clicked:', type)
}

// 切换通知显示状态
const toggleNotification = (type: 'data' | 'income') => {
  if (type === 'data') {
    showDataNotification.value = !showDataNotification.value
  } else {
    showIncomeNotification.value = !showIncomeNotification.value
  }
}

// 赛道数据
const trackList = ref<TrackItem[]>([
  {
    title: '家庭情感',
    desc: '情感赛道，奥运会正在火热中，可以剩余授权',
    auth: 55,
    image: '/static/track/family_emotion.svg',
  },
  {
    title: '汽车资讯',
    desc: '优选赛道，文章质量更好。仅支持剩余授权',
    auth: 240,
    image: '/static/track/car_news.svg',
  },
  {
    title: '生肖星座',
    desc: '新号做生肖之前，先去做文案。优选剩余授权',
    auth: 77,
    image: '/static/track/zodiac.svg',
  },
  {
    title: '起号专用',
    desc: '起号赛道，新号必备，10-20天发本剩余授权',
    auth: 64,
    image: '/static/track/new_account.svg',
  },
  {
    title: '体育赛道',
    desc: '体育赛道，奥运会正在火热中，可以剩余授权',
    auth: 55,
    image: '/static/track/sports.svg',
  },
])

// 赛道点击
const handleTrackClick = (item: TrackItem) => {
  console.log('Track clicked:', item)
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background-color: #f7f8fa;

  // 轮播图区域
  .banner-area {
    margin: 20rpx;
    overflow: hidden;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    :deep(.wd-swiper) {
      background-color: #051d3c;
      border-radius: 20rpx;
    }

    .banner-content {
      padding: 40rpx;

      .banner-title {
        margin-bottom: 80rpx;
        font-size: 40rpx;
        font-weight: 600;
        color: #fff;
      }

      .banner-actions {
        display: flex;
        justify-content: space-between;
        padding: 0 40rpx;

        .action-item {
          display: flex;
          flex-direction: column;
          gap: 16rpx;
          align-items: center;
          transition: transform 0.2s ease;

          &:active {
            transform: scale(0.95);
          }

          text {
            font-size: 28rpx;
            color: #fff;
          }
        }
      }
    }
  }

  // 数据统计区域
  .stats-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
    margin: 32rpx 20rpx;

    .stats-item {
      position: relative;
      display: flex;
      gap: 20rpx;
      align-items: center;
      padding: 32rpx;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.98);
      }

      .stats-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 88rpx;
        height: 88rpx;
        border-radius: 16rpx;

        &.data {
          background-color: #52c41a;
        }

        &.income {
          background-color: #ff4d4f;
        }

        .stats-svg {
          width: 100%;
          height: 100%;
        }
      }

      .stats-text {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }

      .notification {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        width: 16rpx;
        height: 16rpx;
        cursor: pointer;
        background: #52c41a;
        border-radius: 50%;
        transition: all 0.3s ease;

        &.income {
          background: #ff4d4f;
        }

        &:active {
          transform: scale(1.2);
        }
      }
    }
  }

  // 赛道中心
  .track-center {
    margin: 0 20rpx;

    .track-card {
      padding: 24rpx;
      background: #fff;
      border-radius: 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .section-header {
        display: flex;
        align-items: baseline;
        padding: 0 12rpx;
        margin-bottom: 32rpx;

        .section-title {
          margin-right: 16rpx;
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
        }

        .section-subtitle {
          font-size: 26rpx;
          color: #999;
        }
      }

      .track-list {
        overflow: hidden;
        border-radius: 16rpx;

        .track-item {
          display: flex;
          gap: 24rpx;
          align-items: flex-start;
          padding: 28rpx 24rpx;
          background: #fff;
          transition: background-color 0.2s ease;

          &:not(:last-child) {
            border-bottom: 2rpx solid #f5f5f5;
          }

          &:active {
            background-color: #f9f9f9;
          }

          .track-icon-wrapper {
            flex-shrink: 0;
            width: 160rpx;
            height: 160rpx;
            overflow: hidden;
            border-radius: 16rpx;

            .track-icon {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .track-info {
            flex: 1;
            min-width: 0; // 确保文本可以正确换行和截断

            .info-header {
              display: flex;
              gap: 12rpx;
              align-items: center;
              margin-bottom: 16rpx;

              .title {
                font-size: 32rpx;
                font-weight: 500;
                color: #333;
              }

              .tag-wrapper {
                flex-shrink: 0;
                padding: 0rpx 12rpx 8rpx 12rpx;
                background: rgba(255, 77, 79, 0.1);
                border-radius: 8rpx;

                .tag {
                  font-size: 24rpx;
                  color: #ff4d4f;
                }
              }
            }

            .desc {
              display: block;
              margin-bottom: 16rpx;
              font-size: 26rpx;
              line-height: 1.6;
              color: #666;
            }

            .auth-wrapper {
              display: flex;
              align-items: baseline;

              .auth {
                font-size: 26rpx;
                color: #999;
              }

              .auth-number {
                font-size: 28rpx;
                font-weight: 500;
                color: #52c41a;
              }
            }
          }
        }
      }
    }
  }
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
