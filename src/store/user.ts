import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState = {
  nickname: '赞美我滴god',
  avatar: '',
  avatarUrl:
    'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  token: '11111',
  openid: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)
    const currAuthStep = computed(() => 1)
    const isNeedGetUserInfo = computed(() => !userInfo.value.token)

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      currAuthStep,
      isNeedGetUserInfo,
      reset,
    }
  },
  {
    persist: true,
  },
)
