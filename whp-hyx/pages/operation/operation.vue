<template>
	<view class="current-page">
		<view id="nav-bar">
			<uni-status-bar bgcolor="#fdc100"></uni-status-bar>
			<view class="nav_top main-bg-color">
				<view class="goback" :style="{ width: leftBackWidth }"><uni-icons class="back-icon" color="#000000" type="arrowleft" size="24" @tap="back" /></view>
				<view class="nav-content">
					<view v-for="(item, index) in tabnav" :key="item.id" class="nav-text" :class="tabindex === index ? 'taphove' : 'tab'" @tap="changeTab(index)">
						{{ item.name }}
					</view>
				</view>
				<viwe class="nav-right" :style="{ width: leftBackWidth }"></viwe>
			</view>
		</view>
		<view class="swiper-box">
			<swiper :duration="0" class="my-swiper" :current="tabindex" @change="changeSwipter">
				<swiper-item class="my-swiper-item">
					<active-page
						ref="activePage"
						style="width: 100%;height: 100%;overflow: hidden;box-sizing: border-box;display: flex;flex-direction: column;"
						:islodMore="activePage.islodMore"
						:channel-data="activePage.custList"
						:keyword="activePage.keyword"
						:qudaoName="activePage.qudaoName"
						:isEmpty="activePage.isEmpty"
						:loadingType="activePage.loadingType"
						@resetIsEmpty="resetIsEmpty($event, 'activePage')"
						@inputChang="inputChang($event, 'activePage')"
						@qudaoConfim="qudaoConfim($event, 'activePage')"
						@searchInput="searchInput($event, 'activePage')"
						@cancelInput="cancelInput( 'activePage')"
						@qudaoReset="qudaoReset($event, 'activePage')"
						@downReset="downReset($event, 'activePage')"
						@scrollUpMore="scrollUpMore('activePage')"
					>
						<template v-slot:keHuInfo>
							<view class="custer-tml">
								<view class="custer-tml_view">
									<view>
										<view class="custer-tml_store-count">{{ activePage.store_count }}</view>
										<view class="custer-tml_text">客户总数(家)</view>
									</view>
								</view>
							</view>
						</template>
						<block v-for="(item, index) in activePage.list" :key="item.id">
							<view class="store-list-item">
								<view class="store-item-name">
									{{ item.name }}
									<view class="store-item-dengji" :data-star="item.wangdian_type" v-if="item.wangdian_type.length !== 0"></view>
								</view>
								<view class="store-desc">
									<view class="store-type" v-if="item.is_main_store == 1">主店</view>
									<view class="daili-type" v-if="item.store_category_name">{{ item.store_category_name }}</view>
								</view>
								<view class="task-tongji text-light-muted">
									<view>
										<text class="mr-1">账上余额:</text>
										<text class="text_price--color">{{ item.balance | getPoint }}</text>
										<text>元</text>
									</view>
									<view class="font-sm mb-1">
										<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.cg_amount, item.cg_task_amout)" />
										<view class=" d-flex a-center">
											<view class="">
												<text class="mr-1 ">当月采购目标金额</text>
												<text class="text_price--color">{{ item.cg_task_amout | getPoint }}</text>
												<text>万元</text>
											</view>
											<text class="mx-1">,</text>
											<view class="">
												<text class="mr-1 ">已完成</text>
												<text class="text_price--color">{{ item.cg_amount | getPoint }}</text>
												<text>万元</text>
											</view>
										</view>
									</view>
									<view class="font-sm mb-1">
										<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.sale_amount, item.sale_task_amout)" />
										<view class="d-flex a-center">
											<view class="">
												<text class="mr-1">当月零售目标金额</text>
												<text class="text_price--color">{{ item.sale_task_amout | getPoint }}</text>
												<text>万元</text>
											</view>
											<text class="mx-1">,</text>
											<view class="">
												<text class="mr-1 ">已完成</text>
												<text class="text_price--color">{{ item.sale_amount | getPoint }}</text>
												<text>万元</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</active-page>
				</swiper-item>
				<swiper-item class="my-swiper-item">
					<active-page
						ref="unactivePage"
						style="width: 100%;height: 100%;overflow: hidden;box-sizing: border-box;display: flex;flex-direction: column;"
						:channel-data="unactivePage.custList"
						:keyword="unactivePage.keyword"
						:qudaoName="unactivePage.qudaoName"
						:isEmpty="unactivePage.isEmpty"
						:loadingType="unactivePage.loadingType"
						:islodMore="unactivePage.islodMore"
						@resetIsEmpty="resetIsEmpty($event, 'unactivePage')"
						@inputChang="inputChang($event, 'unactivePage')"
						@qudaoConfim="qudaoConfim($event, 'unactivePage')"
						@searchInput="searchInput($event, 'unactivePage')"
						@cancelInput="cancelInput('unactivePage')"
						@qudaoReset="qudaoReset($event, 'unactivePage')"
						@downReset="downReset($event, 'unactivePage')"
						@scrollUpMore="scrollUpMore( 'unactivePage')"
					>
						<template v-slot:keHuInfo>
							<view class="custer-tml">
								<view class="custer-tml_view">
									<view>
										<view class="custer-tml_store-count">{{ unactivePage.store_count }}</view>
										<view class="custer-tml_text">客户总数(家)</view>
									</view>
								</view>
							</view>
						</template>

						<block v-for="(item, index) in unactivePage.list" :key="item.id">
							<view class="store-list-item">
								<view class="store-item-name">
									{{ item.name }}
									<view class="store-type" v-if="item.store_category_name">{{ item.store_category_name }}</view>
									<view class="store-add" v-if="false">+</view>
								</view>
								<view class="task-tongji text-light-muted">
									<view>
										<text class="mr-1">账上余额:</text>
										<text class="text_price--color">{{ item.balance | getPoint }}</text>
										<text>元</text>
									</view>
									<view class="font-sm mb-1">
										<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.cg_amount, item.cg_task_amout)" />
										<view class=" d-flex a-center">
											<view class="">
												<text class="mr-1 ">当月提货目标金额</text>
												<text class="text_price--color">{{ item.cg_task_amout | getPoint }}</text>
												<text>万元</text>
											</view>
											<text class="mx-1">,</text>
											<view class="">
												<text class="mr-1 ">已完成</text>
												<text class="text_price--color">{{ item.cg_amount | getPoint }}</text>
												<text>万元</text>
											</view>
										</view>
									</view>
									<view class="font-sm mb-1">
										<progress-bar :width="20" text-color="#ff4919" :percent="percentageFun(item.sale_amount, item.sale_task_amout)" />
										<view class="d-flex a-center">
											<view class="">
												<text class="mr-1">当月零售目标金额</text>
												<text class="text_price--color">{{ item.sale_task_amout | getPoint }}</text>
												<text>万元</text>
											</view>
											<text class="mx-1">,</text>
											<view class="">
												<text class="mr-1 ">已完成</text>
												<text class="text_price--color">{{ item.sale_amount | getPoint }}</text>
												<text>万元</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</active-page>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni/uni-icons/uni-icons.vue';
