<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '邀请结算审核',
  },
}
</route>
<template>
  <view class="settlements">
    <!-- 图片预览组件 -->
    <view v-if="previewVisible" class="preview-overlay" @click="closePreview">
      <view class="preview-content" @click.stop>
        <view class="preview-header">
          <wd-icon name="close" class="preview-close-icon" @click="closePreview"></wd-icon>
        </view>
        <image class="preview-image" :src="currentPreviewImage" mode="widthFix" />
      </view>
    </view>

    <!-- 结算对话框 -->
    <view v-if="settlementDialogVisible" class="dialog-overlay" @click="closeSettlementDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-header">
          <text class="dialog-title">邀请结算确认</text>
          <wd-icon name="close" class="dialog-close-icon" @click="closeSettlementDialog"></wd-icon>
        </view>
        <view class="dialog-body">
          <wd-form ref="form" :model="formModel" :rules="formRules">
            <wd-picker
              label="结算方式"
              v-model="formModel.settlementType"
              :columns="settlementTypeOptions"
              placeholder="请选择结算方式"
              required
              prop="settlementType"
            />
            <wd-input
              label="转账单号"
              v-model="formModel.transferOrder"
              placeholder="请输入转账单号"
              required
              prop="transferOrder"
              v-if="formModel.settlementType !== 'NO_NEED_PAY'"
            />
            <wd-input
              label="支付金额"
              v-model="formModel.payment"
              type="digit"
              placeholder="请输入支付金额"
              required
              prop="payment"
            />
            <view class="upload-section">
              <view class="upload-label">
                <text>上传转账截图</text>
                <text class="required-mark">*</text>
              </view>
              <view class="upload-content">
                <view class="upload-area" @click="chooseImage" v-if="!formModel.paymentImg">
                  <view class="upload-placeholder">
                    <view class="iconfont icon-screenshot"></view>
                    <view class="upload-text">上传截图</view>
                  </view>
                </view>
                <view class="image-preview" v-else>
                  <image :src="formModel.paymentImg" mode="aspectFill" class="preview-image" />
                  <view class="delete-btn" @click.stop="deleteImage">
                    <view class="iconfont icon-close"></view>
                  </view>
                </view>
                <view class="upload-tip">请上传转账截图，确保包含转账单号</view>
              </view>
            </view>
          </wd-form>
        </view>
        <view class="dialog-footer">
          <button class="dialog-btn cancel-btn" @click="closeSettlementDialog">取消</button>
          <button
            class="dialog-btn confirm-btn"
            :disabled="confirmLoading"
            :class="{ 'is-loading': confirmLoading }"
            @click="confirmSettlement"
          >
            <text>确认结算</text>
            <view v-if="confirmLoading" class="dialog-loading-icon"></view>
          </button>
        </view>
      </view>
    </view>

    <view class="settlement-card">
      <view class="card-header">
        <view class="header-left">
          <text class="title">邀请结算</text>
          <text class="subtitle">
            {{ currentStatus === 'INIT' ? '未结算' : '已结算' }}
            {{ settlements.length }}个结算单
          </text>
        </view>
        <view class="status-selector">
          <view
            v-for="option in statusOptions"
            :key="option.value"
            class="status-option"
            :class="{ active: currentStatus === option.value }"
            @click="handleStatusChange(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <view class="settlement-list">
        <view v-for="item in settlements" :key="item.id" class="settlement-item">
          <view class="settlement-icon" :class="'platform-user'">
            <text class="platform-text">邀</text>
          </view>

          <view class="settlement-content">
            <view class="settlement-main">
              <view class="settlement-info">
                <text class="settlement-name">用户ID: {{ item.userId }}</text>
                <view class="tag-group">
                  <text class="tag status-tag" :class="getStatusClass(item.settlementStatus)">
                    {{ SETTLEMENT_STATUS_TEXT[item.settlementStatus] }}
                  </text>
                  <text class="tag period-tag">{{ item.sp }}</text>
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
                <view class="detail-item">
                  <text class="detail-label">结算时间</text>
                  <text class="detail-value">{{ formatDate(item.createTime) }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">用户ID</text>
                  <text class="detail-value">{{ item.userId }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">总收入</text>
                  <text class="detail-value highlight">
                    ¥{{ item.totalInviteUserInCome?.toFixed(2) || '0.00' }}
                  </text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">分成比例</text>
                  <text class="detail-value">{{ (item.inviteProportion * 100).toFixed(0) }}%</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">支付金额</text>
                  <text class="detail-value highlight">
                    ¥{{ item.payment?.toFixed(2) || '0.00' }}
                  </text>
                </view>
                <view v-if="item.settlementType" class="detail-item">
                  <text class="detail-label">结算方式</text>
                  <text class="detail-value">
                    {{ SETTLEMENT_TYPE_TEXT[item.settlementType] || '未设置' }}
                  </text>
                </view>
                <view v-if="item.transferOrder" class="detail-item">
                  <text class="detail-label">转账单号</text>
                  <text class="detail-value">{{ item.transferOrder }}</text>
                </view>

                <!-- 邀请用户列表 -->
                <view v-if="item.userIncomes?.length" class="detail-item user-incomes">
                  <text class="detail-label">邀请明细</text>
                  <view class="details-section">
                    <view class="details-header" @click="toggleUserDetails(item.id)">
                      <text class="detail-text">
                        {{ expandedItems.includes(item.id) ? '收起' : '展开查看' }}
                      </text>
                      <wd-icon
                        name="arrow-down"
                        v-if="!expandedItems.includes(item.id)"
                        size="28"
                      />
                      <wd-icon name="arrow-up" v-else size="28" />
                    </view>

                    <view class="invite-details" v-if="expandedItems.includes(item.id)">
                      <view
                        class="invite-item"
                        v-for="(user, index) in item.userIncomes"
                        :key="index"
                      >
                        <view class="invite-header">
                          <text class="invite-user">用户ID: {{ user.userId }}</text>
                          <text class="invite-income">
                            ¥{{ user.income?.toFixed(2) || '0.00' }}
                          </text>
                        </view>
                        <view v-if="user.note" class="invite-note">
                          <text>备注: {{ user.note }}</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <view v-if="currentStatus === 'INIT'" class="action-group">
                <button
                  class="action-btn settle-btn"
                  :class="{ 'is-loading': loadingMap[item.id] }"
                  :disabled="loadingMap[item.id]"
                  @click="handleSettle(item)"
                >
                  <text>结算</text>
                  <view v-if="loadingMap[item.id]" class="action-loading-icon"></view>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- No data placeholder -->
      <view v-if="settlements.length === 0" class="empty-state">
        <text class="empty-text">
          暂无{{ currentStatus === 'INIT' ? '待结算' : '已结算' }}的邀请结算单
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from 'vue'
import {
  getAdminInviteSettlements,
  reviewInviteSettlement,
  type InviteSettlement,
  type SettlementStatus,
  type ReviewInviteSettlementParams,
  uploadImage,
} from '@/service/index/foo'
import { useToast } from 'wot-design-uni'
import { type FormInstance, type FormRules } from 'wot-design-uni/components/wd-form/types'

const toast = useToast()
// 状态文本映射
const SETTLEMENT_STATUS_TEXT: Record<string, string> = {
  INIT: '未结算',
  FINISH: '已结算',
}

// 状态类名映射
const SETTLEMENT_STATUS_CLASS: Record<string, string> = {
  INIT: 'status-init',
  FINISH: 'status-finish',
}

// 结算方式文本映射
const SETTLEMENT_TYPE_TEXT: Record<string, string> = {
  ALI_PAY: '支付宝',
  WECHAT: '微信',
  OTHER: '其他',
  NO_NEED_PAY: '无需支付',
}

// 获取状态类名
const getStatusClass = (status: string) => SETTLEMENT_STATUS_CLASS[status] || ''

// 所有结算单
const settlements = ref<InviteSettlement[]>([])
// 加载状态映射
const loadingMap = ref<Record<string, boolean>>({})

// 分类选项
const statusOptions = [
  { label: '未结算', value: 'INIT' },
  { label: '已结算', value: 'FINISH' },
]

// 当前选中的状态
const currentStatus = ref<'INIT' | 'FINISH'>('INIT')

// 可展开项ID列表
const expandedItems = ref<string[]>([])

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

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '暂无'
  try {
    const date = new Date(dateStr.replace(' ', 'T'))
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${month}/${day} ${hours}:${minutes}`
  } catch (error) {
    return '日期格式错误'
  }
}

// 切换用户详情展示
const toggleUserDetails = (id: string) => {
  const index = expandedItems.value.indexOf(id)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(id)
  }
}

// 获取结算单列表
const fetchSettlements = async () => {
  try {
    // Convert currentStatus to SettlementStatus type explicitly
    const status = currentStatus.value as SettlementStatus
    const res = await getAdminInviteSettlements(status)
    if (res.code === 1) {
      settlements.value = res.data || []
    } else {
      toast.error(res.msg || '获取结算单列表失败')
    }
  } catch (error) {
    toast.error('获取结算单列表失败')
  }
}

// 切换状态
const handleStatusChange = (status: string) => {
  if (status === 'INIT' || status === 'FINISH') {
    currentStatus.value = status
    fetchSettlements()
  }
}

// 结算对话框状态
const settlementDialogVisible = ref(false)
const confirmLoading = ref(false)
const currentSettlementItem = ref<InviteSettlement | null>(null)
const form = ref<FormInstance>()

// 结算方式选项
const settlementTypeOptions = [
  { value: 'ALI_PAY', label: '支付宝' },
  { value: 'WECHAT', label: '微信' },
  { value: 'OTHER', label: '其他' },
  { value: 'NO_NEED_PAY', label: '无需支付' },
]

// 表单数据
const formModel = reactive<{
  settlementType: 'ALI_PAY' | 'WECHAT' | 'OTHER' | 'NO_NEED_PAY'
  transferOrder: string
  payment: number | ''
  paymentImg: string
}>({
  settlementType: 'ALI_PAY',
  transferOrder: '',
  payment: '',
  paymentImg: '',
})

// 表单验证规则
const formRules: FormRules = {
  settlementType: [{ required: true, message: '请选择结算方式' }],
  transferOrder: [
    {
      required: true,
      message: '请输入转账单号',
      validator: (val) => {
        if (formModel.settlementType === 'NO_NEED_PAY') {
          return Promise.resolve()
        }
        return val ? Promise.resolve() : Promise.reject(new Error('请输入转账单号'))
      },
    },
  ],
  payment: [{ required: true, message: '请输入支付金额' }],
}

// 打开结算对话框
const handleSettle = (item: InviteSettlement) => {
  currentSettlementItem.value = item
  // 预填写支付金额为应付金额
  const suggestedPayment = item.totalInviteUserInCome
    ? item.totalInviteUserInCome * item.inviteProportion
    : 0

  formModel.payment = suggestedPayment
  formModel.settlementType = 'ALI_PAY'
  formModel.transferOrder = ''
  formModel.paymentImg = ''

  settlementDialogVisible.value = true
}

// 关闭结算对话框
const closeSettlementDialog = () => {
  settlementDialogVisible.value = false
  currentSettlementItem.value = null
}

// 上传图片
const chooseImage = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    const uploadRes = await uploadImage({
      filePath: res.tempFilePaths[0],
      type: 'SETTLEMENT',
    })

    formModel.paymentImg = uploadRes
  } catch (error) {
    console.error('选择或上传图片失败:', error)
    toast.error('图片上传失败')
  }
}

// 删除图片
const deleteImage = () => {
  formModel.paymentImg = ''
}

// 确认结算
const confirmSettlement = async () => {
  if (!currentSettlementItem.value) return

  try {
    // 表单验证
    const { valid } = await form.value!.validate()
    if (!valid) return

    // 检查转账截图是否上传
    if (formModel.settlementType !== 'NO_NEED_PAY' && !formModel.paymentImg) {
      toast.error('请上传转账截图')
      return
    }

    // 提交结算
    confirmLoading.value = true

    const params: ReviewInviteSettlementParams = {
      id: currentSettlementItem.value.id,
      payment:
        typeof formModel.payment === 'number' ? formModel.payment : parseFloat(formModel.payment),
      paymentImg: formModel.settlementType === 'NO_NEED_PAY' ? 'NO_NEED_PAY' : formModel.paymentImg,
      settlementType: formModel.settlementType,
      transferOrder:
        formModel.settlementType === 'NO_NEED_PAY' ? 'NO_NEED_PAY' : formModel.transferOrder,
    }

    const res = await reviewInviteSettlement(params)
    if (res.code === 1) {
      toast.success('结算成功')
      closeSettlementDialog()
      fetchSettlements()
    } else {
      throw new Error(res.msg || '结算失败')
    }
  } catch (error: any) {
    toast.error(error.message || '结算失败')
  } finally {
    confirmLoading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchSettlements()
})
</script>

<style lang="scss" scoped>
// 重用变量
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

// 平台颜色
$user-color: #9254de;

// 状态颜色
$status-init: #faad14;
$status-finish: $success-color;

// 动画相关
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.action-loading-icon {
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

.action-btn.is-loading .action-loading-icon {
  opacity: 1;
}

.dialog-loading-icon {
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

.dialog-footer .dialog-btn.confirm-btn.is-loading .dialog-loading-icon {
  opacity: 1;
}

// 页面样式
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
  justify-content: space-between;
  padding: $spacing-xl;
  border-bottom: 2rpx solid $border-color;

  .header-left {
    display: flex;
    align-items: center;

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

  .status-selector {
    display: flex;
    gap: 16rpx;
    padding: 4rpx;
    background: $background-color;
    border-radius: 8rpx;

    .status-option {
      padding: 8rpx 16rpx;
      font-size: 24rpx;
      color: $text-secondary;
      cursor: pointer;
      border-radius: 6rpx;
      transition: all 0.3s ease;

      &.active {
        color: $primary-color;
        background: #ffffff;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      }

      &:hover {
        color: $primary-color;
      }
    }
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

  &.platform-user {
    background-color: $user-color;
    box-shadow: 0 4rpx 16rpx rgba($user-color, 0.16);
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

    .action-loading-icon {
      opacity: 1;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background: rgba($primary-color, 0.6);
    box-shadow: none;
  }

  &.settle-btn {
    background: $success-color;
    box-shadow: 0 2rpx 8rpx rgba($success-color, 0.2);

    &:active {
      box-shadow: 0 1rpx 4rpx rgba($success-color, 0.15);
    }

    &:disabled {
      background: rgba($success-color, 0.6);
    }
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
  background: #f8f8f8;
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

    .preview-close-icon {
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

// 结算对话框
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
  width: 90%;
  max-width: 700rpx;
  max-height: 90vh;
  overflow: hidden;
  overflow-y: auto;
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

  .dialog-close-icon {
    font-size: 36rpx;
    color: $text-secondary;
  }
}

.dialog-body {
  padding: 32rpx;
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

        .dialog-loading-icon {
          opacity: 1;
        }
      }
    }
  }
}

// 上传组件样式
.upload-section {
  padding: 16rpx 0;
  margin-top: 20rpx;
}

.upload-label {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: $text-primary;

  .required-mark {
    margin-left: 4rpx;
    color: $error-color;
  }
}

.upload-content {
  margin-bottom: 16rpx;
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: 240rpx;
  cursor: pointer;
  background: #f8f8f8;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
}

.upload-placeholder {
  color: #999;
  text-align: center;
}

.iconfont {
  font-size: 48rpx;
  &.icon-screenshot::before {
    content: '📲';
  }
  &.icon-close::before {
    content: '✕';
  }
}

.upload-text {
  margin-top: 12rpx;
  font-size: 24rpx;
}

.image-preview {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  overflow: hidden;
  border-radius: 12rpx;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  font-size: 24rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.upload-tip {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}

// 邀请用户列表样式
.user-incomes {
  flex-direction: column;
  align-items: flex-end;
}

.details-section {
  width: 100%;
  margin-top: 12rpx;
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8rpx 0;
  cursor: pointer;

  .detail-text {
    margin-right: 8rpx;
    font-size: 24rpx;
    color: $primary-color;
  }

  &:active {
    opacity: 0.8;
  }
}

.invite-details {
  padding-top: 16rpx;
  margin-top: 12rpx;
  border-top: 1rpx dashed #eee;
}

.invite-item {
  padding: 16rpx;
  margin-bottom: 16rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.invite-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.invite-user {
  font-size: 26rpx;
  font-weight: 500;
  color: $text-primary;
}

.invite-income {
  font-size: 26rpx;
  font-weight: 500;
  color: $primary-color;
}

.invite-note {
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.users-list {
  width: 100%;
  margin-top: 16rpx;
}

.user-item {
  display: flex;
  flex-direction: column;
  padding: 12rpx;
  margin-bottom: 16rpx;
  background: rgba($background-color, 0.6);
  border-radius: 8rpx;

  .user-id {
    font-size: 24rpx;
    color: $text-primary;
  }

  .user-income {
    margin-top: 4rpx;
    font-size: 24rpx;
    color: $primary-color;
  }

  .user-note {
    margin-top: 4rpx;
    font-size: 22rpx;
    color: $text-secondary;
  }
}
</style>
