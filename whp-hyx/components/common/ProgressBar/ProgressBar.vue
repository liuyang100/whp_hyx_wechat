<template>
	<view class="progress">
		<view class="progress-bar" :style="barStyle"><view class="progress-bg" :style="percentStyle"></view></view>
		<view class="progress-text" :style="{color:textColor}">{{ percent }}%</view>
	</view>
</template>

<script>
export default {
	props: {
		// 进度条百分比
		width: {
			type: Number,
			default: 30
		},
		percent: {
			type: Number,
			default: 0
		},
		textColor:{
			type:String,
			default:'#b8b8b8'
		}
	},
	data() {
		return {
			color: [
				'background:#fff4d0',
				'background: -moz-linear-gradient(left, #fdc100 0%, #ff6c03 100%);background: -webkit-linear-gradient(left, #fdc100 0%, #ff6c03 100%);background: -o-linear-gradient(left, #fdc100 0%, #ff6c03 100%);background: -ms-linear-gradient(left, #fdc100 0%, #ff6c03 100%);background: linear-gradient(to right, #fdc100 0%, #ff6c03 100%);',
				'background: -moz-linear-gradient(left, #ff6c03 0%, #ff300c 100%);background: -webkit-linear-gradient(left, #ff6c03 0%, #ff300c 100%);background: -o-linear-gradient(left, #ff6c03 0%, #ff300c 100%);background: -ms-linear-gradient(left, #ff6c03 0%, #ff300c 100%);background: linear-gradient(to right, #ff6c03 0%, #ff300c 100%);'
			]
		};
	},
	computed: {
		percentNum() {
			return Math.floor(this.percent / 100);
		},
		barStyle() {
			return `
			height:${this.width}rpx;
			border-radius:${this.width}rpx;
			 ${this.color[this.percentNum]}
			`;
		},
		percentStyle() {
			return `
			width:${this.percent % 100}%;
			height:${this.width}rpx;
			border-radius:${this.width}rpx;
			 ${this.color[this.percentNum + 1]}
			`;
		}
	},
	methods: {}
};
</script>

<style scoped>
.progress {
	display: flex;
	align-items: center;
}
.progress-bar {
	flex: 1;
}

.progress-text {
	min-width: 90rpx;
	padding-left:20rpx;
	flex-shrink: 0;
	font-size: 28rpx;
}
</style>
