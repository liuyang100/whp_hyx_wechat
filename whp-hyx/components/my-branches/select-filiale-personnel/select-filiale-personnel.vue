<template>
	<view class="search-model">
		<view class="s-item" @click="goarchivesScreen">
			<text>全部分公司/人员</text>
			<text class="iconfont">&#xe605;</text>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			goarchivesScreen() {
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss" scoped>
.search-model {
	border-bottom:1px solid #F1F1F1;
	width: 100%;
	height: 88rpx;
	background-color: #ffffff;
	display: flex;
	font-size: 28rpx;

	.s-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		.iconfont {
			box-sizing: border-box;
			font-size: 50rpx;
			line-height: 1;
			vertical-align: middle;
			padding-top: 8rpx;
		}
	}
}
</style>