import uniStatusBar from '@/components/uni/uni-status-bar/uni-status-bar.vue';
import activePage from '@/components/brand/active-page.vue';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar.vue';
import { mapState, mapActions } from 'vuex';
import { isEmptyArarry, deepClone } from '@/ulits/Validation.js';
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
	components: {
		uniStatusBar,
		uniIcons,
		'active-page': activePage,
		'progress-bar': ProgressBar
	},
	data() {
		return {
			isLoading: false,
			tabindex: 0,
			tabnav: [],
			isloadChannel: false, // 渠道数据是否加载
			channelData: [], // 渠道源数据List
			activePage: {
				qudaoName: '全部客户',
				islodMore: false,
				isInit: false,
				isEmpty: false,
				loadingType: 5,
				store_count: 0,
				pagesize: 10, // 每次获取条数
				pagenumber: 1,
				list: [],
				one_category_id: null,
				one_category_id: null,
				two_category_id: null,
				three_category_id: null,
				keyword: '',
				url: this.$myhttpUrl.getCustomerByRole,
				custList: [] // 自定义的组织渠道数据
			},
			unactivePage: {
				qudaoName: '全部客户',
				islodMore: false,
				isInit: false,
				isEmpty: false,
				loadingType: 5,
				store_count: 0,
				pagesize: 10, // 每次获取条数
				pagenumber: 1,
				list: [],
				one_category_id: null,
				one_category_id: null,
				two_category_id: null,
				three_category_id: null,
				keyword: '',
				url: this.$myhttpUrl.getAgentCustomerByRole,
				custList: []
			}
		};
	},

	onLoad(option) {
		// 初始化导航栏
		this.tabnav = [
			{
				id: 1,
				name: '网点/门店'
			},
			{
				id: 2,
				name: 'KA/地零/批发'
			}
		];
		// 开启初始化
		this.activePageInit();
	},

	filters: {
		getPoint(num) {
			num = parseFloat(num).toFixed(2);
			num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return num;
		},
		filterChannel(value) {
			if (value === 0) {
				return deepClone(this.channelObject.cust);
			} else if (value === 1) {
				return this.renarr(this.channelObject.cust);
			}
		}
	},
	computed: {
		...mapState({
			is_has_company: state => state.user.is_has_company,
			role_code: state => state.user.role_code
		}),

		leftBackWidth() {
			return systemInfo.windowWidth - menuButtonInfo.left + 'px';
		}
	},
	watch: {
		tabindex(newval, oldval) {
			if (newval === 0) {
				this.activePageInit('activePage');
			} else if (newval === 1) {
				this.activePageInit('unactivePage');
			} else {
			}
		}
	},

	methods: {
		/*
		 * 页面初始化
		 */
		async activePageInit(keyname = 'activePage', callback = false) {
			
			if (typeof callback !== 'function' && this[keyname].isInit) {
				return;
			}
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			if (typeof callback !== 'function') {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
			}
			let tempChannelData, getData;
			const url = this[keyname].url;
			this[keyname].pagenumber = 1;
			this[keyname].keyword = '';
			this[keyname].qudaoName = '全部客户';
			this[keyname].one_category_id = null;
			this[keyname].two_category_id = null;
			this[keyname].three_category_id = null;

			try {
				getData = await this.getData(
					{
						pagenumber: this[keyname].pagenumber,
						pagesize: this[keyname].pagesize
					},
					url
				);
				if (!this.isloadChannel) {
					tempChannelData = await this.getQuDaoData();
					this.channelData = this.formaQuDaoData(tempChannelData);
					this.isloadChannel = true;
				}
				if (keyname === 'activePage' && this.isloadChannel) {
					this[keyname].custList = deepClone(this.channelData);
				} else if (keyname === 'unactivePage' && this.isloadChannel) {
					let newarr = deepClone(this.channelData);
					newarr.forEach(v => {
						v.list.forEach(s => {
							s.list = [];
						});
					});
					this[keyname].custList = newarr;
				} else {
					this[keyname].custList = [];
				}
				const { store_count, datas, length } = getData;
				this.resetUploadOption(keyname,length);
				this[keyname].store_count = store_count;
				this[keyname].list = datas;
				this[keyname].isInit = true;
				if (typeof callback === 'function') {
					// 关闭下拉提示
					callback(2);
				} else {
					uni.hideLoading();
				}
			} catch (e) {
				console.log('error', e);
				this[keyname].isInit = false;
				this.isloadChannel = false;
				// 终止下拉
				this.$refs[keyname].refresherabort();
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		// 根据返回数据的总条数判断是否符合上拉加载的条件状态判断
		resetUploadOption(keyname,length=0){
			const pagesize = this[keyname].pagesize;
			if(length === 0 && length < pagesize){
				this[keyname].isEmpty = true;
				this[keyname].islodMore = false;
				this[keyname].loadingType=5;
			}else if(length < pagesize){
				this[keyname].islodMore = false;
				this[keyname].isEmpty = false;
				this[keyname].loadingType=2;
			}else{
				this[keyname].islodMore = true;
				this[keyname].isEmpty = false;
				this[keyname].loadingType=5;
			}
		},
		// 重置下拉参数
		resetDownLoadOption(keyname){
			
		},

		// 请求拦截器
		reqIntercepts(keyname) {
			const tempObj = deepClone(this[keyname]);
			const __validationParams = this.__validationParams;
			let params = {};
			if (!__validationParams(tempObj, 'one_category_id')) {
				params.one_category_id = tempObj.one_category_id;
			}
			if (!__validationParams(tempObj, 'two_category_id')) {
				params.two_category_id = tempObj.two_category_id;
			}
			if (!__validationParams(tempObj, 'three_category_id')) {
				params.three_category_id = tempObj.three_category_id;
			}

			if (!__validationParams(tempObj, 'keyword')) {
				params.keyword = typeof tempObj.keyword == 'string' && tempObj.keyword.trim();
			}
			params.pagenumber = tempObj.pagenumber;
			params.pagesize = tempObj.pagesize;
			return params;
		},
		/**
		 *  过滤掉null undinfid '' 三种情况
		 * */
		__validationParams(temp, keyval) {
			const value = temp[keyval];
			if (typeof value === 'string' && value.trim() === '') {
				return true;
			} else if (typeof value === 'object' && value === null) {
				return true;
			} else if (typeof value === 'undefined') {
				return true;
			} else {
				return false;
			}
		},
		formaQuDaoData(arr) {
			let tempArr = [];
			if (Array.isArray(arr) && arr.length > 0) {
				tempArr = deepClone(arr);
				tempArr.push({
					id: 'all',
					list: [],
					name: '全部客户',
					type: 1,
					openCustomer: true
				});
			}
			return tempArr;
		},
		// 渠道选择start------------------------------------------------------------------
		qudaoConfim(temp, keyname) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			const { one_category_id, two_category_id, three_category_id, text = '全部客户' } = temp;
			this[keyname].one_category_id = one_category_id;
			this[keyname].two_category_id = two_category_id;
			this[keyname].three_category_id = three_category_id;
			this[keyname].qudaoName = text;
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			const url = this[keyname].url;
			this.getData(parmas, url)
				.then(res => {
					uni.hideLoading();
					this.isLoading = false;
					const { store_count, datas, length } = res;
					this.resetUploadOption(keyname,length);
					this[keyname].store_count = store_count;
					this[keyname].list = datas;
				})
				.catch(error => {
					this.isLoading = false;
					uni.showToast({
						title: error.message || '搜索失败',
						icon: 'none'
					});
				});
		},
		qudaoReset(temp, keyname) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			this[keyname].pagenumber = 1;
			this[keyname].one_category_id = null;
			this[keyname].two_category_id = null;
			this[keyname].three_category_id = null;
			this[keyname].qudaoName = '全部客户';
			const url = this[keyname].url;
			const parmas = this.reqIntercepts(keyname);
			console.log('渠道重置触发搜索', parmas);
			this.getData(parmas, url)
				.then(res => {
					this.isLoading = false;
					const { store_count, datas, length } = res;
					this.resetUploadOption(keyname,length);
					this[keyname].store_count = store_count;
					this[keyname].list = datas;
				})
				.catch(error => {
					this.isLoading = false;
					uni.showToast({
						title: error.message || '搜索失败',
						icon: 'none'
					});
				});
		},
		// 渠道选择end------------------------------------------------------------------

		// 模糊搜索start ------------------------------------------------------------------
		inputChang(temp, keyname) {
			this[keyname].keyword = temp || '';
		},

		searchInput(temp, keyname) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			const { value = '' } = temp;
			this[keyname].keyword = value;
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			const url = this[keyname].url;
			this.getData(parmas, url)
				.then(res => {
					uni.hideLoading();
					this.isLoading = false;
					const { store_count, datas, length } = res;
					this.resetUploadOption(keyname,length);
					this[keyname].store_count = store_count;
					this[keyname].list = datas;
				})
				.catch(error => {
					this.isLoading = false;
					uni.showToast({
						title: error.message || '搜索失败',
						icon: 'none'
					});
				});
		},
		// 取消搜索
		cancelInput(keyname) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
		
			this[keyname].keyword = "";
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			const url = this[keyname].url;
			this.getData(parmas, url)
				.then(res => {
					this.isLoading = false;
					const { store_count, datas, length } = res;
					this.resetUploadOption(keyname,length);
					this[keyname].store_count = store_count;
					this[keyname].list = datas;
				})
				.catch(error => {
					this.isLoading = false;
					uni.showToast({
						title: error.message || '搜索失败',
						icon: 'none'
					});
				});
		},

		// 模糊搜索end ------------------------------------------------------------------

		//  下拉刷新start------------------------------------------------------------------
		downReset(temp, keyname) {
			const { triggerRefreStatus = false, cb = false } = temp;
			if (!triggerRefreStatus) {
				return;
			}
			this.activePageInit(keyname, cb);
		},

		// 下拉刷新end------------------------------------------------------------------
		upMoreFun(keyname){
			if(this.isLoading){return}
			this.isLoading = true;
			this[keyname].loadingType = 1;
			const parmas = this.reqIntercepts(keyname);
			const url = this[keyname].url;
			parmas.pagenumber += 1;
			this.getData(parmas, url)
				.then(res => {
					const { store_count, datas, length } = res;
					this[keyname].store_count = store_count;
					if (length < this[keyname].pagesize) {
						this[keyname].loadingType = 2;
						this[keyname].islodMore = false;
					} else {
						this[keyname].loadingType = 5;
						this[keyname].islodMore = true;
					}
					this[keyname].list = this[keyname].list.concat(datas);
					this[keyname].pagenumber += 1;
					this.isLoading = false;
				})
				.catch(error => {
					this[keyname].loadingType = 5;
					this.isLoading = false;
					uni.showToast({
						title: error.message || '网络不好,再刷新看看！',
						icon: 'none'
					});
				});
		},
		// 上拉加载start------------------------------------------------------------------
		scrollUpMore( keyname) {
			if (this[keyname].loadingType !== 5 && this[keyname].islodMore === false) return;
			// 防抖函数
			if (this.cleaTime) clearTimeout(this.cleaTime);
			this[keyname].loadingType = 0;
			this.cleaTime = setTimeout(this.upMoreFun, 400,keyname);
		},
		// 上拉加载end------------------------------------------------------------------

		// 计算单位处理------------------------------------------------------
		/*
		 target  目标金额
		 actual   实际完成金额
		 */
		percentageFun(actual, target) {
			// 计算百分比,并且保留两位小数
			actual = parseFloat(actual);
			target = parseFloat(target);
			let proNum = (actual / target) * 100;
			return parseInt(proNum);
		},
		// 计算单位处理------------------------------------------------------

		// 没有数据处理resetIsEmpty
		resetIsEmpty(temp, keyname) {
			const { value = false } = temp;
			this[keyname].isEmpty = value;
		},

		// 获取渠道数据
		getQuDaoData() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.custBaseData,
					data: {},
					success: res => {
						resolve(res.data.datas);
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},
		// 获取数据请求
		getData(options, url) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: url,
					data: options,
					success: res => {
						let { store_count = 0, datas = [], length = 0 } = res;
						resolve({ store_count, datas, length });
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},

		// 点击导航栏
		changeTab(index) {
			if (index === this.tabindex && this.isLoading) return;
			this.tabindex = index;
		},

		// // 滑动swiper
		changeSwipter(event) {
			if (this.tabindex === event.detail.current && this.isLoading) return;
			this.tabindex = event.detail.current;
		},
		back() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.current-page {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.swiper-box {
		flex: 1;
		width: 100%;
		box-sizing: border-box;
		.my-swiper {
			width: 100%;
			height: 100%;
			.my-swiper-item {
				width: 100%;
				display: flex;
				flex-direction: column;
				.scroll_views {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}

.custer-tml {
	background-color: #fdc100;
	padding: 40rpx 60rpx 30rpx 60rpx;
	display: flex;
	align-items: center;
	flex-direction: row;
	color: #ffffff;
	.custer-tml_view {
		display: flex;
		align-items: center;
		.custer-tml_store-count {
			font-weight: 700;
			font-size: 40rpx;
		}
		.custer-tml_text {
			font-size: 20rpx;
		}
		&::before {
			content: '';
			display: inline-block;
			width: 20rpx;
			height: 20rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			margin-right: 30rpx;
		}
	}
}

.page-size {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.swiper-continer {
	flex: 1;
}
.swiper--size {
	width: 100%;
	height: 100%;
}
.page-scroll-continer {
	flex: 1;
	overflow: hidden;
	width: 100%;
	position: relative;
}

.scroll_view-size {
	width: 100%;
	height: 100%;
	position: relative;
	.scroll-reload {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		transform: translateY(-100%);
		text-align: center;
	}
}
.text_price--color {
	color: #ff4919;
}

.branch-module {
	width: 750rpx;
	height: 110rpx;
	position: relative;
	.branch_search {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 110rpx;
		box-sizing: border-box;
		z-index: 800;
		padding: 20rpx;
		background: #ffffff;
		border-bottom: 1rpx solid #eeeeee;
		.search_select {
			display: flex;
			padding: 0 30rpx;
			font-size: 28rpx;
			align-items: center;
		}
		.search {
			flex: 1;
			height: 64rpx;
			line-height: 64rpx;
			display: flex;
			.search-inp {
				width: 100%;
				position: relative;
				display: flex;
				align-items: center;
				.search-icon {
					color: #888;
					position: absolute;
					left: 20rpx;
					font-size: 32rpx;
				}
				.tip-cancel {
					font-size: 28rpx;
					color: #888;
				}
				.input-kesword {
					flex: 1;
					padding-left: 60rpx;
					height: 64rpx;
					line-height: 64rpx;
					border-radius: 30rpx;
					background-color: #f5f6f8;
				}
			}
		}
	}
}
.nav_top {
	height: 88rpx;
	display: flex;
	align-items: center;
	.nav-content {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.nav-text {
			font-size: 24rpx;
			padding: 0 20rpx;
		}
		.tab {
			color: #ffffff;
		}
		.taphove {
			background: #ffffff;
			color: #fd940b;
			border-radius: 60rpx;
		}
	}
	.nav-right {
		height: 100%;
	}
	.goback {
		height: 100%;
		padding-left: 10rpx;
		display: flex;
		align-items: center;
		.back-icon {
			padding: 0 20rpx 0 0;
			&:active {
				background: rgba(111, 111, 111, 0.6);
			}
		}
	}
}

.store-list-item {
	border-bottom: 1rpx solid #eeeeee;
	padding: 30rpx;
	&::after {
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	.store-item-name {
		width: 100%;
		float: left;
		font-size: 28rpx;
		margin-bottom: 10rpx;
		padding-right: 20rpx;
		display: block;
		.store-type {
			display: inline-block;
			background-color: #ff7100;
			color: #ffffff;
			padding: 0 15rpx;
			margin-left: 24rpx;
			font-size: 24rpx;
			line-height: 1.6;
		}
		.store-add {
			display: inline-block;
			padding: 0 12rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			background-color: #007aff;
			margin-left: 20rpx;
			line-height: 1.4;
		}

		.store-item-dengji {
			display: inline-block;
			width: 110rpx;
			height: 46rpx;
			box-sizing: border-box;
			background-image: url(@/static/img/icon_dengji.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			vertical-align: middle;
			margin-left: 10rpx;
			line-height: 46rpx;
			text-align: center;
			&::after {
				content: attr(data-star);
				display: inline;
				font-size: 22rpx;
				font-weight: bold;
				color: #ffffff;
				margin-left: 10rpx;
				text-align: center;
				vertical-align: top;
			}
		}
	}

	.store-desc {
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		line-height: 1.4;
		margin-bottom: 12rpx;

		.daili-type {
			padding: 0 10rpx;
			color: #ff7100;
			background-color: #ffffff;
			border: 1rpx solid #ff7100;
		}
	}
	.task-tongji {
		display: block;
	}
}
</style>
