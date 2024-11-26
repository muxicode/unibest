<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationBarTitleText: '隐私条款',
  },
}
</route>

<template>
  <view class="privacy-container">
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <view class="content-wrapper">
        <view class="header">
          <text class="title">【惠州杰思文化传媒有限公司】隐私权政策</text>
          <text class="subtitle">版本更新日期：2024年4月17日</text>
        </view>

        <view class="section">
          <text class="section-text">
            本政策适用于【惠州杰思文化传媒有限公司】("我们"或"公司")提供的服务及相关服务("本产品")，旨在说明在您使用本产品时，我们将如何处理您的个人信息，以及您对这些个人信息享有的权利。
          </text>
          <text class="section-text">
            请仔细阅读本政策并确定理解我们对您个人信息的处理规则。阅读过程中，如对本政策内容有任何疑问、意见或建议，您可按照本政策中提供的联系方式与我们联系。如您不理解或不同意本政策中的任何条款，您应立即停止使用。一旦您开始使用本产品，即表示您已充分理解并同意本政策。
          </text>
          <text class="section-text">
            请注意，我们不控制第三方，本政策在任何情况下均不适用于第三方。第三方对您个人信息的收集与使用将遵守第三方的个人信息保护政策。我们建议您在访问第三方时仔细阅读并了解他们的个人信息政策。
          </text>
        </view>

        <view class="section">
          <text class="section-title">本隐私声明将帮助您了解以下内容：</text>
          <view class="section-list">
            <text class="list-item">一、我们如何收集和使用您的个人信息</text>
            <text class="list-item">二、我们如何共享、转让、公开披露您的个人信息</text>
            <text class="list-item">三、我们如何存储和保护您的个人信息</text>
            <text class="list-item">四、您如何管理个人信息</text>
            <text class="list-item">五、未成年人的个人信息保护</text>
            <text class="list-item">六、通知和修订</text>
            <text class="list-item">七、如何联系我们</text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">一、我们如何收集和使用您的个人信息</text>

          <text class="section-subtitle">(一) 您需要授权我们收集和使用您个人信息的场景</text>
          <view class="table">
            <view class="table-row header">
              <text class="cell">我们收集的个人信息</text>
              <text class="cell">使用目的</text>
              <text class="cell">收集场景</text>
            </view>
            <view class="table-row">
              <text class="cell">
                账号注册信息及联系方式（包括：微信昵称、微信平台用户ID、微信平台unionid、手机号码）
              </text>
              <text class="cell">用于用户识别进行登录</text>
              <text class="cell">注册/登录</text>
            </view>
            <view class="table-row">
              <text class="cell">手机号码及验证信息</text>
              <text class="cell">用于手机号码登录</text>
              <text class="cell">注册/登录</text>
            </view>
            <view class="table-row">
              <text class="cell">身份信息（包括：姓名、公民身份号码）</text>
              <text class="cell">用于用户获得收益</text>
              <text class="cell">签约合同</text>
            </view>
          </view>

          <text class="section-subtitle">(二) 您可以选择授权提供个人信息的场景</text>
          <text class="section-text">
            您可以通过访问您所依托的移动应用程序(微信)的隐私设置逐项查看您的系统权限的开启状态，并可以设置权限的开启或关闭。请您注意，您开启这些权限后且在我们的服务内授权即代表您授权我们可以收集和使用这些个人信息来实现上述功能，您关闭权限即代表您取消了这些授权，则我们将不再继续收集和使用您的这些个人信息，也无法为您提供上述与这些授权所对应的功能。您关闭权限的决定不会影响此前基于您的授权所进行的个人信息的处理。
          </text>

          <text class="section-subtitle">(三) 征得同意的例外</text>
          <text class="section-text">
            您应充分知晓，以下情形中，我们收集、使用个人信息无需征得您的授权同意：
          </text>
          <view class="section-list">
            <text class="list-item">1. 与国家安全、国防安全有关的；</text>
            <text class="list-item">
              2.
              为订立、履行个人作为一方当事人的合同所必需，或者按照依法制定的劳动规章制度和依法签订的集体合同实施人力资源管理所必需；
            </text>
            <text class="list-item">3. 为履行法定职责或者法定义务所必需；</text>
            <text class="list-item">
              4. 为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；
            </text>
            <text class="list-item">
              5. 为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理个人信息；
            </text>
            <text class="list-item">
              6. 依照本法规定在合理的范围内处理个人自行公开或者其他已经合法公开的个人信息；
            </text>
            <text class="list-item">7. 法律、行政法规规定的其他情形。</text>
          </view>

          <text class="section-subtitle">(四) 个人信息使用规则</text>
          <view class="section-list">
            <text class="list-item">
              1.
              我们会根据本《隐私权政策》所述，为实现我们的产品与/或服务功能而对所收集的个人信息进行使用。
            </text>
            <text class="list-item">
              2.
              请您了解并同意，对于您在使用我们的产品与/或服务时所提供的所有个人信息，除非您删除或通过系统设置拒绝我们收集，否则将被视为在您使用我们的产品与/或服务期间持续授权同意我们使用。
            </text>
            <text class="list-item">
              3.
              当我们要将您的个人信息用于本隐私声明未载明的其它用途时，或基于特定目的收集而来的个人信息用于其他目的时，会事先征求您的明示同意。
            </text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">二、我们如何共享、转让、公开披露您的个人信息</text>

          <text class="section-subtitle">(一) 共享</text>
          <text class="section-text">
            我们不会与非服务提供者以外的公司、组织和个人共享您的个人信息，但以下情况除外：
          </text>
          <view class="section-list">
            <text class="list-item">
              1. 在获取明确同意情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
            </text>
            <text class="list-item">
              2.
              在法定情形下共享：我们会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。
            </text>
            <text class="list-item">
              3.
              我们可能会委托授权合作伙伴为您提供某些服务或代表我们履行职能，我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息。
            </text>
          </view>

          <text class="section-subtitle">(二) 转让</text>
          <text class="section-text">
            我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
          </text>
          <view class="section-list">
            <text class="list-item">1. 事先获得您明确的同意或授权；</text>
            <text class="list-item">
              2. 根据适用的法律法规、法律程序的要求、强制性的行政或司法要求所必须的情况进行提供；
            </text>
            <text class="list-item">
              3.
              符合与您签署的相关协议（包括在线签署的电子协议以及相应的平台规则）或其他的法律文件约定所提供；
            </text>
            <text class="list-item">
              4.
              随着我们业务的发展，我们及我们的关联方有可能进行合并、收购、资产转让或类似的交易，您的个人信息有可能作为此类交易的一部分而被转移。
            </text>
          </view>

          <text class="section-subtitle">(三) 公开披露</text>
          <text class="section-text">我们仅会在以下情况下，公开披露您的个人信息：</text>
          <view class="section-list">
            <text class="list-item">
              1. 获得您明确同意或基于您的主动选择，我们会公开披露您的个人信息；
            </text>
            <text class="list-item">
              2.
              根据法律、法规的要求、强制性的行政执法或司法要求所必须提供您个人信息的情况下，我们可能会依据所要求的个人信息类型和披露方式公开披露您的个人信息。
            </text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">三、我们如何存储和保护您的个人信息</text>

          <text class="section-subtitle">(一) 存储</text>
          <text class="section-text">
            1.
            存储地域范围：我们在中华人民共和国境内收集和产生的个人信息将存储在中华人民共和国境内。
          </text>
          <text class="section-text">
            2. 存储期限：我们只会在达成本政策所述目的所需的期限内保留您的个人信息。
          </text>

          <text class="section-subtitle">(二) 保护措施</text>
          <view class="section-list">
            <text class="list-item">
              1.
              我们已采取符合业界标准、合理可行的安全防护措施保护您的个人信息，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。
            </text>
            <text class="list-item">
              2.
              我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击。
            </text>
            <text class="list-item">
              3. 我们会部署访问控制机制，确保只有授权人员才可访问个人信息。
            </text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">四、您如何管理个人信息</text>

          <text class="section-subtitle">(一) 访问和更正您的个人信息</text>
          <text class="section-text">
            您有权访问和更正您的个人信息，法律法规规定的例外情况除外。
          </text>

          <text class="section-subtitle">(二) 删除您的个人信息</text>
          <text class="section-text">在以下情形中，您可以向我们提出删除个人信息的请求：</text>
          <view class="section-list">
            <text class="list-item">1. 如果我们处理个人信息的行为违反法律法规；</text>
            <text class="list-item">2. 如果我们收集、使用您的个人信息，却未征得您的明确同意；</text>
            <text class="list-item">3. 如果我们处理个人信息的行为严重违反了与您的约定；</text>
            <text class="list-item">4. 如果您不再使用我们的产品或服务；</text>
            <text class="list-item">5. 如果我们停止为您提供产品或服务。</text>
          </view>

          <text class="section-subtitle">(三) 注销账号</text>
          <text class="section-text">
            您可以通过本政策"如何联系我们"部分提供的联系方式申请注销账号。
          </text>
        </view>

        <view class="section">
          <text class="section-title">五、未成年人的个人信息保护</text>
          <text class="section-text">
            本声明所指的儿童是指不满14周岁的个人。如果没有父母或监护人的同意，儿童不得创建自己的用户账户。如您为未成年人的，建议您请您的父母或监护人仔细阅读本隐私声明，并在征得您的父母或监护人同意的前提下使用我们的服务或向我们提供信息。
          </text>
          <text class="section-text">
            对于经父母或监护人同意使用我们的产品或服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。如果我们发现自己在未事先获得可证实的父母同意的情况下收集了儿童的个人信息，则会设法尽快删除相关数据。
          </text>
        </view>

        <view class="section">
          <text class="section-title">六、通知和修订</text>
          <text class="section-text">
            我们的隐私权声明可能变更。未经您明确同意，我们不会限制您按照本隐私权政策所应享有的权利。我们会在我们专门页面上发布对隐私权政策所做的任何变更。
          </text>

          <text class="section-text">本声明所指的重大变更包括但不限于：</text>
          <view class="section-list">
            <text class="list-item">
              1.
              我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
            </text>
            <text class="list-item">
              2. 我们在控制权等方面发生重大变化。如并购重组等引起的信息控制者变更等；
            </text>
            <text class="list-item">3. 个人信息共享、转让或公开披露的主要对象发生变化；</text>
            <text class="list-item">4. 您参与个人信息处理方面的权利及其行使方式发生重大变化；</text>
            <text class="list-item">
              5. 我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化；
            </text>
            <text class="list-item">6. 个人信息安全影响评估报告表明存在高风险。</text>
          </view>

          <text class="section-text">您可以通过"【我的-隐私权政策】"中查看本政策的最新版本。</text>
        </view>

        <view class="section">
          <text class="section-title">七、如何联系我们</text>
          <text class="section-text">
            本政策提及的可能需要与我们取得联系的情况下，或您对本政策内容有任何疑问、意见或建议的，您可以通过以下方式联系我们：
          </text>
          <view class="contact-info">
            <text>①小程序页面联系客服</text>
            <text>②邮箱：contact@jiesi.com</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮区域 -->
    <view class="footer" v-if="showButtons">
      <wd-button type="warning" class="footer-btn disagree" @click="handleDisagree">
        不同意
      </wd-button>
      <wd-button type="primary" class="footer-btn agree" @click="handleAgree">同意</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 控制底部按钮的显示
