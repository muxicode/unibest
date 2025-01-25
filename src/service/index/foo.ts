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
}

export interface PhoneLoginParams {
  code: string
  phone: string
  VerificationCode: string
  inviteCode: string
  userName: string
}

export const register = (registerInfo: PhoneLoginParams) => {
  return http.post<LoginResult>('/agency/user/register', registerInfo)
}

export const loginJieSi = (code: string) => {
  return http.get<LoginResult>('/agency/user/login', { code })
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
export interface SettlementStatus {
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
  settlementStatu: SettlementStatus
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
  settlementStatus: SettlementStatus
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

export const getArticles = (params: { pageNo: number; pageSize: number; accountId: string }) => {
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
