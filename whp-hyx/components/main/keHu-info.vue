<template>
	<view class="w-client-top">
		<!-- 已合作添加客户申请 -->
		<!-- 主企业显示 -->
		<template v-if="is_has_company">
			<template v-if="role_code === 'HYXYWY'">
				<!-- 只有是销售业务员才显示建档 -->
				<view v-if="isActive === 1" class="add-applay my-4 " @click="addKuHu(1)">
					<view class="add-icon"><view class="iconfont  text-white">&#xe602;</view></view>
					客户申请
				</view>
				<view v-if="isActive === 0" class="add-applay my-4 " @click="addKuHu(0)">
					<view class="add-icon"><view class="iconfont  text-white">&#xe602;</view></view>
					客户申请
				</view>
			</template>
			<template v-else>
				<!-- 占位 -->
				<view class="no-applay"></view>
			</template>
		</template>
		<!-- 子企业销售业务员激活的建档 -->
		<!-- <template v-if="!is_has_company">
			<view v-if="isActive == 1 && role_name=='销售业务员'" class="add-applay my-4 " @click="addKuHu(1)">
		 		<view class="add-icon"><view class="iconfont icon-hao text-white"></view></view>
		 		客户申请
		 	</view>
		 </template> -->

		<!-- <view class="add-applay my-4" style="background: rgba(0,0,0,0);"></view> -->
		<view class="d-flex a-center pl-2 text-white">
			<view class="px-4 d-flex a-center j-center"><view class="yuanDian bg-white"></view></view>
			<view class="d-flex flex-column ">
				<view class="font-lg font-weight ">{{ kuHu === 'none' ? '' : kuHu }}</view>
				<text class="font-sm">{{ isActive ? '生效的客户总数（个）' : '未激活客户总数（个）' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		kuHu: [Number, String],
		isActive: {
			type: Number
		},
		is_has_company: {
			required: true,
			type: Boolean
		},
		role_code: {
			required: true,
			type: String
		}
	},
	created() {
		console.log(this.isActive);
	},
	methods: {
		addKuHu(value) {
			if (value === 1) {
				console.log('激活');
				this.$myNavigateTo('/pages/addClient/addClient', { is_active: 1 });
			}
			if (value === 0) {
				console.log('未激活');
				this.$myNavigateTo('/pages/add-archives/add-noArchives', { is_active: 0 });
			}
		}
	}
};
</script>

<style scoped>
.w-client-top {
	height: 280rpx;
	border-radius: 1px solid red;
	overflow: hidden;
	background: #fdc100;
}
.add-applay {
	width: 160rpx;
	height: 58rpx;
	background: #ffffff;
	color: #fe8c01;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10rpx;
	margin-left: auto;
	margin-right: 30rpx;
}
.no-applay {
	width: 100%;
	height: 130rpx;
	background: #fdc100;
}
.add-icon {
	width: 26rpx;
	height: 26rpx;
	border-radius: 26rpx;
	margin-right: 6rpx;
	background: #ff6c03;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon-hao {
	line-height: 1;
}

.yuanDian {
	width: 20rpx;
	height: 20rpx;
	border-radius: 20rpx;
}
.font-weight {
	height: 60upx;
}
</style>
