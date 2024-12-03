<route lang="json5">
{
  style: {
    navigationBarTitleText: '隐私条款',
  },
}
</route>

<template>
  <view class="bg-white min-h-screen">
    <!-- 内容区域 -->
    <scroll-view scroll-y class="pb-60">
      <view class="px-4 py-6">
        <!-- 标题区域 -->
        <view class="text-center mb-8">
          <view class="text-2xl font-bold">【惠州杰思文化传媒有限公司】隐私权政策</view>
          <view class="text-sm text-gray-500 mt-2">版本更新日期：2024年4月17日</view>
        </view>

        <!-- 前言部分 -->
        <view class="mb-8">
          <view class="text-sm leading-6">
            本政策适用于【惠州杰思文化传媒有限公司】("我们"或"公司")提供的服务及相关服务("本产品")，旨在说明在您使用本产品时，我们将如何处理您的个人信息，以及您对这些个人信息享有的权利。
          </view>
          <view class="text-sm leading-6 mt-4">
            请仔细阅读本政策并确定理解我们对您个人信息的处理规则。阅读过程中，如对本政策内容有任何疑问、意见或建议，您可按照本政策中提供的联系方式与我们联系。如您不理解或不同意本政策中的任何条款，您应立即停止使用。一旦您开始使用本产品，即表示您已充分理解并同意本政策。
          </view>
        </view>

        <!-- 主体内容 -->
        <wd-collapse v-model="activeName" accordion>
          <!-- 信息收集和使用 -->
          <wd-collapse-item title="一、我们如何收集和使用您的个人信息" name="1">
            <view class="text-sm leading-7">
              <view class="font-bold mb-2">(一) 您需要授权我们收集和使用您个人信息的场景</view>
              <view class="bg-gray-50 rounded-lg p-4">
                <view class="grid grid-cols-3 gap-2 font-bold mb-2">
                  <text>收集的信息</text>
                  <text>使用目的</text>
                  <text>收集场景</text>
                </view>
                <view class="grid grid-cols-3 gap-2">
                  <text>账号注册信息</text>
                  <text>用户识别</text>
                  <text>注册/登录</text>
                </view>
                <view class="grid grid-cols-3 gap-2">
                  <text>手机号码</text>
                  <text>登录验证</text>
                  <text>注册/登录</text>
                </view>
                <view class="grid grid-cols-3 gap-2">
                  <text>身份信息</text>
                  <text>收益获取</text>
                  <text>签约合同</text>
                </view>
              </view>

              <view class="font-bold mt-4 mb-2">(二) 您可以选择授权提供个人信息的场景</view>
              <view class="pl-4">
                您可以通过访问您所依托的移动应用程序(微信)的隐私设置逐项查看您的系统权限的开启状态，并可以设置权限的开启或关闭。
              </view>

              <view class="font-bold mt-4 mb-2">(三) 征得同意的例外</view>
              <view class="pl-4">
                <view class="mb-2">在以下情形中，我们收集、使用个人信息无需征得您的授权同意：</view>
                <view class="mb-1">• 与国家安全、国防安全有关的；</view>
                <view class="mb-1">• 与公共安全、公共卫生、重大公共利益有关的；</view>
                <view class="mb-1">• 与犯罪侦查、起诉、审判和判决执行等有关的；</view>
                <view class="mb-1">
                  • 出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                </view>
                <view class="mb-1">• 所收集的个人信息是个人信息主体自行向社会公众公开的；</view>
                <view class="mb-1">
                  •
                  从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道。
                </view>
              </view>
            </view>
          </wd-collapse-item>

          <!-- 信息共享、转让和公开披露 -->
          <wd-collapse-item title="二、我们如何共享、转让、公开披露您的个人信息" name="2">
            <view class="text-sm leading-7">
              <view class="font-bold mb-2">(一) 共享</view>
              <view class="pl-4 mb-4">我们不会与第三方共享您的个人信息，但以下情况除外：</view>
              <view class="pl-4">
                <view class="mb-2">• 在获取明确同意的情况下共享；</view>
                <view class="mb-2">• 根据法律法规规定或行政、司法机关的要求；</view>
                <view class="mb-2">• 与授权合作伙伴共享必要信息。</view>
              </view>

              <view class="font-bold mt-4 mb-2">(二) 转让</view>
              <view class="pl-4 mb-4">
                我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
              </view>
              <view class="pl-4">
                <view class="mb-2">• 事先获得您明确的同意或授权；</view>
                <view class="mb-2">• 根据法律法规要求；</view>
                <view class="mb-2">• 涉及合并、收购、资产转让或类似的交易。</view>
              </view>

              <view class="font-bold mt-4 mb-2">(三) 公开披露</view>
              <view class="pl-4 mb-4">我们仅会在以下情况下，公开披露您的个人信息：</view>
              <view class="pl-4">
                <view class="mb-2">• 获得您明确同意或基于您的主动选择；</view>
                <view class="mb-2">• 基于法律法规、法律程序、诉讼或政府主管部门强制性要求。</view>
              </view>
            </view>
          </wd-collapse-item>

          <!-- 存储和保护 -->
          <wd-collapse-item title="三、我们如何存储和保护您的个人信息" name="3">
            <view class="text-sm leading-7">
              <view class="font-bold mb-2">(一) 存储</view>
              <view class="pl-4 mb-4">
                <view class="mb-2">
                  1.
                  存储地域范围：我们在中华人民共和国境内收集和产生的个人信息将存储在中华人民共和国境内。
                </view>
                <view class="mb-2">
                  2. 存储期限：我们只会在达成本政策所述目的所需的期限内保留您的个人信息。
                </view>
              </view>

              <view class="font-bold mt-4 mb-2">(二) 保护措施</view>
              <view class="pl-4">
                <view class="mb-2">
                  1. 我们已采取符合业界标准、合理可行的安全防护措施保护您的个人信息。
                </view>
                <view class="mb-2">
                  2.
                  我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击。
                </view>
                <view class="mb-2">
                  3. 我们会部署访问控制机制，确保只有授权人员才可访问个人信息。
                </view>
              </view>
            </view>
          </wd-collapse-item>

          <!-- 信息管理 -->
          <wd-collapse-item title="四、您如何管理个人信息" name="4">
            <view class="text-sm leading-7">
              <view class="font-bold mb-2">(一) 访问和更正您的个人信息</view>
              <view class="pl-4 mb-4">
                您有权访问和更正您的个人信息，法律法规规定的例外情况除外。
              </view>

              <view class="font-bold mt-4 mb-2">(二) 删除您的个人信息</view>
              <view class="pl-4 mb-4">在以下情形中，您可以向我们提出删除个人信息的请求：</view>
              <view class="pl-4">
                <view class="mb-2">1. 如果我们处理个人信息的行为违反法律法规；</view>
                <view class="mb-2">2. 如果我们收集、使用您的个人信息，却未征得您的明确同意；</view>
                <view class="mb-2">3. 如果我们处理个人信息的行为严重违反了与您的约定；</view>
                <view class="mb-2">4. 如果您不再使用我们的产品或服务；</view>
                <view class="mb-2">5. 如果我们停止为您提供产品或服务。</view>
              </view>

              <view class="font-bold mt-4 mb-2">(三) 注销账号</view>
              <view class="pl-4">
                您可以通过本政策"如何联系我们"部分提供的联系方式申请注销账号。
              </view>
            </view>
          </wd-collapse-item>

          <!-- 未成年人保护 -->
          <wd-collapse-item title="五、未成年人的个人信息保护" name="5">
            <view class="text-sm leading-7">
              <view class="pl-4">
                <view class="mb-4">
                  本声明所指的儿童是指不满14周岁的个人。如果没有父母或监护人的同意，儿童不得创建自己的用户账户。如您为未成年人的，建议您请您的父母或监护人仔细阅读本隐私声明，并在征得您的父母或监护人同意的前提下使用我们的服务或向我们提供信息。
                </view>
                <view class="mb-4">
                  对于经父母或监护人同意使用我们的产品或服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。
                </view>
                <view>
                  如果我们发现自己在未事先获得可证实的父母同意的情况下收集了儿童的个人信息，则会设法尽快删除相关数据。
                </view>
              </view>
            </view>
          </wd-collapse-item>

          <!-- 通知和修订 -->
          <wd-collapse-item title="六、通知和修订" name="6">
            <view class="text-sm leading-7">
              <view class="pl-4">
                <view class="mb-4">
                  我们的隐私权声明可能变更。未经您明确同意，我们不会限制您按照本隐私权政策所应享有的权利。我们会在我们专门页面上发布对隐私权政策所做的任何变更。
                </view>

                <view class="mb-2">本声明所指的重大变更包括但不限于：</view>
                <view class="mb-2">
                  1.
                  我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
                </view>
                <view class="mb-2">
                  2. 我们在控制权等方面发生重大变化。如并购重组等引起的信息控制者变更等；
                </view>
                <view class="mb-2">3. 个人信息共享、转让或公开披露的主要对象发生变化；</view>
                <view class="mb-2">4. 您参与个人信息处理方面的权利及其行使方式发生重大变化；</view>
                <view class="mb-2">
                  5. 我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化；
                </view>
                <view class="mb-4">6. 个人信息安全影响评估报告表明存在高风险。</view>

                <view>您可以通过"【我的-隐私权政策】"中查看本政策的最新版本。</view>
              </view>
            </view>
          </wd-collapse-item>

          <!-- 联系方式 -->
          <wd-collapse-item title="七、如何联系我们" name="7">
            <view class="text-sm leading-7">
              <view class="pl-4">
                <view class="mb-4">
                  本政策提及的可能需要与我们取得联系的情况下，或您对本政策内容有任何疑问、意见或建议的，您可以通过以下方式联系我们：
                </view>
                <view class="bg-gray-50 rounded-lg p-4 mt-2">
                  <view class="mb-2">• 小程序页面联系客服</view>
                  <view>• 邮箱：contact@jiesi.com</view>
                </view>
              </view>
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>
    </scroll-view>

    <!-- 底部按钮区域 -->
    <view
      v-if="showButtons"
      class="fixed bottom-0 left-0 right-0 flex justify-between px-4 py-3 bg-white shadow-sm"
    >
      <wd-button type="warning" class="w-40!" @click="handleDisagree">不同意</wd-button>
      <wd-button type="primary" class="w-40!" @click="handleAgree">同意</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 控制底部按钮的显示
const showButtons = ref(true)
// 当前展开的折叠面板
const activeName = ref('1')

// 获取页面参数
onLoad((options: any) => {
  showButtons.value = options?.showButtons !== 'false'
})

const handleAgree = () => {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

const handleDisagree = () => {
  uni.navigateBack()
}
</script>
