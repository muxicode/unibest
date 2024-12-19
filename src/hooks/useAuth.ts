import { computed } from 'vue'
import { useUserStore } from '@/store'

export function useAuth() {
  const userStore = useUserStore()
  const isLogined = computed(() => userStore.isLogined)

  const redirectLogin = (currentPath: string) => {
    const loginRoute = '/pages/login/index'
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(currentPath)}`
    uni.redirectTo({ url: redirectRoute })
  }

  return {
    isLogined,
    redirectLogin,
  }
}
