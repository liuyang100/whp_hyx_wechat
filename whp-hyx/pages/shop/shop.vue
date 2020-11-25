<template>
	<view class="w-100 h-100 d-flex flex-column">
		<view class="w-100">
			<view class="main-bg-color py-2 px-3"><ly-search-bar placeholder="触房不锈钢水槽" :radius="60" @confirm="search" /></view>
			<view class="chang-enterprise d-flex">
				<view class="enterprise-item"><text>切换企业</text></view>
				<view class="enterprise-item enterprise-name">
					<text class="w-100 text-right">重庆双港有限公司</text>
					<text class="iconfont">&#xe770;</text>
				</view>
			</view>
			<scroll-view style="height: 80rpx;width: 100%;" scroll-x="true">
				<view class="tab-nav">
					<view class="tab-nav-item" @click="hanldTabNav(index)" :class="tabIndex == index ? 'active' : ''" v-for="(item, index) in tabNav" :key="item.id">
						<text>{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<swiper class="flex-1 box-bb" @change="swiperChange" :current="tabIndex">
			<swiper-item class="w-100 h-100" v-for="(tas, tai) in tabNav" :key="tai">
				<scroll-view class="w-100 h-100" scroll-y="true">
					<view class="stop-info">
						<view class="left"><image src="/static/img/stop/img_fenxiang.png" class="img"></image></view>
						<view class="right">
							<view class="desc"><text>惠而浦双开冰箱冻龄系列BCD-603WMGBIW夏空棕惠而浦双开冰箱冻龄系列BCD-603WMGBIW夏空棕</text></view>
							<view class="order-price">
								<text>开单价</text>
								<price>232.00</price>
							</view>
							<view class="advice-price">
								<text>建议零售价</text>
								<price>252.00</price>
							</view>
						</view>
						<view class="add-button" @click="addGoods({ price: 252 })"><text class="iconfont">&#xe69a;</text></view>
					</view>
					<view class="blank"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="fiexd-footer">
			<view class="left">
				<view class="goods-car">
					<text class="iconfont">&#xe623;</text>
					<text v-if="num != 0" class="badge" :style="width">{{ num }}</text>
				</view>
				<view class="order-info">
					<view class="top">
						<text>￥{{ zprice }}</text>
					</view>
					<view class="bottom"><text>合计金额</text></view>
				</view>
			</view>
			<view class="right"><text>一键推送</text></view>
		</view>
	</view>
</template>

<script>
import Validation from '@/ulits/Validation';
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import uniBadge from '@/components/uni/uni-badge/uni-badge.vue';
import Price from '@/components/common/price.vue';
export default {
	components: {
		lySearchBar,
		Price,
		uniBadge
	},
	data() {
		return {
			keysword: '',
			tabIndex: 0,
			tabNav: [
				{
					id: 1,
					name: '全部'
				},
				{
					id: 2,
					name: '推荐'
				},
				{
					id: 3,
					name: '最近下单'
				},
				{
					id: 4,
					name: '采购量'
				},
				{
					id: 5,
					name: '新品'
				},
				{
					id: 6,
					name: '热销排行'
				}
			],
			num: 0,
			zprice: 0
		};
	},
	onLoad() {},
	computed: {
		width: function() {
			return `display: inline-block;width: ${String(this.num).length * 15 + 15}rpx`;
		}
	},
	methods: {
		search(val) {
			this.keysword = val;
		},
		// 滑动swiper
		swiperChange(e) {
			if (e.detail.current == this.tabIndex) return;
			this.tabIndex = e.detail.current;
		},

		// 点击顶部切换栏
		hanldTabNav(index) {
			if (this.tabIndex == index) return;
			this.tabIndex = index;
		},

		// 点击加入购物车
		addGoods(item) {
			this.zprice += item.price;
			this.num++;
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.blank {
	height: 96rpx;
	width: 100%;
}
.fiexd-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 96rpx;
	background: #ffffff;
	border-top: 1rpx solid #eeeeee;
	display: flex;
	.left {
		flex: 2;
		display: flex;
		align-items: center;
		.goods-car {
			width: 100rpx;
			height: 100%;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont {
				color: #fdc100;
				font-size: 60rpx;
			}
			.badge {
				position: absolute;
				top: 8rpx;
				right: 0;
				font-size: 20rpx;
				background: #ff461f;
				height: 30rpx;
				line-height: 30rpx;
				text-align: center;
				color: #ffffff;
				border-radius: 30rpx;
			}
		}
		.order-info {
			display: flex;
			flex-direction: column;
			padding-left: 20rpx;
			line-height: 1.2;
			.top {
				font-size: 32rpx;
				color: #333333;
			}
			.bottom {
				font-size: 26rpx;
				color: #a5a5a5;
			}
		}
	}
	.right {
		flex: 1;
		background-color: #fdc100;
		color: #ffffff;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
	}
}
.stop-info {
	position: relative;
	background-color: #ffffff;
	border-bottom: 1rpx solid #eeeeee;
	height: 220rpx;
	box-sizing: border-box;
	width: 100%;
	padding: 30rpx 20rpx;
	display: flex;
	align-items: center;
	.left {
		width: 180rpx;
		height: 100%;
		flex-shrink: 0;
		.img {
			width: 180rpx;
			height: 180rpx;
		}
	}
	.right {
		flex: 1;
		padding: 0 20rpx;
		.desc {
			font-weight: bold;
			font-size: 30rpx;
			line-height: 1.4;
			color: #333333;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.order-price {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #a5a5a5;
		}
		.advice-price {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #a5a5a5;
		}
	}
	.add-button {
		position: absolute;
		bottom: 30rpx;
		right: 40rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
		background-color: #fdc100;
		color: #ffffff;
		line-height: 50rpx;
		text-align: center;
	}
}
.chang-enterprise {
	height: 80rpx;
	background: #fffbed;
	padding: 0 30rpx;
	.enterprise-item {
		flex: 1;
		display: flex;
		align-items: center;
		word-spacing: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.enterprise-name {
		justify-content: space-between;
		.iconfont {
			flex-shrink: 0;
		}
	}
}

.tab-nav {
	height: 80rpx;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	border-bottom: 1rpx solid #666;
	.active {
		color: #fdc100 !important;
	}
	.tab-nav-item {
	white-space: nowrap;
		color: #b5b5b5;
		padding: 0 26rpx;
	}
}
</style>
