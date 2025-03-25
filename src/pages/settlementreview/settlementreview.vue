<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '结算审核',
  },
}
</route>
<template>
  <view class="settlements">
    <!-- 图片预览组件 -->
    <view v-if="previewVisible" class="preview-overlay" @click="closePreview">
      <view class="preview-content" @click.stop>
        <view class="preview-header">
          <wd-icon name="close" class="close-icon" @click="closePreview"></wd-icon>
        </view>
        <image class="preview-image" :src="currentPreviewImage" mode="widthFix" />
      </view>
    </view>

    <!-- Add rejection dialog -->
    <view v-if="rejectDialogVisible" class="dialog-overlay" @click="closeRejectDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-header">
          <text class="dialog-title">拒绝原因</text>
          <wd-icon name="close" class="close-icon" @click="closeRejectDialog"></wd-icon>
        </view>
        <view class="dialog-body">
          <textarea
            class="reject-note-input"
            v-model="rejectNote"
            placeholder="请输入拒绝原因（必填）"
            maxlength="200"
          ></textarea>
          <text class="char-count">{{ rejectNote.length }}/200</text>
        </view>
        <view class="dialog-footer">
          <button class="dialog-btn cancel-btn" @click="closeRejectDialog">取消</button>
          <button
            class="dialog-btn confirm-btn"
            :disabled="!rejectNote.trim() || confirmLoading"
            :class="{ 'is-loading': confirmLoading }"
            @click="confirmReject"
          >
            <text>确认</text>
            <view v-if="confirmLoading" class="loading-icon"></view>
          </button>
        </view>
      </view>
    </view>

    <view class="settlement-card">
      <view class="card-header">
        <text class="title">结算审核</text>
        <text class="subtitle">待审核{{ pendingSettlements.length }}个结算单</text>
      </view>

      <view class="settlement-list">
        <view v-for="item in pendingSettlements" :key="item.id" class="settlement-item">
          <view class="settlement-icon" :class="getPlatformClass(item.platForm)">
            <text class="platform-text">{{ getPlatformText(item.platForm) }}</text>
          </view>

          <view class="settlement-content">
            <view class="settlement-main">
              <view class="settlement-info">
                <text class="settlement-name">{{ item.accountName }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.settlementStatus)">
                    {{ SETTLEMENT_STATUS_TEXT[item.settlementStatus] }}
                  </text>
                  <text class="tag period-tag">{{ item.settlementPart }}</text>
                </view>
              </view>
            </view>

            <view class="settlement-actions">
              <view class="settlement-details">
                <view v-if="item.paymentImg" class="detail-item">
                  <text class="detail-label">付款截图</text>
                  <view class="settlement-image" @click="previewImage(item.paymentImg)">
                    <image class="thumbnail" :src="item.paymentImg" mode="aspectFit" />
                  </view>
                </view>
                <view v-if="item.settlementOrder" class="detail-item">
                  <text class="detail-label">结算单截图</text>
                  <view class="settlement-image" @click="previewImage(item.settlementOrder)">
                    <image class="thumbnail" :src="item.settlementOrder" mode="aspectFit" />
                  </view>
                </view>
                <view class="detail-item">
                  <text class="detail-label">账号ID</text>
                  <text class="detail-value">{{ item.accountId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">用户ID</text>
                  <text class="detail-value">{{ item.userId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">收入金额</text>
                  <text class="detail-value highlight">¥{{ item.income.toFixed(2) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">支付金额</text>
                  <text class="detail-value highlight">¥{{ item.payment.toFixed(2) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">结算方式</text>
                  <text class="detail-value">
                    {{ SETTLEMENT_TYPE_TEXT[item.settlementType] || '未设置' }}
                  </text>
                </view>
                <view v-if="item.transferOrder" class="detail-item">
                  <text class="detail-label">转账单号</text>
                  <text class="detail-value">{{ item.transferOrder }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">比例</text>
                  <text class="detail-value">{{ (item.proportion * 100).toFixed(0) }}%</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">参考收入</text>
                  <text class="detail-value">
                    ¥{{ (item.sysReferenceIncome?.referenceIncome || 0).toFixed(2) }}
                  </text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">参考支付</text>
                  <text class="detail-value">
                    ¥{{ item.sysReferenceIncome?.referencePayment.toFixed(2) || '未设置' }}
                  </text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">数据完整性</text>
                  <text
                    class="detail-value"
                    :class="getDataCompleteClass(item.sysReferenceIncome?.dataCompleteStatus)"
                  >
                    {{ DATA_COMPLETE_TEXT[item.sysReferenceIncome?.dataCompleteStatus] || '未知' }}
                  </text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">提交时间</text>
                  <text class="detail-value">{{ formatDate(item.commitTime) }}</text>
                </view>
                <view v-if="item.settlementStatement" class="detail-item statement-item">
                  <text class="detail-label">结算说明</text>
                  <text class="detail-value statement-text">{{ item.settlementStatement }}</text>
                </view>
              </view>

              <view class="action-group">
                <button
                  class="action-btn approve-btn"
                  :class="{ 'is-loading': loadingMap[`${item.id}-approve`] }"
                  :disabled="loadingMap[`${item.id}-approve`]"
                  @click="handleApprove(item)"
                >
                  <text>通过</text>
                  <view v-if="loadingMap[`${item.id}-approve`]" class="loading-icon"></view>
                </button>
                <button
                  class="action-btn reject-btn"
                  :class="{ 'is-loading': loadingMap[`${item.id}-reject`] }"
                  :disabled="loadingMap[`${item.id}-reject`]"
                  @click="handleReject(item)"
                >
                  <text>拒绝</text>
                  <view v-if="loadingMap[`${item.id}-reject`]" class="loading-icon"></view>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- No data placeholder -->
      <view v-if="pendingSettlements.length === 0" class="empty-state">
        <text class="empty-text">暂无待审核的结算单</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  getAdminSettlements,
  reviewSettlement,
  type AdminSettlement,
  type ReviewSettlementParams,
} from '@/service/index/foo'

const SETTLEMENT_STATUS_TEXT: Record<string, string> = {
  INIT: '待提交',
  COMMIT: '待审核',
  FINISH: '已完成',
  // Add any other statuses that might appear in your data
}

const SETTLEMENT_STATUS_CLASS: Record<string, string> = {
  INIT: 'status-init',
  COMMIT: 'status-commit',
  FINISH: 'status-finish',
}

const SETTLEMENT_TYPE_TEXT: Record<string, string> = {
  ALI_PAY: '支付宝',
  WECHAT: '微信',
  OTHER: '其他',
  NO_NEED_PAY: '无需支付',
}

const DATA_COMPLETE_TEXT: Record<string, string> = {
  COMPLETE: '完整',
  NO_COMPLETE: '不完整',
}

const DATA_COMPLETE_CLASS: Record<string, string> = {
  COMPLETE: 'data-complete',
  NO_COMPLETE: 'data-incomplete',
}

const getPlatformText = (platform: string) => {
  const map: Record<string, string> = {
    公众号: '公',
    视频号: '视',
    小程序: '程',
  }
  return map[platform] || '未'
}

const getPlatformClass = (platform: string) => {
  const map: Record<string, string> = {
    公众号: 'platform-mp',
    视频号: 'platform-video',
    小程序: 'platform-mini',
  }
  return map[platform] || 'platform-unknown'
}

const getStatusClass = (status: string) => SETTLEMENT_STATUS_CLASS[status] || ''

const getDataCompleteClass = (status: string) => DATA_COMPLETE_CLASS[status] || ''

const allSettlements = ref<AdminSettlement[]>([])
const loadingMap = ref<Record<string, boolean>>({})

// 根据状态获取待审核的结算单
const pendingSettlements = computed(() => {
  return allSettlements.value.filter(
    (item) => item.settlementStatus === 'INIT' || item.settlementStatus === 'COMMIT',
  )
})

// 图片预览状态
const previewVisible = ref(false)
const currentPreviewImage = ref('')

// 预览图片
const previewImage = (imgUrl: string) => {
  currentPreviewImage.value = imgUrl
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  currentPreviewImage.value = ''
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '暂无'
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const fetchSettlements = async () => {
  try {
    const res = await getAdminSettlements()
    if (res.code === 1) {
      console.log('Settlements data:', res.data)
      allSettlements.value = res.data
      console.log('Filtered settlements:', pendingSettlements.value)
    }
  } catch (error) {
    console.error('Failed to fetch settlements:', error)
    uni.showToast({
      title: '获取结算单列表失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

const handleAction = async (
  item: AdminSettlement,
  action: () => Promise<void>,
  type: 'approve' | 'reject',
) => {
  const loadingKey = `${item.id}-${type}`
  if (loadingMap.value[loadingKey]) return

  loadingMap.value[loadingKey] = true
  try {
    await action()
    // 从列表中移除已审核的结算单
    allSettlements.value = allSettlements.value.filter((sheet) => sheet.id !== item.id)
  } finally {
    loadingMap.value[loadingKey] = false
  }
}

const handleApprove = async (item: AdminSettlement) => {
  handleAction(
    item,
    async () => {
      const params: ReviewSettlementParams = {
        id: item.id,
        reviewStatus: 'SUCCESS',
        suggestion: '审核通过',
      }
      const res = await reviewSettlement(params)
      if (res.code === 1) {
        uni.showToast({
          title: '审核通过',
          icon: 'success',
        })
      } else {
        throw new Error(res.msg || '审核失败')
      }
    },
    'approve',
  )
}

// 拒绝对话框状态
const rejectDialogVisible = ref(false)
const rejectNote = ref('')
const currentRejectItem = ref<AdminSettlement | null>(null)
const confirmLoading = ref(false)

// 打开拒绝对话框
const openRejectDialog = (item: AdminSettlement) => {
  currentRejectItem.value = item
  rejectNote.value = '' // 清空之前的拒绝原因
  rejectDialogVisible.value = true
}

// 关闭拒绝对话框
const closeRejectDialog = () => {
  rejectDialogVisible.value = false
  currentRejectItem.value = null
  rejectNote.value = ''
}

// 确认拒绝
const confirmReject = async () => {
  if (!currentRejectItem.value || !rejectNote.value.trim()) return

  confirmLoading.value = true
  try {
    const params: ReviewSettlementParams = {
      id: currentRejectItem.value.id,
      reviewStatus: 'FAIL',
      suggestion: rejectNote.value.trim(),
    }
    console.log('Sending rejection with params:', params)
    const res = await reviewSettlement(params)
    if (res.code === 1) {
      uni.showToast({
        title: '已拒绝',
        icon: 'success',
      })
      // 从列表中移除已审核的结算单
      allSettlements.value = allSettlements.value.filter(
        (sheet) => sheet.id !== currentRejectItem.value?.id,
      )
      closeRejectDialog()
    } else {
      throw new Error(res.msg || '审核失败')
    }
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '操作失败',
      icon: 'none',
    })
  } finally {
    confirmLoading.value = false
  }
}

// 修改原来的拒绝处理函数
const handleReject = (item: AdminSettlement) => {
  openRejectDialog(item)
}

onMounted(() => {
  fetchSettlements()
})
</script>

<style lang="scss" scoped>
// Reuse variables
$primary-color: #1989fa;
$success-color: #07c160;
$warning-color: #faad14;
$error-color: #ff4d4f;
$text-primary: #333333;
$text-secondary: #666666;
$border-color: #f0f0f0;
$background-color: #f5f5f5;
$card-background: #ffffff;
$spacing-xs: 8rpx;
$spacing-sm: 12rpx;
$spacing-md: 16rpx;
$spacing-lg: 20rpx;
$spacing-xl: 32rpx;
$border-radius: 12rpx;

// Platform colors
$mp-color: #07c160;
$video-color: #fa2800;
$mini-color: #07c160;

// Status colors
$status-init: #999999;
$status-commit: $warning-color;
$status-finish: $success-color;

// Inherit base styles from accounts.vue
.settlements {
  min-height: 100vh;
  padding: $spacing-lg;
  background: $background-color;
}

.settlement-card {
  background: $card-background;
  border-radius: $border-radius;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  padding: $spacing-xl;
  border-bottom: 2rpx solid $border-color;

  .title {
    margin-right: $spacing-sm;
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: 0.5rpx;
  }

  .subtitle {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.settlement-list {
  .settlement-item {
    position: relative;
    padding: $spacing-xl $spacing-xl * 1.25 $spacing-xl 160rpx;
    border-bottom: 2rpx solid $border-color;
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background-color: rgba($background-color, 0.5);
    }
  }
}

.settlement-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.settlement-main {
  display: flex;
  flex: 1;
  min-width: 0;
  margin-right: $spacing-xl;
}

.settlement-icon {
  position: absolute;
  top: 50%;
  left: $spacing-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  margin-top: -48rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .platform-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }

  &.platform-mp {
    background-color: $mp-color;
    box-shadow: 0 4rpx 16rpx rgba($mp-color, 0.16);
  }

  &.platform-video {
    background-color: $video-color;
    box-shadow: 0 4rpx 16rpx rgba($video-color, 0.16);
  }

  &.platform-mini {
    background-color: $mini-color;
    box-shadow: 0 4rpx 16rpx rgba($mini-color, 0.16);
  }

  &.platform-unknown {
    background-color: $text-secondary;
    box-shadow: 0 4rpx 16rpx rgba($text-secondary, 0.16);
  }
}

.settlement-info {
  flex: 1;
  min-width: 0;

  .settlement-name {
    margin-bottom: $spacing-xs;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.4;
    color: $text-primary;
    letter-spacing: 0.5rpx;
  }
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.tag {
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-weight: 500;
  border-radius: 6rpx;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &.status-tag {
    &.status-init {
      color: $status-init;
      background: rgba($status-init, 0.08);
    }

    &.status-commit {
      color: $status-commit;
      background: rgba($status-commit, 0.08);
    }

    &.status-finish {
      color: $status-finish;
      background: rgba($status-finish, 0.08);
    }
  }

  &.period-tag {
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
}

.settlement-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  align-items: flex-end;
  min-width: 300rpx;
}

.action-group {
  display: flex;
  gap: $spacing-sm;
}

.action-btn {
  position: relative;
  width: 140rpx;
  height: 64rpx;
  padding: 0;
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  background: $primary-color;
  border: none;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba($primary-color, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  text {
    display: block;
    width: 100%;
    line-height: 64rpx;
    text-align: center;
    transition: opacity 0.2s ease;
  }

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($primary-color, 0.15);
    transform: translateY(1rpx);
  }

  &.is-loading {
    pointer-events: none;

    text {
      opacity: 0;
    }

    .loading-icon {
      opacity: 1;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background: rgba($primary-color, 0.6);
    box-shadow: none;
  }
}

.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32rpx;
  height: 32rpx;
  margin: -16rpx 0 0 -16rpx;
  border: 3rpx solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
  animation: loading 0.8s infinite linear;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Additional styles for settlement review page
.settlement-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
}

.detail-item {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  justify-content: flex-end;

  .detail-label {
    font-size: 22rpx;
    color: $text-secondary;
  }

  .detail-value {
    font-size: 24rpx;
    color: $text-primary;

    &.highlight {
      font-weight: 600;
      color: $primary-color;
    }
  }
}

.approve-btn {
  background: $success-color;
  box-shadow: 0 2rpx 8rpx rgba($success-color, 0.2);

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($success-color, 0.15);
  }

  &:disabled {
    background: rgba($success-color, 0.6);
  }
}

.reject-btn {
  background: $error-color;
  box-shadow: 0 2rpx 8rpx rgba($error-color, 0.2);

  &:active {
    box-shadow: 0 1rpx 4rpx rgba($error-color, 0.15);
  }

  &:disabled {
    background: rgba($error-color, 0.6);
  }
}

// 图片相关样式
.settlement-image {
  position: relative;
  width: 160rpx;
  height: 120rpx;
  margin-left: $spacing-sm;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
  border-radius: $spacing-xs;

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// 预览遮罩层
.preview-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);

  .preview-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    background: #ffffff;
    border-radius: 12rpx;
  }

  .preview-header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
    padding: 24rpx;
    text-align: right;
    background: rgba(248, 248, 248, 0.95);

    .close-icon {
      font-size: 40rpx;
      color: #666;
    }
  }

  .preview-image {
    width: 100%;
    height: auto;
    max-height: calc(90vh - 88rpx);
    margin-top: 88rpx;
    overflow-y: auto;
  }
}

// 对话框样式
.dialog-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.dialog-content {
  width: 80%;
  max-width: 600rpx;
  overflow: hidden;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.12);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid $border-color;

  .dialog-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }

  .close-icon {
    font-size: 36rpx;
    color: $text-secondary;
  }
}

.dialog-body {
  position: relative;
  padding: 32rpx;

  .reject-note-input {
    width: 100%;
    height: 200rpx;
    padding: 16rpx;
    font-size: 28rpx;
    line-height: 1.5;
    color: $text-primary;
    background: $background-color;
    border: 1rpx solid $border-color;
    border-radius: 8rpx;
  }

  .char-count {
    position: absolute;
    right: 40rpx;
    bottom: 40rpx;
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.dialog-footer {
  display: flex;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid $border-color;

  .dialog-btn {
    position: relative;
    flex: 1;
    height: 80rpx;
    margin: 0 8rpx;
    font-size: 28rpx;
    font-weight: 500;
    border: none;
    border-radius: 8rpx;

    &.cancel-btn {
      color: $text-secondary;
      background: $background-color;
    }

    &.confirm-btn {
      color: #ffffff;
      background: $primary-color;

      &:disabled {
        background: rgba($primary-color, 0.6);
      }

      &.is-loading {
        pointer-events: none;

        text {
          opacity: 0;
        }

        .loading-icon {
          opacity: 1;
        }
      }
    }
  }
}

// 结算说明样式
.statement-item {
  flex-direction: column;
  align-items: flex-end;

  .statement-text {
    width: 100%;
    margin-top: $spacing-xs;
    font-size: 24rpx;
    line-height: 1.5;
    color: $text-secondary;
    word-break: break-all;
  }
}

// 空状态
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300rpx;

  .empty-text {
    font-size: 28rpx;
    color: $text-secondary;
  }
}

// 数据完整性状态
.data-complete {
  color: $success-color !important;
}

.data-incomplete {
  color: $warning-color !important;
}
</style>
