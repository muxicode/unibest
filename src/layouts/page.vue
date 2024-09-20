<template>
  <view class="global-page p-3">
    <slot />
  </view>
</template>

<script lang="ts" setup></script>

<style scoped>
.global-page {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
