<template>
	<view class="w-100">
			<view class="archCard" v-if="is_active === 1">
				<view class="left-contanier flex-1 box-bb" @click="activeDetail(item)">
					<view class="title">{{ item.customer_name }}</view>
					<view class="desc adress">{{ item.area_fullname }}</view>
					<view class="desc">联系人:{{ item.contacts }}</view>
				</view>
			</view>
			<view class="archCard " v-if="is_active === 0">
				<view class="left-contanier" @click="goUnDetail(item)" style="padding-right: 0;">
					<view class="title">{{ item.customer_name }}</view>
					<view class="desc adress">{{ item.area_fullname }}</view>
					<view class="desc">联系人:{{ item.contacts }}</view>
				</view>
				<!-- 业务激活操作 -->
				<template v-if="role_code === 'HYXYWY'">
					<slot><view v-if="is_active === 0" class="activeBtn" hover-class="hover-activeBtn" @tap="activeArchil(item)">激活</view></slot>
				</template>
			</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	props: {
		item: Object,
		index: Number,
		is_active:  Number,
		role_code:{
			required:true,
			type:String
		}
	},
	computed: {
		...mapState({
			role_name: state => state.user.role_name
		})
	},

	methods: {
		// 激活客户
		activeArchil(item) {
			this.$emit('hanldActive');
			this.$myNavigateTo('/pages/activate/unactivate', {
				customer_apply_id: item.customer_apply_id,
				is_active: 0
			});
		},
		// 待激活详情
		goUnDetail(item) {
			this.$myNavigateTo('/pages/active-detail/unactive-detail', {
				customer_apply_id: item.customer_apply_id,
				is_active: 0
			});
		},
		// 点击获取激活客户的详情页
		activeDetail(item) {
			this.$myNavigateTo('/pages/active-detail/active-detail', {
				customer_apply_id: item.customer_apply_id,
				is_active: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.s-index {
	padding: 0 20rpx;
	height: 50rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	background-color: #eeeeee;
}
.archCard {
	width: 750rpx;
	height: 180rpx;
	border-bottom: 1px solid #eeeeee;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	.left-contanier {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #ffffff;
		color: #999999;
		font-size: 28rpx;
		padding:0 40rpx;
		.title {
			font-size: 32rpx;
			line-height: 60rpx;
			width: 100%;
			color: #444444;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.desc {
			line-height: 44rpx;
		}
		.adress {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.activeBtn {
		width: 120rpx;
		height: 50rpx;
		border-radius: 5rpx;
		flex-shrink: 0;
		font-size: 30rpx;
		color: #ffffff;
		background-color: #ff9933;
		line-height: 50rpx;
		text-align: center;
		margin-right: 50rpx;
	}
	.hover-activeBtn {
		background-color: #fdc100;
		color: #fefefe;
	}
}
</style>
