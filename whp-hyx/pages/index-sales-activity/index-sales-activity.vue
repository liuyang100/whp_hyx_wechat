<template>
	<view class="currt-page">
		<view>
			<view class="d-flex a-center j-end add-plan">
				<!-- 计划上报 -->
				<view class="plan-report" @click="addPlan">计划上报</view>
			</view>
			<!-- 头部内容 -->
			<view class="header">
				<view class="search">
					<icon class="search-icon" type="search" size="18" />
					<input class="search-input" type="text" v-model="keyword" placeholder="搜索关键词" @confirm="search" />
					<icon v-show="keywordLength" @click="keyword = ''" class="search-icon" type="clear" size="18" />
				</view>
				<view class="cancel-btn" v-show="keywordLength" @click="cancel">取消</view>
			</view>
		</view>

		<!-- 中间列表 -->
		<view class="card-list">
			<scroll-view
				scroll-y="true"
				class="scroll_views"
				:enable-flex="true"
				:refresher-threshold="45"
				:refresher-triggered="triggerRefreStatus"
				:refresher-enabled="true"
				refresher-default-style="none"
				@refresherpulling="refresherpulling"
				@refresherrefresh="refresherrefresh"
				@refresherrestore="refresherrestore"
				@refresherabort="refresherabort"
			>
				<view class="scroll-reload"><l-scroll-reload ref="l-scroll-reload" :reloadStatus="reloadStatus" /></view>
				<view class="w-100 d-flex flex-column a-center">
					<template v-if="searchNoThing">
						<view class="position-nothing" style="background-color: #EEEEEE; flex-direction: column;">
							<text>不好意思,没有查到任何数据。</text>
							<button type="default" size="mini" @click="searchNoThing = false">再搜索看看</button>
						</view>
					</template>
					<template v-else>
						<view class="card-list-item" @click.stop="goDetail(index)" v-for="(item, index) in list" :key="item.id">
							<view class="row">
								<text class="label">门店名称：</text>
								<text class="value">{{ item.customer_name }}</text>
							</view>
							<view class="row">
								<text class="label">活动时间：</text>
								<text class="value">{{ timeFun(item.estimatedBeginDate, item.estimatedEndDate) }}</text>
							</view>
							<view class="row">
								<text class="label">活动类型：</text>
								<text class="value">{{ activityTypeArr[item.activityType].name }}</text>
							</view>
							<view class="activity-stage" :class="item.activityStatues == 'N' ? 'ongoing' : item.activityStatues == 'Y' ? 'end' : ''">
								{{ item.activityStatues == 'N' ? '执行中' : item.activityStatues == 'Y' ? '已执行' : '' }}
							</view>
							<view class="ongoing-btn" v-if="item.activityStatues == 'N'" @click.stop="performReport(index)">执行上报</view>
						</view>
					</template>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import lScrollReload from '@/components/lScrollReload/lScrollReload';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading';
