<route lang="json5">
{
  style: {
    navigationBarTitleText: '用户服务协议',
  },
}
</route>

<template>
  <view class="agreement-page bg-white min-h-screen">
    <view class="px-4 py-6">
      <!-- 标题区域 -->
      <view class="text-center mb-8">
        <view class="text-2xl font-bold">用户服务协议</view>
        <view class="text-xl font-bold mt-3">【惠州杰思文化传媒有限公司】</view>
        <view class="text-sm text-gray-500 mt-2">版本更新日期: 2024年4月17日</view>
      </view>

      <!-- 前言 -->
      <view class="mb-8">
        <view class="text-lg font-bold mb-4">前言</view>
        <view class="text-sm leading-6 pl-4">
          欢迎您来到并使用惠州杰思文化传媒有限公司平台服务！
          本协议由用户(以下或称"您")与惠州杰思文化传媒有限公司(以下简称"杰思文化""公司")共同签订。请您在使用服务前仔细阅读本协议，尤其是
          <text class="font-bold">免责条款、权利限制条款以及争议解决条款</text>
          等重要内容。
        </view>
      </view>

      <!-- 主体内容 -->
      <wd-collapse v-model="activeName" accordion>
        <!-- 第一章 定义 -->
        <wd-collapse-item title="第一章 定义" name="1">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-4">
              <view class="font-bold">第一条 惠州杰思文化传媒有限公司</view>
              <view class="mt-2 pl-4">
                指平台的经营者。本协议项下，平台经营者可能根据业务调整而发生变更，具体以平台公示的信息为准。平台经营者的变更不会影响本协议项下约定的各项权利义务。
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第二条 平台服务</view>
              <view class="mt-2 pl-4">
                指基于互联网，以微信小程序的形态（包括未来技术发展出现的新的服务形态）向您提供的各项服务，其解释权归公司所有。
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第三条 平台规则</view>
              <view class="mt-2 pl-4">
                包括所有已经发布及后续可能发布、修订的各类规则、规范、解读、实施细则、通知、公告等。
              </view>
            </view>
          </view>
        </wd-collapse-item>

        <!-- 第二章 协议范围及变更 -->
        <wd-collapse-item title="第二章 协议范围及变更" name="2">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-4">
              <view class="font-bold">第一条 协议范围</view>
              <view class="mt-2 pl-4">
                由于互联网高速发展，您与公司签署的本协议列明的条款并不能完整罗列并覆盖您与公司所有权利与义务，现有的约定也不能保证完全符合未来发展的需求。因此，平台隐私权政策、平台规则均为本协议的补充协议，与本协议不可分割且具有同等法律效力。
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第二条 协议变更</view>
              <view class="mt-2 pl-4">
                公司可根据国家法律法规变化及维护交易秩序需要，对本协议内容进行修改、更新，修改后的协议将在相关页面或其他合适的方式公布。如果您不同意修改后的协议，可以放弃使用平台服务；如果您选择在协议修改后继续使用服务，则视为您接受对协议的所有修改。
              </view>
            </view>
          </view>
        </wd-collapse-item>

        <!-- 第三章 用户账户登录与使用 -->
        <wd-collapse-item title="第三章 用户账户登录与使用" name="3">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-4">
              <view class="font-bold">第一条 账户登录</view>
              <view class="mt-2 pl-4">
                <view class="mb-2">
                  <text class="font-bold">• 用户资格：</text>
                  您应当具备中华人民共和国法律规定的与您行为相适应的民事行为能力。
                </view>
                <view class="mb-2">
                  <text class="font-bold">• 信息真实：</text>
                  您应当按平台页面的提示准确完整地提供您的信息，并保持信息的真实性及有效性。
                </view>
                <view class="mb-2">
                  <text class="font-bold">• 真实身份：</text>
                  您可能需要填写真实的个人信息，并通过相关验证流程后方可使用服务。
                </view>
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第二条 账户说明</view>
              <view class="mt-2 pl-4">
                <view class="mb-2">
                  <text class="font-bold">• 账户获得：</text>
                  当您完成全部登录程序后，可成为平台用户。
                </view>
                <view class="mb-2">
                  <text class="font-bold">• 账户使用：</text>
                  您有权使用您确认的手机号码或第三方账号登录平台。
                </view>
              </view>
            </view>
          </view>
        </wd-collapse-item>

        <!-- 第四章 平台服务及规范 -->
        <wd-collapse-item title="第四章 平台服务及规范" name="4">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-4">
              <view class="font-bold">第一条 任务详情</view>
              <view class="mt-2 pl-4">
                当您选择、完成推广任务时，您可以在您的任务列表中查看您的任务详情及完成情况。您通过平台产生的所有收益，均应自行承担税费并依法履行缴税义务。
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第二条 责任限制</view>
              <view class="mt-2 pl-4">
                <view class="mb-2">• 不可抗力导致的服务中断或终止，公司不承担责任。</view>
                <view class="mb-2">• 因第三方原因导致的服务障碍，公司将及时采取补救措施。</view>
                <view class="mb-2">• 公司不对平台上的信息、内容、服务做任何形式的担保。</view>
              </view>
            </view>
          </view>
        </wd-collapse-item>

        <!-- 第五章 用户信息的保护及授权 -->
        <wd-collapse-item title="第五章 用户信息的保护及授权" name="5">
          <view class="text-sm leading-7 pl-4">
            在您使用平台服务时，您同意公司收集、存储、使用、披露和保护您的个人信息。公司将按照本协议及《隐私权政策》的规定保护您的个人信息。
          </view>
        </wd-collapse-item>

        <!-- 第六章 违约及处理 -->
        <wd-collapse-item title="第六章 违约及处理" name="6">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-4">
              <view class="font-bold">第一条 违约情形</view>
              <view class="mt-2 pl-4">
                <view class="mb-2">• 使用平台服务时违反法律法规。</view>
                <view class="mb-2">• 违反本协议或补充协议约定。</view>
              </view>
            </view>
            <view class="mb-4">
              <view class="font-bold">第二条 违约处理</view>
              <view class="mt-2 pl-4">
                <view class="mb-2">• 公司可对违规信息进行删除、屏蔽处理。</view>
                <view class="mb-2">• 公司可采取限制账户使用、冻结账户等措施。</view>
              </view>
            </view>
          </view>
        </wd-collapse-item>

        <!-- 其他 -->
        <wd-collapse-item title="其他条款" name="7">
          <view class="text-sm leading-7 pl-4">
            <view class="mb-2">• 本协议适用中华人民共和国法律。</view>
            <view class="mb-2">• 协议部分条款无效不影响其他条款效力。</view>
            <view class="mb-2">• 条款标题仅供参考，不作为解释依据。</view>
          </view>
        </wd-collapse-item>
      </wd-collapse>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 展开面板name
const activeName = ref('1')
</script>

<style>
.agreement-page {
  background-color: #fff;
}
</style>
