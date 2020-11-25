<template>
	<view>
		<view class="main-lis">
			<view class="lis-title" @click="childShow = !childShow">
				<view>
					<text class="iconfont color-ddd">&#xe71a;</text>
					<!-- <text class="iconfont color-r1">&#xe7b9;</text> -->
					<text class="text" v-if="isShopkeeper == 0">请选择分店</text>
					<text class="text" v-if="isShopkeeper == 1">请选择主店</text>
					<text style="color: #888" v-if="isShopkeeper == 0">（多选）</text>
					<text style="color: #888" v-if="isShopkeeper == 1">（单选）</text>
				</view>
			</view>
			<view class="lis-child" v-if="data && childShow">
				<view class="lis-child-title" @click="onchild(c, index)" v-for="(c, index) in data" :key="c.store_id">
					<view>
						<text class="iconfont color-g2" v-if="c.selection">&#xe61f;</text>
						<text class="iconfont color-g1" v-if="!c.selection">&#xe634;</text>
						<text class="text">{{c.store_name}}</text>

					</view>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: ['screen', 'isShopkeeper'],
	data() {
		return {
			data: this.screen,
			childShow: true,
			current: 0,
			
		};
	},
	created() {
		console.log(this.screen);
	},
	methods: {
		onchild(child, index) {
			if(this.isShopkeeper == 1){//删除前面所有选择
				for(let i in this.data){
					this.data[i].selection = false;
				}
			}
			this.data[index].selection = !this.data[index].selection;
			this.$emit('onscreen', this.data);
		}
	}
};
</script>

<style lang="scss">
.main-lis {
	.lis-title {
		width: 710upx;
		height: 74upx;
		line-height: 74upx;
		padding: 20upx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		border-bottom: 20upx solid #f0f0f0;
		.color-ddd {
			font-size: 28upx;
			margin-right: 20upx;
		}
		.color-r1 {
			margin-right: 20upx;
		}
	}
	.lis-child {
		.lis-child-title {
			width: 710upx;
			min-height: 74upx;
			padding: 20upx;
			// padding-left: 60upx;
			display: flex;
			justify-content: space-between;
			font-size: 32upx;
			border-bottom: 2upx solid #f0f0f0;
			background-color: #fff;
			.iconfont {
				margin-right: 20upx;
			}
		}
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
