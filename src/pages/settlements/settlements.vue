<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '结算列表',
  },
}
</route>
<template>
  <view class="articles">
    <wd-card v-for="(item, index) in articles" :key="item.id">
      <view class="article-title">
        <view class="flex">
          <view class="flex-1">{{ item.title }}</view>
          <view class="flex-[0_0_30%]">
            <wd-button size="small" @click="clickDownload(item)">开始结算</wd-button>
          </view>
        </view>
      </view>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

const show = ref(false)
const downloadFilePath = ref('')

const handleClose = () => {
  show.value = false
}

const shareDownFile = () => {
  console.log('shareDownFile')
  uni.shareFileMessage({
    filePath: downloadFilePath.value,
    success(res) {
      show.value = false
      toast.success('文件保存成功')
    },
    fail(res) {
      console.log('shareFileMessage失败', res)
    },
  })
}

interface article {
  title: string
  id: string
}

const articles = ref([
  {
    title: '十月上半月收益',
    id: '1',
  },
  {
    title: '十月下半月收益',
    id: '2',
  },
  {
    title: '十一月上半月收益',
    id: '3',
  },
])

let clickDownload = function (article: article) {
  // item.report = trues
  uni.navigateTo({ url: '/pages/income/income' })
}

// 弹窗提示并分享文件
const onShareFile = (content) => {
  prepareFileToShare(content)
  //   uni.showModal({
  //     title: '提示',
  //     content: '请分享到文件传输助手',
  //     success: (res) => {
  //       if (res.confirm) {
  //         prepareFileToShare(content)
  //       }
  //     },
  //   })
}

// 准备文件分享
const prepareFileToShare = (content) => {
  downloadFilePath.value = `${wx.env.USER_DATA_PATH}/file.txt`
  console.log('prepareFileToShare', downloadFilePath.value)
  // 将文件内容写入本地文件系统
  uni.getFileSystemManager().writeFile({
    filePath: downloadFilePath.value,
    data: content,
    encoding: 'utf8',
    success: () => {
      console.log('writeFile success', downloadFilePath.value)
      show.value = true
      //   shareFile(filePath)
      //   uni.shareFileMessage({
      //     filePath: filePath,
      //     success(res) {
      //       console.log('shareFileMessage成功', res)
      //     },
      //     fail(res) {
      //       console.log('shareFileMessage失败', res)
      //     },
      //   })
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

.downloadToast {
  display: flex;
  flex-direction: column;
}

.downloadToastTip {
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  font-size: 40rpx;
  font-weight: 1000;
  border-bottom: #f5f5f5 solid 4rpx;
}

.downloadToastButton {
  display: flex;
}

.articles {
  :deep(.wd-card__title-content) {
    padding: 15rpx;
  }
  :deep(.wd-popup) {
    border-radius: 20rpx;
  }
}

.article-title {
  width: 100%;
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 1000;
  line-height: 40rpx;
}
</style>
