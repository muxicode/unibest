import { http } from '@/utils/http'
export interface IFooItem {
  id: string
  name: string
}

/** 请求示例 */
export const getFooAPI = (name: string) => {
  return http.get<IFooItem>('/foo', { name })
}

export const postFooAPI = (name: string) => {
  return http.post<IFooItem>('/foo', { name }, { name })
}
/** 请求示例 */

/** 登录注册相关 */
export interface LoginResult {
  token: string
  userId: string
  userName: string
  userType: string
  inviteCode: string
}

export interface PhoneLoginParams {
  code: string
  phone: string
  VerificationCode: string
  inviteCode: string
  userName: string
}

export interface UserInfo {
  userName: string
}

export const register = (registerInfo: PhoneLoginParams) => {
  return http.post<LoginResult>('/agency/user/register', registerInfo)
}

export const loginJieSi = (code: string) => {
  return http.get<LoginResult>('/agency/user/login', { code })
}

export const getUserInfo = () => {
  return http.get<UserInfo>('/agency/user/info')
}

export const phoneCode = (phone: string) => {
  return http.post<IFooItem>('/agency/phone/code', { phone })
}

/** 登录注册相关 */

/** 获取赛道列表 */
export interface TracksInfo {
  trackId: string
  trackName: string
  description: string
  num: number
}

export const getTracks = () => {
  return http.get<TracksInfo[]>('/agency/tracks')
}

/** 获取赛道列表 */

/** 获取账号列表 */

/** 账户结算状态 */
export interface AccountSettlementStatus {
  isFinish: boolean
  isUsePublicAccount: boolean
  isStart: boolean
  lastSettlementDate: string
  lastSettlementPart: string
  firstSettlementPart: string
  msg: string
}

/** 账户信息 */
export interface AccountInfo {
  userId: string
  trackId: string
  platform: string
  phone: string
  accountName: string
  accountId: string
  accountCreateDate: string
  level: number
  downLoadNum: number
  accountStatu: string
  openingFlowDate: string
  isOpenFlow: boolean
  isNeedOpenFlow: boolean
  settlementStatu: AccountSettlementStatus
  unPublishTaskNum?: number
}

export const getAccounts = () => {
  return http.get<AccountInfo[]>('/agency/user/accounts')
}

/** 账户信息 */

/** 结算状态 */
export interface AccountStatus {
  userId: string
  trackId: string
  accountId: string
  accountName: string
  level: number
  downloadNum: number
  accountCreateDate: string
  openingFlowDate: string
  isOpenFlow: boolean
  isNeedOpenFlow: boolean
  isStart: boolean
  startingDate: string
  settlementStatus: AccountSettlementStatus
  status: string
  unPublishTaskNum: number
  isLastUnPublishTaskNumFinish: boolean
  isFinishSettlement: boolean
  unSettlementMsg: string
  tm: string
  date: string
}

export const getAccountsStatus = () => {
  return http.get<AccountStatus[]>('/agency/user/accounts/status')
}

/** 获取账号列表 */

/** 获取文章列表 */
export interface ArticleItem {
  id: string
  trackId: string
  level: number
  title: string
  textAddr: string
  statu: string
  authUser: string
  isDownload: boolean
  version: number
}

export const getArticles = (params: {
  pageNo: number
  pageSize: number
  accountId: string
  keyWord: string
}) => {
  return http.get<ArticleItem[]>('/agency/articles', params)
}
/** 获取文章列表 */

/** 下载文章内容 */
export interface ArticleInfo {
  title: string
  content: string
}

export const downloadArticle = (params: { articleId: string; accountId: string }) => {
  return http.get<ArticleInfo>('/agency/article/download', params)
}
/** 下载文章内容 */

/** 未发布任务项 */
export interface UnpublishedTask {
  id: string
  accountId: string
  accountName: string
  platform: string
  articleId: string
  userId: string
  title: string
  textAddr: string
  articleAddr: string
  tm: string
  date: string
  fillTm: string
}

/** 获取未发布任务列表 */
export const getUnpublishedTasks = () => {
  return http.get<UnpublishedTask[]>('/agency/task/ubpublished')
}

/** 文章信息回填 */
export interface ArticleAddressParams {
  id: string
  accountId: string
  articleAddr: string
}

export const fillArticleAddress = (params: ArticleAddressParams) => {
  return http.put<IFooItem>('/agency/article/adress/filled', params)
}

/** Account Review Sheet */
export interface AccountReviewSheet {
  id: string
  userId: string
  trackId: string
  platform: string
  phone: string
  accountName: string
  accountId: string
  img: string
  isReview: boolean
  status: string
  createTime: string
  reviewer: string
  note: string
}

