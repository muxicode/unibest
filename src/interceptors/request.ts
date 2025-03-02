/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useUserStore } from '@/store'
import { platform } from '@/utils/platform'
import { useToast } from 'wot-design-uni'

// 组件状态
const toast = useToast()

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = import.meta.env.VITE_SERVER_BASEURL

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 啥都不需要做
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 10000 // 10s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      platform, // 可选，与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }
    // 3. 添加 token 请求头标识
    const userStore = useUserStore()
    const { token, userId } = userStore.userInfo as unknown as IUserInfo
    if (token) {
      options.header.Token = `${token}`
      options.header.UserId = `${userId}`
    }
  },

  // 添加响应拦截
  success(response: UniApp.RequestSuccessCallbackResult) {
    // 假设后端返回格式为 { code: number, msg: string, data: any }
    const { code, msg } = response.data as any

    // 2 表示用户需要重新登陆
    if (code === 2) {
      // 清除用户信息
      const userStore = useUserStore()
      userStore.clearUserInfo()

      // 获取当前页面路径
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const currentPath = `/${currentPage.route}${(currentPage as any).$page?.fullPath.split('?')[1] ? '?' + (currentPage as any).$page.fullPath.split('?')[1] : ''}`

      // 跳转登录页面
      const loginPath = '/pages/login/login'
      uni.redirectTo({
        url: `${loginPath}?redirect=${encodeURIComponent(currentPath)}`,
      })
      return false // 阻止后续处理
    }

    //  3 表示用户需要进行注册
    if (code === 3) {
      // 获取当前页面路径
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const currentPath = `/${currentPage.route}${(currentPage as any).$page?.fullPath.split('?')[1] ? '?' + (currentPage as any).$page.fullPath.split('?')[1] : ''}`

      // 跳转注册页面
      const loginPath = '/pages/deal/deal'
      uni.redirectTo({
        url: `${loginPath}?redirect=${encodeURIComponent(currentPath)}`,
      })
      return false // 阻止后续处理
    }
    if (code === 0) {
      uni.showToast({
        title: msg,
        icon: 'none',
      })
      // 修改这里：不阻止后续处理，而是返回响应，让调用方处理错误
      // 这样下载按钮的加载状态才能被重置
      return response
    }

    return response
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
