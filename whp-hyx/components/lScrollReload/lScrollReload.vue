<template>
	<view
		class="lscroll-reload"
		:class="reloadStatus === 0 || reloadStatus === 1 || reloadStatus === 2 ? 'gload-show' : 'gload-hide'"
		:style="{ background: reloadBgColor[reloadStatus] }"
	>
		<text class="iconfont icon-pulldown" v-show="reloadStatus == 0" :style="{ color: reloadColor[reloadStatus] }">&#xe64a;</text>
		<text class="iconfont gload-rotate360" v-show="reloadStatus == 1" :style="{ color: reloadColor[reloadStatus], borderColor: reloadColor[reloadStatus] }"></text>
		<text class="iconfont icon-ok" v-show="reloadStatus == 2" :style="{ color: reloadColor[reloadStatus] }">&#xe685;</text>
		<text :style="{ color: reloadColor[reloadStatus] }">{{ reloadTxt[reloadStatus] }}</text>
	</view>
</template>
<script>
export default {
	props: {
		reloadTxt: {
			type: Array,
			default: function() {
				return ['松开手指开始刷新', '数据刷新中', '数据已经刷新'];
			}
		},
		reloadBgColor: {
			type: Array,
			default: function() {
				return ['#eeeeee', '#eeeeee', '#63D2BC'];
			}
		},
		reloadColor: {
			type: Array,
			default: function() {
				return ['#999999', '#63D2BC', '#FFFFFF'];
			}
		},
		reloadStatus: {
			type: Number,
			default: 5
		}
	}
};
</script>
<style lang="scss" scope>
.lscroll-reload {
	width: 750rpx;
	height: 0;
	opacity: 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	transition: all 400ms ease;


}
.icon-pulldown {
	font-size: 30rpx;
	margin-right: 10rpx;
}


.lscroll-reload.gload-show {
	height: 100rpx;
	opacity: 1;
}
.lscroll-reload.gload-hide {
	height: 0rpx;
	opacity: 0;
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
.icon-ok {
	font-size: 36rpx;
	margin-right: 10rpx;
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
