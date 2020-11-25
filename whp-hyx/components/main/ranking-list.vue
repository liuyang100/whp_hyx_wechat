<template>
	<view class="top-item d-flex mb-2">
		<view class="rank-left ">
			<view class="big_ordericons_one" v-if="index == 0"><image class="imgs" src="../../static/img/icon_dengji_1.png" mode="widthFix"></image></view>
			<view class="big_ordericons_one" v-else-if="index == 1"><image class="imgs" src="../../static/img/icon_dengji_2.png" mode="widthFix"></image></view>
			<view class="big_ordericons_one" v-else-if="index == 2"><image class="imgs" src="../../static/img/icon_dengji_3.png" mode="widthFix"></image></view>
			<view class="sort-num" v-else>{{ index + 1 }}</view>
		</view>
		<view>
			<view class="title">{{ item.series_product_category }}</view>
			<view class="xin_hao">
				<text class="mr-1">型号:</text>
				{{ item.model }}
			</view>
			<view class="desc ">{{ item.itemModel }}</view>
			<view class="xiao-niang">
				<text class="num-color  ">机型销量:</text>
				{{ item.sales | salesFilter }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: Object,
		index: Number
	},
	filters: {
		salesFilter(value) {
			if (typeof value === 'number') {
				value = value;
			} else {
				value = Number(value);
			}
			if (value < 100) {
				return value;
			} else {
				if (value % 100 > 0) {
					return parseInt(value / 100) * 100 + '+';
				} else {
					return parseInt(value / 100) * 100;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.top-item {
	.rank-left {
		width: 220rpx;
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		.big_ordericons_one {
			width: 110rpx;
			height: 110rpx;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.sort-num {
			color: #444444;
			font-size: 40rpx;
			font-weight: bold;
		}
	}
	.title {
		font-size: 26rpx;
		color: #000000;
		font-weight: bold;
	}
	.xin_hao {
		font-size: 24rpx;
		color: #767676;
	}
	.desc {
		font-size: 24rpx;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: #a1a1a1;
	}
	,
	.xiao-niang {
		font-size: 26rpx;
		color: #ff3b30;
		.num-color {
			color: #676767;
			margin-right: 10rpx;
		}
	}
}
</style>
