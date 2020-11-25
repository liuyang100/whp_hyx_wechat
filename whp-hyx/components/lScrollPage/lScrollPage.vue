<template>
	<view class="lscroll-sbody">
		<!-- 头部 -->
		<view v-if="customHeader">
			<view class="lscroll-page-header" :style="{ zIndex: headerIndex, background: headerBg, bottomWidth, borderBottomWidth: borderWidth, borderBottomColor: borderColor }">
				<view class="lscroll-page-status-bar" :style="{ height: statusBarHeight + 'px', background: statusBarBG }"></view>
				<!-- 头部核心 -->
				<view class="lscroll-page-header-nav">
					<view class="lscroll-header-main" style="min-height:44px"><slot name="lHeader" /></view>
					<view :style="{ width: BoundingWidth, flexShrink: '0' }" v-if="bounding"></view>
				</view>
			</view>
			<!-- 占位 -->
			<view :style="{ width: '100%', height: headerHeight + statusBarHeight + 'px' }"></view>
		</view>
		<!-- 页面主体 -->
		<view class="lscroll-page-body">
			<slot name="default" />
			<slot name="lBody" />
		</view>
		<!-- 全屏加载 -->
		<view class="lscroll-page-loading" @tap.stop @touchmove.stop.prevent v-if="isLoading">
			<view class="lscroll-page-loading-point">
				<view class="lscroll-page-loading-points animate1" :style="{ background: loadingPointBg }"></view>
				<view class="lscroll-page-loading-points animate2" :style="{ background: loadingPointBg }"></view>
				<view class="lscroll-page-loading-points animate3" :style="{ background: loadingPointBg }"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	/*
    customHeader    是否开启自定义头部
    isLoading       是否开启页面加载
    loadingPointBg  配置页面加载点的样式
    headerIndex     头部导航栏的z-index属性值
    borderWidth     导航栏底部线条的宽度
    statusBarHeight 状态栏的高度
    statusBG        状态栏的背景颜色
    bounding        是否有胶囊按钮
    BoundingWidth   胶囊按钮的宽度
    */
	props: {
		customHeader: { type: Boolean, default: false },
		headerIndex: { type: Number, default: 98 },
		headerBg: { type: String, default: 'none' },
		headerHeight: { type: Number, default: 44 },
		borderWidth: { type: String, default: '0rpx' },
		statusBarBG: { type: String, default: 'none' },
		borderColor: { type: String, default: '#D1D1D1' },
		isLoading: { type: Boolean, default: false },
		loadingPointBg: { type: String, default: '#3688FF' },
		bounding: { type: Boolean, default: true }
	},
	data() {
		return {
			statusBarHeight: 20,
			iphoneXButtomHeight: 0,
			BoundingWidth: '0px'
		};
	},
	created() {
		try {
			var system = uni.getSystemInfoSync();
			system.model = system.model.replace(' ', '');
			system.model = system.model.toLowerCase();
			if (system.model.indexOf('iphonex') != -1 || system.model.indexOf('iphone11') != -1) {
				this.iphoneXButtomHeight = uni.upx2px(50);
			}
			if (!this.customHeader) {
				return;
			}
			this.statusBarHeight = system.statusBarHeight;
			// #ifdef MP-ALIPAY
			this.statusBarHeight = 0;
			// #endif
			// #ifndef MP-ALIPAY
			// #ifdef MP-WEIXIN
			// 小程序胶囊按钮
			var bounding = uni.getMenuButtonBoundingClientRect();
			this.BoundingWidth = bounding.width + system.windowWidth - bounding.right + 'px';
			// #endif
			// #endif
		} catch (e) {
			return null;
		}
	},
	methods: {
		getHeaderHeight() {
			return this.headerHeight + this.statusBarHeight;
		}
	}
};
</script>

<style lang="scss" scope>
/* #ifndef MP */
page {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100%;
	flex: 1;
}
/* #endif */
.lscroll-sbody {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100%;
	flex: 1;
}
/* ifdef MP */
.lscroll-sbody {
	min-height: 100vh;
}
/* endif */
.lscroll-page-body {
	width: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}

.lscroll-page-header {
	border-bottom-style: solid;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.lscroll-page-status-bar {
	width: 100%;
	height: 0px;
}
.lscroll-page-header-nav {
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
}

.lscroll-header-main {
	width: 300rpx;
	flex: auto;
	overflow: hidden;
}

.lscroll-page-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.1);
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
}
.lscroll-page-loading-point {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
}
.lscroll-page-loading-points {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: #3688ff;
	margin: 10rpx;
	opacity: 0.5;
}
.animate1 {
	animation: pageLoading1 1.2s infinite linear;
}
.animate2 {
	animation: pageLoading2 1.2s infinite linear;
}
.animate3 {
	animation: pageLoading3 1.2s infinite linear;
}
@keyframes pageLoading1 {
	0% {
		opacity: 0.5;
		transform: scale(1);
	}
	40% {
		opacity: 1;
		transform: scale(1.5);
	}
	60% {
		opacity: 0.5;
		transform: scale(1);
	}
}
@keyframes pageLoading2 {
	20% {
		opacity: 0.5;
		transform: scale(1);
	}
	60% {
		opacity: 1;
		transform: scale(1.5);
	}
	80% {
		opacity: 0.5;
		transform: scale(1);
	}
}
@keyframes pageLoading3 {
	40% {
		opacity: 0.5;
		transform: scale(1);
	}
	80% {
		opacity: 1;
		transform: scale(1.5);
	}
	100% {
		opacity: 0.5;
		transform: scale(1);
	}
}
</style>