import { timeFormat } from '@/ulits/function/timeFormat.js';
export default {
	components: {
		lScrollReload,
		lScrollLoading
	},
	data() {
		const activityTypeArr = [
			{
				id: 0,
				name: '请选择'
			},
			{
				id: 1,
				name: '团购会'
			},
			{
				id: 2,
				name: '以旧换新'
			},
			{
				id: 3,
				name: '单品主推'
			},
			{
				id: 4,
				name: '微信秒杀'
			},
			{
				id: 5,
				name: '直播抢购'
			},
			{
				id: 6,
				name: '仓储直销'
			},
			{
				id: 7,
				name: '内购会'
			},
			{
				id: 8,
				name: '工厂巡展'
			},
			{
				id: 9,
				name: '拼团购'
			},
			{
				id: 10,
				name: '异业联盟'
			},
			{
				id: 11,
				name: '品牌联盟'
			}
		];
		return {
			activityTypeArr,
			isLoading: false,
			list: [],
			searchNoThing: false, // 搜索查询为空
			isEmpty: false, // 记录数据第一次加载是否未空
			// 下拉刷新
			triggerRefreStatus: false,
			reloadStatus: 5,
			keyword: ''
		};
	},
	onLoad() {
		this.__init();
	},

	computed: {
		keywordLength() {
			// 搜索框的文本长度
			return typeof this.keyword == 'string' && (this.keyword.trim().length ? true : false);
		}
	},

	methods: {
		clearnStorage() {
			uni.removeStorageSync('reportList');
		},

		async __init() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				let resData = await this.getData({});
				uni.hideLoading();
				const { datas, length } = resData;
				// 第一次加载数据为空
				if (length === 0) {
					this.isEmpty = true;
					return;
				}
				this.list = datas;
			} catch (err) {
				console.log(err);
				uni.showToast({
					title: '获取失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		timeFun(a, b) {
			const start_time = timeFormat(a, 'yyyy-mm-dd');
			const end_time = timeFormat(b, 'yyyy-mm-dd');
			return `${start_time}至${end_time}`;
		},

		refresherpulling() {
			this.reloadStatus = 0;
		},
		async refresherrefresh() {
			if (this.triggerRefreStatus) {
				return;
			}
			this.triggerRefreStatus = true;
			this.reloadStatus = 1;
			this.keyword = '';
			try {
				let resData = await this.getData();
				const { datas } = resData;
				this.list = datas;
				this.stopScrollLoading();
			} catch (err) {
				console.log(err);
				this.triggerRefreStatus = false;
				uni.showToast({
					title: '获取失败',
					icon: 'none'
				});
			}
		},
		stopScrollLoading(code = 2) {
			if (code) {
				this.reloadStatus = 2;
			}
			setTimeout(() => {
				this.triggerRefreStatus = false;
			}, 1000);
		},
		refresherrestore() {
			console.log('自定义下拉刷新被复位');
			this.triggerRefreStatus = false;
			this.reloadStatus = 0;
		},
		refresherabort() {
			console.log('自定义下拉刷新被中止');
			this.triggerRefreStatus = false;
			this.reloadStatus = 0;
		},

		/* 搜索事件 */

		cancel() {
			this.keyword = '';
			this.search();
		},

		// 提交搜索事件
		async search() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			let params = {
				keyword: this.keyword
			};
			try {
				const { datas, length } = await this.getData(params);
				uni.hideLoading();
				// 判断搜索条件是否为空
				if (length === 0) {
					this.searchNoThing = true;
					return;
				}
				this.list = datas;
			} catch (e) {
				//TODO handle the exception
				uni.showToast({
					title: '搜索失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		// 获取数据请求
		getData(options = {}) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.index_sales_promotion_list,
					data: options,
					success: res => {
						resolve(res);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},

		// 执行上报
		performReport(item) {
			console.log(item);
			// /
			this.$myNavigateTo('/pages/index-sales-activity/perform-report/perform-report', { activityStatues: 'Y', activity_id: this.list[item].activity_id, back_pages: 2 });
		},
		/* 添加计划上报 */
		addPlan() {
			this.$myNavigateTo('/pages/index-sales-activity/add-plan/add-plan');
		},
		/* 跳往详情 */
		goDetail(index) {
			const tempItem = this.list[index];
			this.$myNavigateTo('/pages/index-sales-activity/sales-activity-detail/sales-activity-detail', {
				activityStatues: tempItem.activityStatues,
				activity_id: tempItem.activity_id
			});
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
	background-color: #f6f6f6;
}
.position-nothing {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.currt-page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	.add-plan {
		background-color: #fdc100;
		padding-right: 26rpx;
		padding: 30rpx 26rpx;
		.plan-report {
			padding: 6rpx 28rpx;
			background-color: #00aa00;
			color: #ffffff;
			border-radius: 10rpx;
		}
	}
	/* 头部搜索 */
	.header {
		width: 750rpx;
		height: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #fdc100;
		display: flex;
		align-items: center;
		.search {
			flex: 1;
			height: 70rpx;
			border-radius: 35rpx;
			background-color: #fefefe;
			display: flex;
			align-items: center;
			.search-icon {
				padding: 0 16rpx 0 16rpx;
			}
			.search-input {
				width: 100%;
				height: 70rpx;
				line-height: 70rpx;
			}
		}
		.cancel-btn {
			white-space: nowrap;
			flex-shrink: 0;
			padding-left: 10rpx;
			color: #666666;
			font-size: 30rpx;
		}
	}
	/*  主体内容列表 */
	.card-list {
		flex: 1;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		overflow: hidden;
		.scroll_views {
			width: 100%;
			height: 100%;
			position: relative;
			flex-direction: column;
			.scroll-reload {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				transform: translateY(-100%);
				text-align: center;
			}
		}
		.card-list-item {
			margin-bottom: 22rpx;
			width: 704rpx;
			border-radius: 10rpx;
			padding: 20rpx;
			box-shadow: 2rpx 2rpx 6rpx #e2e2e2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			box-sizing: border-box;
			background-color: #ffffff;
			position: relative;
			font-size: 30rpx;
			.row {
				.label {
					color: #ababab;
				}
				.value {
					color: #333333;
				}
			}
			.activity-stage {
				display: inline-block;
				position: absolute;
				top: 18rpx;
				right: 22rpx;
				font-size: 30rpx;
				&.ongoing {
					color: #ff443a;
				}
				&.end {
					color: #44c7a0;
				}
			}
			.ongoing-btn {
				position: absolute;
				bottom: 18rpx;
				right: 22rpx;
				width: 146rpx;
				height: 44rpx;
				border-radius: 8rpx;
				color: #ffffff;
				font-size: 30rpx;
				background: #fdc100;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
}
</style>
