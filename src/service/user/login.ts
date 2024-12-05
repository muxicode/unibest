import { http } from '@/utils/http'

export interface LoginResult {
  token: string
  openId: string
}

export interface CodeLoginParams {
  code: string
}

export interface PhoneLoginParams {
  code: string
  phone: string
  phoneCode: string
  inviteCode?: string
}

/** 获取手机验证码 */
export const getVerificationCodeAPI = (phone: string) => {
  return http.get<void>('/sms/code', { phone })
}

/** 手机号登录 */
export const phoneLoginAPI = (data: PhoneLoginParams) => {
  return http.post<LoginResult>('/user/login', data)
}
