<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
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
        <wd-button size="small" @click="clickDownload(item)">点击下载</wd-button>
      </template>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface article {
  title: string
  id: string
}

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

let clickDownload = function (article: article) {
  uni.showLoading({ title: '文件获取中...' })

  const fileContent = '打桩文件内容' // 获取txt文件内容

  uni.hideLoading()

  onShareFile(fileContent)
  console.log('clickDownload', article.title)
}

// 弹窗提示并分享文件
const onShareFile = (content) => {
  uni.showModal({
    title: '提示',
    content: '请分享到文件传输助手',
    success: (res) => {
      if (res.confirm) {
        prepareFileToShare(content)
      }
    },
  })
}

// 准备文件分享
const prepareFileToShare = (content) => {
  const filePath = `${wx.env.USER_DATA_PATH}/file.txt`
  console.log('prepareFileToShare', filePath)
  // 将文件内容写入本地文件系统
  uni.getFileSystemManager().writeFile({
    filePath: filePath,
    data: content,
    encoding: 'utf8',
    success: () => {
      console.log('writeFile success', filePath)
      //   shareFile(filePath)
      uni.shareFileMessage({
        filePath: filePath,
        success(res) {
          console.log('shareFileMessage成功', res)
        },
        fail(res) {
          console.log('shareFileMessage失败', res)
        },
      })
    },
    fail: () => {
      uni.showToast({ title: '文件保存失败', icon: 'none' })
    },
  })
}

// 打开文件并调用分享
const shareFile = (filePath) => {
  //   uni.openDocument({
  //     filePath: filePath,
  //     fileType: 'txt',
  //     success: () => {
  //       // 打开微信分享菜单
  //       uni.showShareMenu({
  //         withShareTicket: true,
  //         success: () => {
  //           console.log('分享菜单已打开')
  //         },
  //         fail: (err) => {
  //           console.error('分享菜单打开失败', err)
  //         },
  //       })
  //     },
  //     fail: (err) => {
  //       console.error('文件打开失败', err)
  //     },
  //   })
}
// const let download = uni.downloadFile({
//     url: '',
//     success: (result)=>{

//     },
//     fail: ()=>{},
//     complete: ()=>{}
// });
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
