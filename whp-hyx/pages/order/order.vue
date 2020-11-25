<template>
	<view class="w-100 h-100 d-flex flex-column ">
		<view id="ly-Header">
			<view class="navbar-header">
				<uni-status-bar bgcolor="#fdc100"></uni-status-bar>
				<!-- 顶部切换 -->
				<view class="nav_top main-bg-color  d-flex a-center">
					<viwe class="nav-right" :style="{ width: leftBackWidth }"></viwe>
					<view class="flex-1 d-flex a-center j-sb">
						<view
							v-for="(item, index) in tabnav"
							:key="item.id"
							class=" px-2 mx-1 d-flex a-center j-center"
							style="width: 110rpx;height: 44rpx;font-size: 26rpx;"
							:style="tabindex == index ? 'background: #FFFFFF;color: #333333;border-radius: 60rpx;' : 'color: #FFFFFF;'"
							@click="changTab(index)"
						>
							{{ item.name }}
						</view>
					</view>
						
						<viwe class="nav-right" :style="{ width: leftBackWidth }"></viwe>
				</view>
			</view>
			<view class="order-info main-bg-color" :style="{ marginTop: marginTopHei }">
				<view class="statistical flex-1 a-center j-center">
					<block v-if="tabindex == 0">
						<view class="total">
							<text>￥{{ listdata[tabindex].customer_count }}</text>
						</view>
						<view class="unit">
							<text>{{ listdata[tabindex].text }}</text>
						</view>
					</block>
					<block v-if="tabindex == 1">
						<view class="total">
							<text>￥{{ listdata[tabindex].customer_count }}</text>
						</view>
						<view class="unit">
							<text>{{ listdata[tabindex].text }}</text>
						</view>
					</block>
				</view>
				<!-- 搜索 -->
				<view class="search">
					<ly-search-bar
						class="flex-1"
						:height="66"
						:size="23"
						bgColor="#F8F8F8"
						clearButton="auto"
						:radius="4"
						:cancelButton="false"
						placeholder="请输入搜索内容"
						@confirm="searchGo"
					/>
				</view>
				<view class="goods-status">
					<view
						class="goods-item-status"
						@click="changSubStatus(goodi)"
						:class="subIndex == goodi ? 'active' : ''"
						v-for="(goods, goodi) in goodStatusList"
						:key="goods.id"
					>
						<view class="goods-status-name">
							<text>{{ goods.name }}</text>
						</view>
						<view class="goods-item-line"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="archive_box flex-1">
			<swiper class="w-100 h-100" :current="tabindex">
				<swiper-item>
					<swiper :duration="200" class="w-100 h-100" :current="subIndex">
						<swiper-item class="w-100 h-100" v-for="(item, index) in goodStatusList" :key="item.id">
							<scroll-view class="w-100 h-100" scroll-y="true">
								<view class="goods-item" v-for="item in 1" :key="item">
									<view class="conent">
										<view class="shop-ifno">
											<view class="left">
												<tex>河源市源城好万家电器有限公司</tex>
												<tex>订单编号:12312332</tex>
												<view class="company-name">
													<text class="iconfont">&#xe638;</text>
													<text>惠尔浦(中国)股份有限公司</text>
												</view>
											</view>
											<view class="right">
												<text v-if="index == 0" key="status">待付款</text>
												<text v-else-if="index == 1" key="status">待发货</text>
												<text v-else-if="index == 2" key="status">已发货</text>
												<text v-else key="status">已经收货</text>
											</view>
										</view>
										<view class="shop-info">
											<image src="/static/img/stop/img_fenxiang.png" class="img" mode="widthFix"></image>
											<view class="goods-desc"><text>BDC-593WDBGW波尔白;U905平台/对开门/惠而浦变频/小暗黑</text></view>
											<view class="price-info">
												<text>￥242.90</text>
												<text class="num">X1</text>
											</view>
										</view>
										<view class="shop-settlement">
											<view class="shop-set-box">
												<view class="sett-price">
													<text>
														共
														<text class="main-num">1</text>
														件商品,总金额:
														<text>￥739.90</text>
													</text>
												</view>
												<view class="go-payment" v-if="index == 0" key="operation"><text>去付款</text></view>
												<view class="no-go-payment" v-else-if="index == 1" key="operation"></view>
												<view class="go-payment" v-else-if="index == 2" key="operation"><text>确认收货</text></view>
												<view class="no-go-payment" v-else key="operation"></view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</swiper-item>
				<swiper-item>
					<swiper :duration="200" class="w-100 h-100" :current="subIndex">
						<swiper-item class="w-100 h-100" v-for="(item, index) in goodStatusList" :key="item.id">
							<scroll-view class="w-100 h-100" scroll-y="true">
								<view class="goods-item" v-for="item in 1" :key="item">
									<view class="conent">
										<view class="shop-ifno">
											<view class="left">
												<tex>河源市源城好万家电器有限公司</tex>
												<tex>订单编号:12312332</tex>
												<view class="company-name">
													<text class="iconfont">&#xe638;</text>
													<text>惠尔浦(中国)股份有限公司</text>
												</view>
											</view>
											<view class="right">
												<text v-if="index == 0" key="status">待付款</text>
												<text v-else-if="index == 1" key="status">待发货</text>
												<text v-else-if="index == 2" key="status">已发货</text>
												<text v-else key="status">已经收货</text>
											</view>
										</view>
										<view class="shop-info">
											<image src="/static/img/stop/img_fenxiang.png" class="img" mode="widthFix"></image>
											<view class="goods-desc"><text>BDC-593WDBGW波尔白;U905平台/对开门/惠而浦变频/小暗黑</text></view>
											<view class="price-info">
												<text>￥232.90</text>
												<text class="num">X1</text>
											</view>
										</view>
										<view class="shop-settlement">
											<view class="shop-set-box">
												<view class="sett-price">
													<text>
														共
														<text class="main-num">1</text>
														件商品,总金额:
														<text>￥799.90</text>
													</text>
												</view>
												<view class="go-payment" v-if="index == 0" key="operation"><text>去付款</text></view>
												<view class="no-go-payment" v-else-if="index == 1" key="operation"></view>
												<view class="go-payment" v-else-if="index == 2" key="operation"><text>确认收货</text></view>
												<view class="no-go-payment" v-else key="operation"></view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import uniStatusBar from '@/components/uni/uni-status-bar/uni-status-bar.vue';
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import loadMore from '@/components/common/load-more/load-more.vue';
import { mapState } from 'vuex';
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
	data() {
		return {
			firstLoad: 'beforeLoad',
			tabnav: [],
			listdata: [],
			tabindex: 0,
			subIndex: 0,
			goodStatusList: [],
			marginTopHei: 0
		};
	},

	components: {
		uniStatusBar,
		lySearchBar,
		loadMore
	},
	

	onLoad(option) {
		uni.getSystemInfo({
			success: res => {
				console.log(res, '获取布局信息');

				this.marginTopHei = uni.upx2px(80) + res.statusBarHeight + 'px';
			}
		});
		this.tabnav = [
			{
				name: '订单总额',
				id: 0
			},
			{
				name: '订单总量',
				id: 1
			}
		];
		this.goodStatusList = [
			{
				id: 1,
				name: '待付款'
			},
			{
				id: 2,
				name: '待发货'
			},
			{
				id: 3,
				name: '已发货'
			},
			{
				id: 4,
				name: '已收货'
			}
		];
		let listlength = this.tabnav.length;
		this.__init(listlength);
	},

	onPullDownRefresh() {},
	computed: {
		...mapState({
			is_main_companyInfo: state => state.user.is_main_companyInfo,
			role_name: state => state.user.role_name
		}),
		// 计算拿到当前listdata的对象
		listItem() {
			return this.listdata[this.tabindex];
		},
		leftBackWidth() {
			return systemInfo.windowWidth - menuButtonInfo.left + 'px';
		}
	},

	methods: {
		__init(listlength) {
			// 列表
			let arr = [];
			for (let i = 0; i < listlength; i++) {
				let obj = {
					pagesize: 10,
					pagenumber: 1,
					keyword: '',
					firstLoad: 'before',
					customer_count: i == 0 ? 192000 : 601000,
					text: i == 0 ? '订单总金额(万元)' : '订单总数量(单)',
					loadingType: 0,
					islodMore: false,
					list: []
				};
				arr.push(obj);
			}
			this.listdata = arr;
			// h获取列表数据
			// uni.showLoading({
			// 	title: '加载中'
			// });
			// this.getDataList(
			// 	{
			// 		is_active: 1, //激活0 未激活  1激活
			// 		pagesize: '10',
			// 		pagenumber: 1,
			// 		flag: 1
			// 	},
			// 	() => {
			// 		this.listdata[this.tabindex].firstLoad = 'after';
			// 	}
			// );
		},

		// 加载更多
		upMore() {
			let item = this.listdata[this.tabindex];
			item.islodMore = true;
			setTimeout(() => {
				if (item.loadingType !== 0) {
					return;
				}
				item.loadingType = 1;
				item.pagenumber++;
				let data = this.getReqParam();
				this.getDataList(data, () => {
					item.islodMore = false;
					item.loadingType = 0;
				});
			}, 800);
		},

		// 点击搜索
		searchGo(obj) {
			this.listItem.keyword = obj.value;
			uni.showLoading({
				title: '搜索中...'
			});
			// let data = this.getReqParam();
			// this.getDataList(data, false, true);
			setTimeout(() => {
				uni.hideLoading();
			}, 2000);
		},

		// 获取首页数据
		getDataList(data = {}, callback = false, refresh = false) {
			this.$myRequest({
				url: this.$myhttpUrl.custBizIndex,
				data: data,
				success: res => {
					let item = this.listdata[this.tabindex];
					if (res.datas) {
						// 已激活的数量
						item.customer_count = res.customer_count;
						// 是否下拉刷新refresh
						item.list = refresh ? [...res.datas] : [...item.list, ...res.datas];

						if (res.datas.length < item.pagesize) {
							item.loadingType = 2;
							setTimeout(() => {
								item.islodMore = false;
							}, 2000);
						}
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						item.list = [];
					}
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},

		// 遍历修改key值
		parseJson(arr) {
			arr = arr.slice();

			function toParse(arr) {
				arr.forEach(item => {
					if (item.list && Array.isArray(item.list)) {
						item['children'] = item.list;
						toParse(item['children']);
					}
					delete item.list;
				});
				return arr;
			}
			return toParse(arr);
		},

		changTab(k) {
			// 点击地址切换
			if (this.tabindex === k) {
				return;
			}
			this.tabindex = k;
		},

		// 切换商品选择状态
		changSubStatus(goodi) {
			if (this.subIndex == goodi) return;
			this.subIndex = goodi;
		},

		// 获取请求参数
		getReqParam() {
			let itemobj = this.listdata[this.tabindex];
			let data = {
				flag: this.searchOptions.flag,
				is_active: this.tabindex ? 0 : 1,
				keyword: this.keyword,
				pagenumber: itemobj.pagenumber,
				pagesize: itemobj.pagesize
			};
			if (this.one_category_id) {
				data.one_category_id = this.one_category_id;
			}
			if (this.two_category_id) {
				data.two_category_id = this.two_category_id;
			}
			if (this.three_category_id) {
				data.three_category_id = this.three_category_id;
			}
			if (this.area_id) {
				data.area_id = this.area_id;
			}
			return data;
		}
	}
};
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color:#f5f5f5;
	}
.nav_top {
	height: 80rpx;
	position: relative;
	box-sizing: border-box;
	z-index: 99;
}
.goback {
	position: absolute;
	top: 50%;
	left: 10rpx;
	margin-top: -40rpx;
}

.navbar-header {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
}
.order-info {
	height: 364rpx;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.search {
		margin-top: auto;
		margin-bottom: 40rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.statistical {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.total {
			font-size: 48rpx;
			color: #ffffff;
		}
		.unit {
			font-size: 26rpx;
			color: #eeeeee;
		}
	}
	.goods-status {
		height: 88rpx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.goods-item-status {
			flex: 1;
			display: flex;
			align-items: center;
			height: 88rpx;
			background: #ffffff;
			border-bottom: 2rpx solid #ffffff;
			box-sizing: border-box;
			color: #333333;
			&:last-child .goods-item-line {
				height: 0rpx !important;
				width: 0rpx !important;
			}
			&.active {
				color: #ffd85c !important;
				border-bottom: 2rpx solid #ffc610;
			}

			.goods-status-name {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
			}
			.goods-item-line {
				height: 28rpx;
				width: 1rpx;
				background: #cccccc;
			}
		}
	}
}

.goods-item {
	width: 100%;
	height: 500rpx;
	box-sizing: border-box;
	background-color: #eeeeee;
	padding-top: 20rpx;
	.conent {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		.shop-ifno {
			box-sizing: border-box;
			display: flex;
			padding: 16rpx 20rpx;
			height: 148rpx;
			.left {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				line-height: 1.6;
				color: #c7c7c7;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.company-name {
					.iconfont {
						font-size: 26rpx;
					}
				}
			}
			.right {
				font-size: 24rpx;
				color: #ff7b13;
			}
		}
		.shop-info {
			height: 200rpx;
			display: flex;
			width: 100%;
			box-sizing: border-box;
			background: #ffffff;
			padding: 0 20rpx;
			.img {
				flex-shrink: 0;
				width: 180rpx;
				height: 180rpx;
				border-radius: 8rpx;
			}
			.goods-desc {
				font-size: 24rpx;
				color: #333333;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-wrap: break-word;
				word-break: break-all;
				padding-left: 30rpx;
				padding-right: 30rpx;
			}
			.price-info {
				font-size: 24rpx;
				color: #333333;
				display: flex;
				flex-direction: column;
				.num {
					color: #bebebe;
				}
			}
		}
	}
}

.shop-settlement {
	height: 146rpx;
	padding: 0 20rpx;
	background: #ffffff;
	display: flex;
	.shop-set-box {
		margin-left: auto;
		display: flex;
		flex-direction: column;
		height: 146rpx;
		.sett-price {
			font-size: 24rpx;
			color: #ababab;
			.main-num {
				color: #ec7164;
			}
		}
		.go-payment {
			margin-top: 30rpx;
			margin-left: auto;
			height: 52rpx;
			width: 146rpx;
			text-align: center;
			line-height: 52rpx;
			border-radius: 52rpx;
			border: 2rpx solid #ec7164;
			box-sizing: border-box;
			background-color: #ffffff;
			color: #ec7164;
			font-size: 28rpx;
		}
		.no-go-payment {
			margin-top: 30rpx;
			margin-left: auto;
			height: 52rpx;
			width: 146rpx;
		}
	}
}
</style>