/** 账号评审参数 */
export interface AccountReviewParams {
  id: string
  status: 'SUCCESS' | 'FAIL'
  note: string
}

/** 评审账号 */
export const reviewAccount = (params: AccountReviewParams) => {
  return http.put<null>('/agency/admin/review/account_sheet', params)
}

export const getAccountReviewSheets = () => {
  return http.get<AccountReviewSheet[]>('/agency/admin/review/account_sheets')
}

/** 更新账号赛道 */
export interface UpdateAccountTrackParams {
  accountId: string
  trackId: string
}

export const updateAccountTrack = (params: UpdateAccountTrackParams) => {
  return http.put<null>('/agency/user/account/track', params)
}

/** 赛道变更审核单 */
export interface AccountTrackReviewSheet {
  id: string
  userId: string
  accountName: string
  accountId: string
  trackId: string
  oldTrackId: string
  status: string
  createTime: string
  isReview: boolean
  reviewer: string
  note: string
}

/** 获取赛道变更审核单列表 */
export const getAccountTrackReviewSheets = (
  reviewStatus: 'UN_REVIEW' | 'REVIEW' | 'ALL' = 'UN_REVIEW',
) => {
  return http.get<AccountTrackReviewSheet[]>('/agency/admin/review/account/track/review_sheets', {
    reviewStatus,
  })
}

/** 赛道变更审核参数 */
export interface AccountTrackReviewParams {
  id: string
  status: 'SUCCESS' | 'FAIL'
  note: string
}

/** 审核赛道变更 */
export const reviewAccountTrack = (params: AccountTrackReviewParams) => {
  return http.put<null>('/agency/admin/review/account/track', params)
}

/** 拒绝任务参数 */
export interface TaskRejectionParams {
  id: string
  reason: string
}

/** 拒绝任务 */
export const rejectTask = (params: TaskRejectionParams) => {
  return http.put<null>('/agency/task/rejection', params)
}

export interface TaskReviewSheet {
  id: string
  taskId: string
  accountId: string
  accountName: string
  platform: string
  userId: string
  title: string
  textAddr: string
  articleDownloadTime: string
  note: string
  reason: string
  status: string
  createTime: string
  isReview: boolean
  reviewer: string
  articleAddr: string
  articleId: string
}

export interface TaskReviewParams {
  id: string
  status: 'SUCCESS' | 'FAIL'
  note?: string
}

// Get task review sheets
export const getTaskReviewSheets = (reviewStatus: 'ALL' | 'REVIEW' | 'UN_REVIEW' = 'UN_REVIEW') => {
  return http.get<TaskReviewSheet[]>('/agency/admin/review/task/rejection/sheets', {
    reviewStatus,
  })
}

// Submit task review
export const reviewTask = (params: TaskReviewParams) => {
  return http.put('/agency/admin/review/task/rejection', params)
}

/** 账号审核进度信息 */
export interface AccountReviewProgress {
  id: string
  userId: string
  trackId: string
  platform: string
  phone: string
  accountName: string
  accountId: string
  isReview: boolean
  status: string
  createTime: string
  reviewer: string
  note: string
}

/** 获取账号审核进度信息 */
export const getAccountReviewProgress = () => {
  return http.get<AccountReviewProgress[]>('/agency/user/account_review_sheet')
}

/**
 * 获取账号审核进度信息
 */
export function getAccountTrackReviewSheet() {
  return http.get<AccountTrackReviewSheet[]>('/agency/user/account/track/review_sheet')
}

// 已完成任务类型定义
export interface PublishedTask {
  id: string
  accountId: string
  accountName: string
  platform: string
  articleId: string
  userId: string
  title: string
  textAddr: string
  articleAddr: string
  tm: string
  date: string
  fillTm: string
}

// 获取已完成任务列表
export function getPublishedTasks() {
  return http.get<PublishedTask[]>('/agency/task/published')
}

// 拒绝任务的接口类型
export interface RejectionTask {
  id: string
  accountId: string
  accountName: string
  platform: string
  articleId: string
  userId: string
  title: string
  textAddr: string
  articleAddr: string
  tm: string
  date: string
  fillTm: string
}

// 获取拒绝任务列表
export function getRejectionTasks() {
  return http.get<RejectionTask[]>('/agency/task/rejection')
}

/** 文章统计信息 */
export interface ArticleStats {
  accountCount: number
  articlesPerDay: number
  additionalArticleCount: number
}

export interface TrackArticleStats {
  trackId: string
  trackName: string
  description: string
  num: number
  articleStats: ArticleStats
}

