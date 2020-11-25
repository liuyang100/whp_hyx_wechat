<template>
	<view class="w-100 h-100">
		<view class="search-model ">
			<picker class="search-picker" mode="date" :value="default_time" :start="start_date" :fields="field" :end="end_date" @change="bindDateChange">
				<view class="s-item">
					<text>{{ default_time }}</text>
					<text class="iconfont">&#xe605;</text>
				</view>
			</picker>
		</view>
		
		<template v-if="list.length > 0">
			<view class="w-100 d-flex flex-column a-center  pb-3">
				<view class="card " v-for="(ins, sindex) in list" :key="sindex">
					<view class="card-item">
						<text class="left">新开网点名称:</text>
						<text class="right">{{ ins.name }}</text>
					</view>
					<view class="card-item">
						<text class="left">新增时间:</text>
						<text class="right">{{ ins.time }}</text>
					</view>
					<view class="card-item d-flex ">
						<text class="left flex-shrink">操作品牌品类:</text>
						<view class="right">
							<text class="mr-1">{{ ins.brandcategory_name }}</text>
						</view>
					</view>
				</view>
			</view>
			<l-scroll-loading :loadingType="loadingType" />
			<!-- 时间选择 -->
		</template>

		<template v-if="!isFirstLoad && list.length == 0">
			<view class="w-100 py-5 d-flex  j-center a-center"><text>没有查到任何数据。</text></view>
		</template>
	</view>
</template>

<script>
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading';
import { mapState } from 'vuex';
import { timeFormat } from '@/ulits/function/timeFormat.js';
export default {
	components: {
		lScrollLoading
	},
	data() {
		/* 
		 @param currentDate   获取当前时间
		 @param tenAgoTimeStr  起始时间(计算距离当前十年前的1月1号)
		 @param end_date       结束时间
		 */
		let currentDate = timeFormat(null, 'yyyy-mm');
		let subYearStr = currentDate.split('-')[0];
		let tenAgoTimeStr = Number(subYearStr) - 10;
		tenAgoTimeStr = tenAgoTimeStr.toString() + '-01';
		return {
			field: 'month',
			default_time: currentDate,
			start_date: tenAgoTimeStr,
			end_date: currentDate,
			loadingType: 5,
			islodMore: true,
			isFirstLoad: true,
			cleaTime: null,
			list: [],
			pagenumber: 1,
			pagesize: 10
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		// 获取列表数据
		this.getList().then(res => {
			this.runderData({
				list: res,
				isReset: true,
				callback: () => {
					uni.hideLoading();
				}
			});
		});
	},

	// 下拉刷新
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中...',
			mask: true
		});
		this.pagenumber = 1;
		this.getList().then(res => {
			this.runderData({
				list: res,
				isReset: true,
				callback: () => {
					uni.stopPullDownRefresh();
				}
			});
		});
	},
	// 上拉加载
	onReachBottom() {
		if (this.loadingType !== 5 || this.islodMore === false) return;
		this.loadingType = 1;
		// 防抖函数
		if (this.cleaTime) clearTimeout(this.cleaTime);
		this.cleaTime = setTimeout(this.upMoreFun, 1000);
	},

	computed: {
		...mapState({
			loginInfo: state => state.user.loginInfo
		})
	},

	methods: {
		upMoreFun() {
			let that = this;
			that.pagenumber++;
			that.getList()
				.then(res => {
					that.runderData({
						list: res,
						isReset: false,
						callback: () => {
							this.loadingType = 3;
							uni.hideLoading();
						}
					});
				})
				.catch(err => {
					that.pagenumber--;
					that.loadingType = 0;
					uni.showToast({
						title: '上拉加载失败',
						icon: none,
						duration: duration
					});
				});
		},

		runderData(roptions) {
			if (!roptions) return;
			const { list, isReset, callback } = roptions;
			
			if (this.pagenumber <= 1) {
				this.isFirstLoad = false;
				if (list.length < this.pagesize) {
					this.islodMore = false;
					this.loadingType =5;
				} else {
					this.islodMore = true;
				}
			} else{
				if (list.length < this.pagesize) {
					this.islodMore = false;
					this.loadingType =2;
				} else {
					this.islodMore = true;
				}
			}
			const tempList = this.list;
			this.list = isReset ? list : [...tempList, ...list];
			typeof callback == 'function' && callback();
		},

		getList() {
			return new Promise((resolve, reject) => {
				let params = {
					userid: this.loginInfo.username,
					custom_time: this.default_time,
					pageNumber: this.pagenumber,
					pageSize: this.pagesize
				};
				this.$myRequest({
					url: this.$myhttpUrl.index_not_dot_list,
					data: params,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject({ err: '获取数据失败。' });
					}
				});
			});
		},

		// 选择时间触发
		bindDateChange(e) {
			this.default_time = e.detail.value;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			this.getList().then(res => {
				this.runderData({
					list: res,
					isReset: true,
					callback: () => {
						uni.hideLoading();
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	min-height: 100%;
	background-color: #f5f5f5;
}

.card {
	width: 702rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	background-color: #ffffff;
	margin-top: 24rpx;
	box-sizing: border-box;
	overflow: hidden;
	white-space: normal;
	text-overflow: ellipsis;
	padding: 30rpx;
	font-size: 32rpx;
	.card-item {
		line-height: 1.6;
		.left {
			color: #999999;
			margin-right: 10rpx;
		}
		.right {
			color: #333333;
		}
	}
}
.search-model {
	position: sticky;
	top: 0;
	width: 100%;
	height: 88rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	display: flex;
	font-size: 28rpx;
	.search-picker {
		width: 100%;
		height: 88rpx;
		.s-item {
			flex: 1;
			height: 88rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont {
				box-sizing: border-box;
				font-size: 50rpx;
				line-height: 1;
				vertical-align: middle;
				padding-top: 8rpx;
			}
		}
	}
}
</style>
