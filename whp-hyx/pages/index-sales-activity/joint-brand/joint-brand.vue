<template>
	<uni-popup ref="popup_view" type="bottom">
		<view class="time-module">
			<view class="time-head">联合品牌品类(多选)</view>
			<view class="time-main">
				<view class="brand-item" v-for="(item, index) in list" :key="item.brand_id" @click="bingChang(index)">
					<view>{{item.brand_name}}{{ item.business_category_name }}</view>
					<view class="iconfont bing">{{ item.check ? '&#xe619;' : '' }}</view>
				</view>
			</view>
			<view class="footer" @click="confirm">确定</view>
			<!-- 取消按钮 -->
			<view class="iconfont close" @click="close">&#xe61b;</view>
		</view>
	</uni-popup>
</template>
<script>
import uniPopup from '@/components/uni/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		bingChang(index) {
			this.$emit('change', index);
		},
		open() {
			this.$refs['popup_view'].open();
		},
		close() {
			this.$emit('cancel');
			this.$refs['popup_view'].close();
		},
		confirm() {
			this.$emit('confirm');
			this.$refs['popup_view'].close();
		}
	}
};
</script>
<style lang="scss" scoped>
.time-module {
	width: 750rpx;
	max-width: 66vh;
	background-color: #fff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	position: relative;
	.time-head {
		flex-shrink: 0;
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #000000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}
	.time-main {
		width: 750rpx;
		flex: 1;
		box-sizing: border-box;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		.brand-item {
			width: 100%;
			height: 88rpx;
			box-sizing: border-box;
			padding-left: 100rpx;
			padding-right: 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #eeeeee;
			.bing {
				color: #fdc100;
			}
		}
	}
	.footer {
		flex-shrink: 0;
		border-top: 30rpx solid #eeeeee;
		height: 90rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.close {
		position: absolute;
		top: 10rpx;
		right: 20rpx;
		color: #fdc100;
		font-size: 45rpx;
	}
}
</style>
