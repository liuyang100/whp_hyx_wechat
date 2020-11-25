<template name="graceLoading">
  <view class="l-scroll-loading" v-if="loadingType < 4" :class="loadingType < 4?'load-show':'load-hide'">
    <view class="gload-rotate360" v-show="loadingType == 1" :style="{borderColor:iconColor}"></view>
    <text :style="{color:textColor}">{{loadingText[loadingType]}}</text>
  </view>
</template>

<script>
export default {
  props: {
    loadingType: {
      type: Number,
      default: 0
    },
    loadingText: {
      type: Array,
      default: function() {
        // 0 上拉加载更多
        // 1 加载中
        // 2 加载全部
        // 3 空文本
        // 4 不展示组件
        return ["上拉加载更多", "正在努力加载", "没有更多数据", "", ""];
      }
    },
    iconColor: {
      type: String,
      default: "#888888"
    },
    textColor: {
      type: String,
      default: "#888888"
    }
  }
};
</script>
<style lang="scss" scope>
.l-scroll-loading {
  width: 100%;
  height: 0rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  transition: all 400ms ease; 
  &.load-show{
	  height: 80rpx;
  }
  &.load-hide{
	  height: 0rpx;
  }
}
.gload-rotate360 {
  margin-right: 10rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #cccccc;
  border-right: transparent;
  animation: grace-rotate360 1200ms infinite linear;
}
@keyframes grace-rotate360 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>