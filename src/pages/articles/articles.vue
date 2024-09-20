<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '文章列表',
  },
}
</route>
<template>
  <wd-card title="经营分析">
    一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。
    <template #footer>
      <wd-button size="small" plain>查看详情</wd-button>
    </template>
  </wd-card>
  <wd-card title="经营分析">
    一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。
    <template #footer>
      <wd-button size="small" plain>查看详情</wd-button>
    </template>
  </wd-card>
  <wd-card title="经营分析">
    一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。
    <template #footer>
      <wd-button size="small" plain>查看详情</wd-button>
    </template>
  </wd-card>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
:root {
  --wot-card-bg: #fff;
}
</style>
