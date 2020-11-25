<template>
	<view class="w-100 h-100 d-flex">
		<template v-if="list.length > 0">
			<view class="store-list">
				<view class="store-list-item" v-for="(item, index) in list" :key="item.id">
					<view class="store-item-name">
						<text>{{ item.name }}</text>
						<view class="store-item-dengji" v-if="item.wangdian_type">
							<image class="img" src="/static/img/icon_dengji.png"></image>
							<text class="text">{{ item.wangdian_type }}</text>
						</view>
					</view>
					<view class="store-desc d-flex a-center">
						<!-- 1是0否 是否主店 -->
						<view class="store-type" v-if="item.is_main_store">主店</view>
						<view class="daili-type" v-if="item.store_category_name">{{ item.store_category_name }}</view>
					</view>
					<view class="task-tongji text-light-muted ">
						<view>
							<view>
								<text class="mr-1 ">账上余额:</text>
								<text class="text_price--color">{{ item.balance }}</text>
								<text>元</text>
							</view>
						</view>
						<view class="font-sm mb-1">
							<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.cg_amount, item.cg_task_amout)" />
							<view class=" d-flex a-center">
								<view class="">
									<text class="mr-1 ">当月采购目标金额</text>
									<text class="text_price--color">{{ item.cg_task_amout | getPoint }}</text>
									<text>元</text>
								</view>
								<text class="mx-1">,</text>
								<view class="">
									<text class="mr-1 ">已完成</text>
									<text class="text_price--color">{{ item.cg_amount | getPoint }}</text>
									<text>元</text>
								</view>
							</view>
						</view>
						<view class="font-sm mb-1">
							<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.sale_amount, item.sale_amount)" />
							<view class=" d-flex a-center">
								<view class="">
									<text class="mr-1 ">当月零售目标金额</text>
									<text class="text_price--color">{{ item.sale_task_amout | getPoint }}</text>
									<text>元</text>
								</view>
								<text class="mx-1">,</text>
								<view class="">
									<text class="mr-1 ">已完成</text>
									<text class="text_price--color">{{ item.sale_amount | getPoint }}</text>
									<text>元</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<load-more :islodMore="islodMore" :loadingType="loadingType"></load-more>
			</view>
		</template>
		<template v-if="list.length == 0 && firstload == 'after'">
			<not-thing class="w-100" />
		</template>
	</view>
</template>

<script>
import notThing from '@/components/common/nothing/nothing.vue';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar.vue';
import loadMore from '@/components/common/load-more/load-more.vue';
export default {
	components: {
		notThing,
		loadMore,
		ProgressBar
	},
	data() {
		return {
			loadingType: 0,
			islodMore: false,
			list: [],
			pagenumber: 1,
			pagesize: 10,
			firstload: 'before',
			type: 0
		};
	},
	onLoad(option) {
		option && (option = this.$formateOption(option));
		this.type = option.type;
		option.count = option.count;
		uni.showLoading();

		uni.setNavigationBarTitle({
			title: this.type ? `已巡逻(${option.count})` : `未巡逻(${option.count})`
		});

		//初始化数据
		this.getList(
			{
				pagenumber: 1,
				pagesize: 10
			},
			() => {
				uni.hideLoading();
			}
		);
	},
	// // 下拉刷新
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中...'
		});
		this.pagenumber = 1;
		let data = this.getReqParam();
		this.getList(
			data,
			() => {
				uni.stopPullDownRefresh();
			},
			true
		);
	},
	// // 上拉加载
	onReachBottom() {
		this.islodMore = true;
		if (this.loadingType !== 0) {
			return false;
		}
		this.loadingType = 1;
		this.pagenumber++;
		let data = this.getReqParam();
		this.getList(data, res => {
			uni.hideLoading();
			if (res.length < this.pagesize) {
				this.loadingType = 2;
				setTimeout(() => {
					this.islodMore = false;
				}, 2000);
				return false;
			}
			this.islodMore = false;
			this.loadingType = 0;
		});
	},
	filters: {
		getPoint(num) {
			num = parseFloat(num).toFixed(2);
			num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return num;
		}
	},
	methods: {
		/*
		 target  目标金额
		 actual   实际完成金额
		 */
		percentageFun(actual, target) {
			// 计算百分比,并且保留两位小数
			actual = parseFloat(actual);
			target = parseFloat(target);
			let proNum = (actual / target) * 100;
			return parseInt(proNum)
		},
		// 获取请求参数
		getReqParam() {
			let data = {
				pagenumber: this.pagenumber,
				pagesize: this.pagesize
			};
			return data;
		},
		getList(data = {}, callback = false, refresh = false) {
			this.$myRequest({
				url: this.type ? this.$myhttpUrl.index_visitedStore : this.$myhttpUrl.index_NoVisitedStore,
				data: data,
				success: res => {
					if (!res && !res.datas) {
						return uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					}
					let result = res.datas.map(v => {
						return {
							sale_amount: v.sale_amount / 10000,
							sale_task_amout: Number(v.sale_task_amout),
							cg_amount: v.cg_amount / 10000,
							cg_task_amout: v.cg_task_amout,
							id: v.id,
							store_category_name: v.store_category_name,
							name: v.name,
							is_main_store: v.is_main_store,
							wangdian_type: v.wangdian_type,
							balance: v.balance
						};
					});
					// 是否下拉刷新refresh
					this.list = refresh ? [...result] : [...this.list, ...result];
					if (this.firstload == 'before') {
						this.firstload = 'after';
					}
					if (typeof callback == 'function') {
						callback(result);
					}
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
	width: 100%;
	min-height: 100%;
	background-color: #f5f5f5;
}
.text_price--color {
	color: #ff4919;
}
.store-list {
	width: 100%;
	.store-list-item {
		border: 1px solid #eeeeee;
		border-bottom: 1rpx solid #eeeeee;
		padding: 30rpx;
		.store-item-name {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			.store-item-dengji {
				display: flex;
				position: relative;
				padding-left: 10rpx;
				.img {
					width: 110rpx;
					height: 46rpx;
				}

				.text {
					position: absolute;
					font-size: 22rpx;
					font-weight: bold;
					color: #ffffff;
					top: 50%;
					left: 60%;
					transform: translate(-50%, -50%);
				}
			}
		}
		.store-desc {
			font-size: 24rpx;
			line-height: 1.6;
			margin: 12rpx 0;
			.store-type {
				background-color: #ff7100;
				color: #ffffff;
				padding: 0 10rpx;
				margin-right: 24rpx;
			}
			.daili-type {
				padding: 0 10rpx;
				color: #ff7100;
				background-color: #ffffff;
				border: 1rpx solid #ff7100;
			}
		}
	}
}
</style>
