import { http } from '@/utils/http'

export interface LoginResult {
  token: string
  openId: string
}

export interface CodeLoginParams {
  code: string
}

export interface PhoneLoginParams {
  phone: string
  code: string
  inviteCode?: string
}

/** 通过code获取openId */
export const getOpenIdAPI = (params: CodeLoginParams) => {
  return http.get<{ openid: string }>('/wx/openid', params)
}

/** 通过openId获取token */
export const getAccessTokenAPI = (openid: string) => {
  return http.get<LoginResult>('/wx/token', { openid })
}

/** 获取手机验证码 */
export const getVerificationCodeAPI = (phone: string) => {
  return http.get<void>('/sms/code', { phone })
}

/** 手机号登录 */
export const phoneLoginAPI = (data: PhoneLoginParams) => {
  return http.post<LoginResult>('/user/login', data)
}