/** 获取赛道文章统计信息 */
export const getTrackArticleStats = () => {
  return http.post<TrackArticleStats[]>('/agency/third/track/article/stats')
}

/** 结算单状态 */
export type SettlementStatus = 'INIT' | 'COMMIT' | 'FINISH'
export type ReviewStatus = 'NO_REVIEW' | 'FAIL' | 'SUCCESS'

/** 结算单信息 */
export interface Settlement {
  id: string
  settlementStatus: SettlementStatus
  reviewStatus: ReviewStatus
  suggestion: string
  settlementPart: string
  userId: string
  accountId: string
  accountName: string
  platForm: string
  payment: number
  paymentImg: string
  isPublicAccount: boolean
  income: number
  settlementStatement: string
  commitTime: string
  proportion: number
  settlementType: string
  transferOrder: string
}

/** 获取结算单列表参数 */
export interface GetSettlementsParams {
  accountId: string
  status?: SettlementStatus
}

/** 提交结算信息参数 */
export interface CommitSettlementParams {
  id: string
  income: number
  settlementType: 'ALI_PAY' | 'WECHAT' | 'OTHER' | 'NO_NEED_PAY'
  transferOrder: string
  payment: number
  paymentImg: string
  settlementOrder: string
  note: string
}

/** 获取结算单列表 */
export const getSettlements = (params: GetSettlementsParams) => {
  return http.get<Settlement[]>('/agency/user/account/settlements', params)
}

/** 提交结算信息 */
export const commitSettlement = (params: CommitSettlementParams) => {
  return http.post<null>('/agency/user/account/settlement/commit', params)
}

/** 图片上传参数 */
export interface UploadImageParams {
  filePath: string
  type: 'LDD' | 'SETTLEMENT'
}

/** 每日数据上传参数 */
export interface UploadDailyDataParams {
  lastReadingNum: number
  lastIncome: number
  incomeOfMonth: number
  accountId: string
  readingImg: string
  incomeImg: string
}

/** 上传图片 */
export async function uploadImage(params: { filePath: string; type: string }) {
  try {
    const res = await uni.uploadFile({
      url: `https://www.jiesiyunmei.cn:9099/agency/inner/img/upload?type=${params.type}`,
      filePath: params.filePath,
      name: 'img',
      formData: {},
    })

    if (res.statusCode !== 200) {
      throw new Error('上传失败')
    }

    const data = JSON.parse(res.data)
    if (data.code !== 1) {
      throw new Error(data.msg || '上传失败')
    }

    return data.data
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}

/** 上传每日数据 */
export const uploadDailyData = (params: UploadDailyDataParams) => {
  return http.post<null>('/agency/ldd/upload', params)
}

// 获取结算单列表
export function getUserSettlements(status?: string) {
  return http.get<Settlement[]>('/agency/user/settlements', {
    params: {
      status,
    },
  })
}

/** 结算单系统参考收入数据 */
export interface SysReferenceIncome {
  referenceIncome: number
  referencePayment: number
  dataCompleteStatus: string
  ldd: {
    lastReadingNum: number
    lastFinishReadingNum: number
    lastIncome: number
    incomeOfMonth: number
    readingImg: string
    incomeImg: string
    userId: string
    dateTime: string
    accountId: string
    accountName: string
    platform: string
    feedbackDate: string
  }
  note: string
  isFinishLastLdd: boolean
  totalDayIncome: number
}

/** 结算单分期信息 */
export interface SettlementPeriod {
  year: number
  month: number
  part: string
  settlementPart: string
}

/** 管理员查看的结算单信息 */
export interface AdminSettlement extends Settlement {
  sp: SettlementPeriod
  createTime: string
  reviewTime: string
  reviewer: string
  sysReferenceIncome: SysReferenceIncome
  proportionPayment: number
  publicAccountBankCard: string
  userPublicBankCard?: string
  userPublicBankCardType?: string
  companyPublicBandCard?: string
  companyPublicBandCardType?: string
  platformIncome?: number
  settlementOrder?: string
}

/** 获取管理员结算单列表参数 */
export interface GetAdminSettlementsParams {
  status?: SettlementStatus
}

/** 结算单审核参数 */
export interface ReviewSettlementParams {
  id: string
  reviewStatus: ReviewStatus
  suggestion: string
}

/** 获取管理员结算单列表 */
export const getAdminSettlements = (params?: GetAdminSettlementsParams) => {
  return http.get<AdminSettlement[]>('/agency/admin/settlements', params)
}

/** 审核结算单 */
export const reviewSettlement = (params: ReviewSettlementParams) => {
  return http.post<null>('/agency/admin/account/settlement/review', params)
}
