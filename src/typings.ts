// 全局要用的类型放到这里

type IResData<T> = {
  code: number
  msg: string
  data: T
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

type IUserInfo = {
  nickname?: string
  avatar?: string
  avatarUrl?: string
  token: string
  userId: string
  userType: string
}

type TabbarInfo = {
  name?: string
  activeIndex: number
}

enum TestEnum {
  A = 'a',
  B = 'b',
}
