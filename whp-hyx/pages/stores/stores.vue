<template>
	<view class="container">
		<view class="main">
			<dot-screen v-if="find_stores.length" :screen="find_stores" :isShopkeeper="isShopkeeper" @onscreen="onscreen">
			</dot-screen></view>
		<view class="pagebtn"><text class="screen-btn" @click="screenBtn">确定</text></view>
	</view>
</template>

<script>
import dotScreen from '@/components/common/storsStore/storsStore.vue';
export default {
	components: {
		dotScreen
	},
	data() {
		return {
			find_stores: [],
			isShopkeeper: 0
		};
	},
	onLoad(option) {
		
		option && (option = this.$formateOption(option));
		console.log(option);
		if (option.isShopkeeper == 0) {
			let is_mian_store = 1;
			this.isShopkeeper = is_mian_store;
		}
		if (option.isShopkeeper == 1) {
			let is_mian_store = 0;
			this.isShopkeeper = is_mian_store;
		}

		this.getfindStore(option.id, this.isShopkeeper);

		if (option.isShopkeeper == 1) {
			uni.setNavigationBarTitle({
				title: '分店选择'
			});
		} else if (option.isShopkeeper == 0) {
			uni.setNavigationBarTitle({
				title: '主店选择'
			});
		}
	},
	methods: {
		// 子组件自定是事件
		onscreen(option) {
			this.find_stores = option;
		},
		// 点击确定返回
		screenBtn() {
			this.$eventHub.$emit('storeListData', this.find_stores);
			uni.navigateBack({});
		},
		
		getfindStore(id, isShopkeeper) {
			this.$myRequest({
				url: this.$myhttpUrl.storeList,
				data: {
					sale_org_id: id,
					is_mian_store: isShopkeeper == 0 ? 1 : 0
				},
				success: res => {
					for (let i in res.data) {
						res.data[i]['selection'] = false;
					}
					this.find_stores = res.data;
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}

.main {
	width: 750upx;
	margin-bottom: 150upx;
}

.pagebtn {
	width: 750upx;
	height: 120upx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	z-index: 199;

	.screen-btn {
		display: inline-block;
		width: 690upx;
		height: 80upx;
		line-height: 80upx;
		margin: 20upx 30upx;
		background-color: #fdc100;
		color: #fff;
		text-align: center;
		font-size: 34upx;
	}
}

.color-ddd {
	color: #dddddd !important;
}
.color-r1 {
	color: #f5a623 !important;
}
.color-r2 {
	color: #42dc61 !important;
}
.color-g1 {
	color: #bdc3c7 !important;
}
.color-g2 {
	color: #fdc100 !important;
}
</style>
