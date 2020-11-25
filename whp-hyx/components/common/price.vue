<template>
	<view class="prices " :style="{ color: priceColor,fontWeight:fontweight }">
		<view :style="{ fontStze: iFontSize }">￥</view>
		<view :style="{ fontSize: pFontSize }"><slot></slot></view>
	</view>
</template>

<script>
export default {
	props: {
		ifontSize: {
			type: String,
			default: '26rpx'
		},
		priceColor: {
			type: String,
			default: '#ff7a72'
		},
		pFontSize: {
			type: String,
			default: '26rpx'
		},
		fontweight:{
			type:String,
			default:"initial"
		}
	},
	data() {
		return {
			a: '#ff7a72'
		};
	}
};
</script>

<style scoped>
.prices {
	display: flex;
	align-items: center;
	
}
</style>
