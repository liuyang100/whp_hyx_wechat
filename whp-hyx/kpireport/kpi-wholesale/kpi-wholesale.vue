<template>
		<view class="current-page">
		<channel-search :value-name="valueName" :cust="resultData" @search="search" @reset="reset" @selperson="selperson"></channel-search>
		<!-- 年汇总数据 -->
		<view class="card--box" v-for="(item, index) in list" :key="index">
			<view v-if="index === 0" class="y-head--style">{{ item.brand_pc_name }}</view>
			<view v-else class="brand-head--style">{{ item.brand_pc_name }}</view>
			<view class="uchart-card">
				<view class="uchart--head">
					<view class="left-continer">年汇总数据</view>
					<view class="look-desc" @click="lookDetail(1, item)">查看明细</view>
				</view>
				<view class="uchart--body">
					<view class="y-propress">
						<cmd-progress
							strokeColor="rgb(253, 223, 78)"
							type="circle"
							:percent="computePre(item.amout_year, item.task_amout_year)"
							:width="100"
							:stroke-width="8"
						></cmd-progress>
						<view class="y-info">
							<view class="amount mb-amount">
								<text class="key-name">采购目标金额:</text>
								<text class="key-value">¥{{ item.task_amout_year | getPoint }}</text>
							</view>
							<view class="amount sj-amount">
								<text class="key-name">实际完成金额:</text>
								<text class="key-value">¥{{ item.amout_year | getPoint }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uchart-card">
				<view class="uchart--head">
					<view class="left-continer">月完成进度</view>
					<view class="look-desc" @click="lookDetail(2, item)">查看当月明细</view>
				</view>
				<view class="uchart--body">
					<view class="qiun-charts">
						<u-charts-item
							chartType="column"
							:pixelRatio="pixelRatio"
							:cWidth="cWidth"
							:cHeight="cHeight"
							:opts="item.column"
							:canvasId="'canvas_s' + index"
							:ref="'canvas_s' + index"
						/>
					</view>
				</view>
			</view>
		</view>
		<view @click="upLoadMore"><l-scroll-loading :loadingText="loadingText" :loadingType="loadingType" /></view>
	</view>
</template>

<script>
import channelSearch from '@/kpireport/components/channel-search/channel-search.vue';
import cmdProgress from '@/components/common/cmd-progress/cmd-progress.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
import uChartsItem from '@/kpireport/components/u-charts/component.vue';
import uCharts from '@/kpireport/components/u-charts/u-charts.js';
import { isJSON } from '@/kpireport/components/u-charts/checker.js';
var _self;
var canvaColumn = null;
import { mapState, mapActions } from 'vuex';
export default {
	name: 'my-pruchase',
	components: {
		'u-charts-item': uChartsItem,
		channelSearch,
		cmdProgress,
		'l-scroll-loading': lScrollLoading
	},

	data() {
		return {
			storeKeyName: 'KPISALESMAN_LIST',
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			one_category_id: null,
			two_category_id: null,
			salesman_ids: '',
			show_brandlist: ['HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXLSQDZJ'],
			list: [],
			temp_category_list: [],
			more_index: 0,
			is_lock: false,
			loadingType: 5,
			loadingText: ['点击或者上拉加载更多', '正在努力加载', '已经加载全部数据', '', ''],
			valueName: ''
		};
	},

	onLoad() {
		this.clearBrandCatrty();
		_self = this;
		//#ifdef MP-ALIPAY
		uni.getSystemInfo({
			success: function(res) {
				if (res.pixelRatio > 1) {
					//正常这里给2就行，如果pixelRatio=3性能会降低一点
					//_self.pixelRatio =res.pixelRatio;
					_self.pixelRatio = 2;
				}
			}
		});
		//#endif
		this.cWidth = uni.upx2px(690);
		this.cHeight = uni.upx2px(550);
		this.is_lock = false;
		this.more_index = 0;
		this.loadingType = 5;
		this.list = [];
		this.one_category_id = null;
		this.two_category_id = null;
		this.salesman_ids = '';
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.__init();
	},
	onUnload() {
		console.log('页面卸载');
		this.clearBrandCatrty();
	},
	filters: {
		getPoint(num) {
			num = (parseFloat(num) / 10000).toFixed(2);
			num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			num = num + '万元';
			return num;
		}
	},
	computed: {
		...mapState({
			resultData: state => state.channel.data, // 渠道数据
			role_code: state => state.user.role_code
		}),
		reqParams() {
			let temp = {};
			if (this.one_category_id !== null) {
				temp.one_category_id = this.one_category_id;
			}
			if (this.two_category_id !== null) {
				temp.two_category_id = this.two_category_id;
			}
			if (this.show_brandlist.includes(this.role_code)) {
				if (this.salesman_ids) {
					temp.salesman_ids = this.salesman_ids;
				}
			}
			return temp;
		},
		brandParams() {
			if (this.list.length && this.temp_category_list[this.more_index] && this.is_lock) {
				let { brand_id, pc_id } = this.temp_category_list[this.more_index];
				return {
					brand_id,
					pc_id
				};
			}
		}
	},
	onReachBottom() {
		this.upLoadMore();
	},
	methods: {
		...mapActions(['getQuDaoData']),
		// 清除选择业务员或者终端主管
		clearBrandCatrty() {
			uni.removeStorage({
				key: this.storeKeyName,
				success: function(res) {
					console.log('success');
				}
			});
		},
		/**
		 * @param {String } overMoney  完成金额（元）
		 * @param {type} targetMoney  目标金额（元）
		 * @param {Number} computePre  计算完成率（ 保留两位小数）
		 */
		computePre(overMoney, targetMoney) {
			overMoney = parseFloat(overMoney);
			targetMoney = parseFloat(targetMoney);
			return ((overMoney / targetMoney) * 100).toFixed(2);
		},

		// 初始化数据
		async __init(data = {}) {
			this.one_category_id = null;
			this.two_category_id = null;
			this.salesman_ids = '';
			let reqData = this.reqParams;
			try {
				await this.getQuDaoData();
				let yearSummary = await this.getYearSummary(reqData);
				let brandCategoryIdList = await this.getBrandCategoryIdList();
				this.list = [yearSummary];
				this.temp_category_list = brandCategoryIdList;
				this.upLoadMore();
				uni.hideLoading();
			} catch (e) {
				console.log('error', e);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			}
		},
		upLoadMore() {
			if (this.is_lock || this.loadingType !== 5) return;
			this.is_lock = true;
			this.loadingType = 0;
			const dataListLength = this.list.length;
			const categoryListLength = this.temp_category_list.length;
			setTimeout(() => {
				this.more_index = dataListLength - 1;
				this.loadingType = 1;
				let reqData = { ...this.reqParams, ...this.brandParams };
				this.getBrandCategoryMonthSummary(reqData)
					.then(res => {
						// 合并品牌品类
						let asignObject = { ...this.brandParams, ...res };
						this.list.push(asignObject);
						if (this.more_index >= categoryListLength - 1) {
							this.loadingType = 2;
						} else {
							this.loadingType = 5;
						}
						this.is_lock = false;
					})
					.catch(err => {
						this.loadingType = 5;
						this.is_lock = false;
						console.log('失败', err);
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					});
			}, 400);
		},

		// 搜索
		search(searchObj) {
			if (this.is_lock) return;
			this.is_lock = true;
			let { one_category_id, two_category_id } = searchObj;
			this.one_category_id = one_category_id;
			this.two_category_id = two_category_id;
			this.more_index = 0;
			this.loadingType = 5;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			let reqData = this.reqParams;
			this.getYearSummary(reqData)
				.then(res => {
					this.list = [res];
					this.is_lock = false;
					this.upLoadMore();
					uni.hideLoading();
				})
				.catch(err => {
					console.log(err, '报错');
					this.is_lock = false;
					uni.showToast({
						title: '获取年汇总数据失败',
						icon: 'none'
					});
				});
		},
		// 重置
		reset(resetObj) {
			const tempObj = resetObj || {};
			this.search(tempObj);
		},
		// 选中分公司/员工
		selperson(options) {
			if (this.is_lock) return;
			this.is_lock = true;
			let { store_id, valueName } = options;
			this.valueName = valueName;
			let salesman_ids = null;
			if (store_id.length > 0) {
				salesman_ids = store_id.join(',');
			}
			this.salesman_ids = salesman_ids;
			this.more_index = 0;
			this.loadingType = 5;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			let reqData = { ...this.reqParams };
			this.getYearSummary(reqData)
				.then(res => {
					this.list = [res];
					this.is_lock = false;
					this.upLoadMore();
					uni.hideLoading();
				})
				.catch(err => {
					console.log(err, '报错');
					this.is_lock = false;
					uni.showToast({
						title: '查询分公司/人员失败',
						icon: 'none'
					});
				});
		},

		lookDetail(type, item) {
			let obj = {};
			if (item.brand_pc_name == '批发分销汇总报表') {
				obj.navtitleText = `批发分销${type === 1 ? '年' : '月'}汇总数据明细`;
				obj.url = this.$myhttpUrl.kpi_myfx_all_items;
			} else {
				obj.navtitleText = `${item.brand_pc_name}批发分销${type === 1 ? '年汇总数据' : '月完成进度'}明细`;
				obj.url = this.$myhttpUrl.kpi_myfx_brand_pc_items;
			}
			obj.type = type;
			obj.one_category_id = this.one_category_id;
			obj.two_category_id = this.two_category_id;
			obj.salesman_ids = this.salesman_ids;
			obj.brand_id = item.brand_id || null;
			obj.pc_id = item.pc_id || null;
			obj.is_existed = null;
			this.$myNavigateTo('/kpireport/BrandCategoryDetail/BrandCategoryDetail', { item: obj });
		},

		// 品牌品类id
		getBrandCategoryIdList() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.brand_pc_list,
					data: {},
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},
		// 获取年汇总数据
		getYearSummary(data = {}) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.kpi_myfx_all,
					data: data,
					success: res => {
						const { task_amout_year, amout_year, months, task_amout_months, amout_months } = res;
						let Column = { categories: [], series: [] };
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories = months;
						const completionData = new Array(months.length).fill(0);
						Column.series = [
							{
								color: '#FDC100',
								data: task_amout_months,
								index: 0,
								legendShape: 'rect',
								name: '目标金额',
								pointShape: 'circle',
								show: true,
								type: 'column'
							},
							{
								color: '#F9891F',
								data: amout_months,
								index: 0,
								legendShape: 'rect',
								name: '完成金额',
								pointShape: 'circle',
								show: true,
								type: 'column'
							},
							{
								color: '#CECECE',
								data: completionData,
								index: 0,
								legendShape: 'rect',
								name: '完成进度',
								pointShape: 'circle',
								show: false,
								type: 'column'
							}
						];
						resolve({
							column: Column,
							brand_pc_name: '批发分销汇总报表',
							task_amout_year,
							amout_year
						});
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},

		// 品牌品类月统计数据
		getBrandCategoryMonthSummary(data = {}) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.kpi_myfx_brand_pc,
					data: data,
					success: res => {
						const { task_amout_year, amout_year, months, task_amout_months, amout_months, brand_pc_name } = res;
						let Column = { categories: [], series: [] };
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories = months;
						const completionData = new Array(months.length).fill(0);
						Column.series = [
							{
								color: '#FDC100',
								data: task_amout_months,
								index: 0,
								legendShape: 'rect',
								name: '目标金额',
								pointShape: 'circle',
								show: true,
								type: 'column'
							},
							{
								color: '#F9891F',
								data: amout_months,
								index: 0,
								legendShape: 'rect',
								name: '完成金额',
								pointShape: 'circle',
								show: true,
								type: 'column'
							},
							{
								color: '#CECECE',
								data: completionData,
								index: 0,
								legendShape: 'rect',
								name: '完成进度',
								pointShape: 'circle',
								show: false,
								type: 'column'
							}
						];
						resolve({
							column: Column,
							task_amout_year,
							amout_year,
							brand_pc_name
						});
					},
					fail: err => {
						reject(err);
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
.current-page{
	width: 750rpx;
	min-height: 110vh;
	background-color: #f0f0f0;
}

.qiun-charts {
	width: 690rpx;
	height: 550rpx;
	background-color: #ffffff;
}

.charts {
	width: 690rpx;
	height: 550rpx;
	background-color: #ffffff;
}

.uchart-card {
	background-color: #ffffff;
}
.card--box {
	background-color: #ffffff;
	margin-top: 20rpx;
	overflow: hidden;
}
.y-head--style {
	padding: 0rpx 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	font-size: 32rpx;
	color: #333333;
	background-color: #ffffff;
	font-weight: bold;
}
.brand-head--style {
	margin: 26rpx 0;
	padding: 0 30rpx;
	text-align: center;
	height: 60rpx;
	line-height: 60rpx;
	width: 222rpx;
	box-sizing: border-box;
	border-top-right-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	background: linear-gradient(127deg, #ffc818 0%, #ffae0b 100%);
	font-size: 28rpx;
	color: #ffffff;
}
.uchart--head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80rpx;
	width: 750rpx;
	box-sizing: border-box;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #f0f0f0;

	.look-desc {
		font-size: 28rpx;
		color: #666666;
		display: flex;
		align-items: center;
		&::after {
			font-family: 'iconfont';
			content: '\e770';
			color: #666666;
			width: 28rpx;
			height: 28rpx;
			font-size: 28rpx;
			line-height: 34rpx;
			display: inline-block;
			vertical-align: middle;
		}
	}
}
.uchart--body {
	width: 750rpx;
	height: auto;
	box-sizing: border-box;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}
.left-continer {
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}
.left-continer::before {
	content: '';
	display: inline-block;
	width: 8rpx;
	height: 24rpx;
	background-color: $main-theme-color;
	margin-right: 16rpx;
}

.y-propress {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	padding: 40rpx 60rpx 40rpx 20rpx;
	.y-info {
		margin-left: 50rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		.amount {
			white-space: nowrap;
			overflow: hidden;
			.key-name {
				font-size: 28rpx;
				color: #666666;
				margin-right: 6rpx;
			}
			.key-value {
				font-size: 30rpx;
				color: #333333;
				font-weight: 700;
			}
		}
	}
}
</style>