const showButtons = ref(true)

// 获取页面参数 - 使用 onLoad 生命周期
onLoad((options: any) => {
  console.log('options', options)
  // 将字符串 'false' 转换为布尔值 false
  showButtons.value = options?.showButtons !== 'false'
})

const handleAgree = () => {
  // 跳转到注册页面
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

const handleDisagree = () => {
  // 返回上一页
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.privacy-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

.content-scroll {
  flex: 1;
  padding-bottom: 120rpx; // 为底部按钮留出空间
}

.content-wrapper {
  padding: 32rpx;
}

.header {
  margin-bottom: 48rpx;
  text-align: center;

  .title {
    display: block;
    margin-bottom: 16rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.section {
  margin-bottom: 40rpx;

  .section-title {
    display: block;
    margin-bottom: 24rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .section-subtitle {
    display: block;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: #444;
  }

  .section-text {
    display: block;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    line-height: 1.6;
    color: #666;
  }

  .section-list {
    margin: 16rpx 0;

    .list-item {
      position: relative;
      display: block;
      padding-left: 24rpx;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      line-height: 1.6;
      color: #666;

      &::before {
        position: absolute;
        top: 16rpx;
        left: 8rpx;
        width: 6rpx;
        height: 6rpx;
        content: '';
        background-color: #666;
        border-radius: 50%;
      }
    }
  }
}

.table {
  margin: 20rpx 0;
  border: 1px solid #eee;
  border-radius: 8rpx;

  .table-row {
    display: flex;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &.header {
      font-weight: bold;
      background-color: #f8f8f8;
    }

    .cell {
      flex: 1;
      padding: 20rpx;
      font-size: 26rpx;
      color: #666;
      border-right: 1px solid #eee;

      &:last-child {
        border-right: none;
      }
    }
  }
}

.contact-info {
  padding: 20rpx;
  margin-top: 16rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  text {
    display: block;
    margin-bottom: 12rpx;
    font-size: 28rpx;
    line-height: 1.6;
    color: #666;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .footer-btn {
    width: 320rpx !important;
    height: 80rpx !important;
    font-size: 30rpx !important;

    &.disagree {
      margin-right: 24rpx;
    }
  }
}
</style>
