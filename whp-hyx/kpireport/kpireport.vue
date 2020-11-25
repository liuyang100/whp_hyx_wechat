<template>
	<view class="content">
		<view class="kpimain">
			<template v-if="is_main_companyInfo">
				<view class="kpilis" @click="gopage('/kpireport/my-purchase/my-purchase')">
					<view class="iconbox-bg" style="background-color: #FCCD10;"><text class="iconfont">&#xe631;</text></view>
					<text class="text-name">我的采购</text>
				</view>
				<view class="kpilis" @click="gopage('/kpireport/kpi-wholesale/kpi-wholesale')">
					<view class="iconbox-bg" style="background-color: #10A5FF;"><text class="iconfont">&#xe63d;</text></view>
					<text class="text-name">我的批发分销</text>
				</view>
				<view class="kpilis" @click="gopage('/kpireport/my-retail/my-retail')">
					<view class="iconbox-bg" style="background-color: #FD6766;"><text class="iconfont">&#xe646;</text></view>
					<text class="text-name">我的零售</text>
				</view>
			</template>
			<view class="kpilis" @click="gopage('/kpireport/my-sellout/my-sellout')">
				<view class="iconbox-bg" style="background-color: #FD9029;"><text class="iconfont">&#xe63f;</text></view>
				<text class="text-name">我的sellout</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	onLoad(option) {},
	computed: {
		...mapState({
			is_main_companyInfo: state => state.user.is_main_companyInfo
		})
	},
	methods: {
		gopage(url) {
			this.$myNavigateTo(url);
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 750rpx;
	min-height: 100vh;
	background: #f1f1f1;
}
.kpimain {
	width: 750rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	border-left: 1rpx solid #ffffff;

	.kpilis {
		width: 50%;
		height: 120rpx;
		display: flex;
		align-items: center;
		align-content: center;
		background-color: #ffffff;
		border-bottom: 1rpx solid #f1f1f1;
		box-sizing: border-box;
		padding-left: 30rpx;
		&:nth-of-type(2n + 1) {
			border-right: 1rpx solid #f1f1f1;
		}

		.iconbox-bg {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64rpx;
			height: 64rpx;
			border-radius: 100%;
			margin-right: 20rpx;
			flex-shrink: 0;
			.iconfont {
				text-align: center;
				color: #ffffff;
			}
		}
		.text-name {
			color: #333333;
			font-size: 32rpx;
		}
	}
}
</style>
