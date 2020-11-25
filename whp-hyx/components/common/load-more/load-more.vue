<template>
	<view>
		<view class="load_model" v-if="islodMore">
			<text>{{ loadingType == 0 ? loadbeforeTxt : loadingType == 1 ? loadlodingTxt : loadnomoreTxt }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		islodMore: Boolean,
		loadingType: Number
	},
	data() {
		return {
			loadbeforeTxt: '加载更多',
			loadlodingTxt: '加载中...',
			loadnomoreTxt: '没有更多数据'
		};
	}
};
</script>

<style scoped>
.load_model {
	height: 80rpx;
	width: 100%;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #666666;
}
</style>
