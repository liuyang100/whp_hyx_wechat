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
						:channel-data="formaQuDaoData(channelData)"
						:keyword="activePage.keyword"
						:qudaoName="activePage.qudaoName"
						:isEmpty="activePage.isEmpty"
						:loadingType = "activePage.loadingType"
						:islodMore="activePage.islodMore"
						@resetIsEmpty="resetIsEmpty($event, 'activePage')"
						@inputChang="inputChang($event, 'activePage')"
						@qudaoConfim="qudaoConfim($event, 'activePage')"
						@searchInput="searchInput($event, 'activePage')"
						@cancelInput="cancelInput('activePage')"
						@qudaoReset="qudaoReset($event, 'activePage')"
						@downReset="downReset($event, 'activePage')"
						@scrollUpMore="scrollUpMore('activePage')"
					>
						<template v-slot:keHuInfo>
							<ke-hu-info :isActive="1" :is_has_company="is_has_company" :role_code="role_code" :kuHu="activePage.store_count"></ke-hu-info>
						</template>
						<template v-slot:adressModal>
							<view class="adress-box" @click="openadress('activeRegion')">
								<view class="adress-item" v-for="(item, index) in activePage.arreArr" :key="item.flag" :class="item.area_id ? 'active' : ''">
									<text>{{ item.area_name }}</text>
									<text class="iconfont">&#xe605;</text>
								</view>
							</view>
						</template>
						<block v-for="(item, index) in activePage.list" :key="item.customer_apply_id">
							<archive-list :role_code="role_code" :item="item" :index="index" :is_active="1" @changIsActive="changIsActives" />
						</block>
					</active-page>
					<regional-components ref="activeRegion" @cancel="cancelSl($event, 'activePage')" @sure="sureSl($event, 'activePage')" />
				</swiper-item>
				<swiper-item class="my-swiper-item">
					<active-page
						ref="unactivePage"
						style="width: 100%;height: 100%;overflow: hidden;box-sizing: border-box;display: flex;flex-direction: column;"
						:channel-data="formaQuDaoData(channelData)"
						:keyword="unactivePage.keyword"
						:qudaoName="unactivePage.qudaoName"
						:isEmpty="unactivePage.isEmpty"
						:loadingType = "unactivePage.loadingType"
						:islodMore="unactivePage.islodMore"
						@resetIsEmpty="resetIsEmpty($event, 'unactivePage')"
						@inputChang="inputChang($event, 'unactivePage')"
						@qudaoConfim="qudaoConfim($event, 'unactivePage')"
						@searchInput="searchInput($event, 'unactivePage')"
						@cancelInput="cancelInput('unactivePage')"
						@qudaoReset="qudaoReset($event, 'unactivePage')"
						@downReset="downReset($event, 'unactivePage')"
						@scrollUpMore="scrollUpMore('unactivePage')"
					>
						<template v-slot:keHuInfo>
							<ke-hu-info :isActive="0" :is_has_company="is_has_company" :role_code="role_code" :kuHu="unactivePage.store_count"></ke-hu-info>
						</template>
						<template v-slot:adressModal>
							<view class="adress-box" @click="openadress('unactiveRegion')">
								<view class="adress-item" v-for="(item, index) in unactivePage.arreArr" :key="item.flag" :class="item.area_id ? 'active' : ''">
									<text>{{ item.area_name }}</text>
									<text class="iconfont">&#xe605;</text>
								</view>
							</view>
						</template>
						<block v-for="(item, index) in unactivePage.list" :key="item.customer_apply_id">
							<archive-list :role_code="role_code" :item="item" :index="index" :is_active="0" @changIsActive="changIsActives" />
						</block>
					</active-page>
					<regional-components ref="unactiveRegion" @cancel="cancelSl($event, 'unactivePage')" @sure="sureSl($event, 'unactivePage')" />
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni/uni-icons/uni-icons.vue';
import uniStatusBar from '@/components/uni/uni-status-bar/uni-status-bar.vue';
import activePage from '@/components/brand/active-page.vue';
import keHuInfo from '@/components/main/keHu-info.vue';
import archiveList from '@/components/main/archive-list.vue';
import regionalComponents from '@/components/regionalComponents/regionalComponents.vue';
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
		'ke-hu-info': keHuInfo,
		'active-page': activePage,
		'archive-list': archiveList,
		'regional-components': regionalComponents
	},
	data() {
		return {
			isLoading: false,
			tabindex: 0,
			tabnav: [],
			isloadChannel: false,
			channelData: [],
			activePage: {
				qudaoName: '全部客户',
				isInit: false,
				isEmpty: false,
				loadingType:5,
				islodMore: true,
				store_count: 0,
				pagesize: 100, // 每次获取条数
				pagenumber: 1,
				flag: 1, // 记录选择地址的区级
				area_id: null, // 选择目标搜索地址的id
				is_active: 1,
				list: [],
				arreArr: [],
				one_category_id: null,
				one_category_id: null,
				two_category_id: null,
				three_category_id: null,
				keyword: ''
			},
			unactivePage: {
				qudaoName: '全部客户',
				islodMore: true,
				isInit: false,
				isEmpty: false,
				loadingType:5,
				store_count: 0,
				pagesize: 100, // 每次获取条数
				pagenumber: 1,
				flag: 1, // 记录选择地址的区级
				area_id: null, // 选择目标搜索地址的id
				is_active: 0,
				list: [],
				arreArr: [],
				one_category_id: null,
				one_category_id: null,
				two_category_id: null,
				three_category_id: null,
				keyword: ''
			}
		};
	},

	onLoad(option) {
		// 初始化导航栏
		if (this.is_has_company) {
			// 主企业
			this.tabnav = [
				{
					name: '已激活',
					id: 1
				},
				{
					name: '未激活',
					id: 0
				}
			];
		} else {
			// 子企业
			this.tabnav = [
				{
					name: '已激活',
					id: 1
				}
			];
		}
		this.activePageInit();
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.activeRegion.getScreen();
			this.$refs.unactiveRegion.getScreen();
		});
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
			if (typeof callback !== 'function') {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
			}
			this.isLoading = true;
			let tempChannelData, getData;
			this[keyname].arreArr = [
				{ area_name: '省', area_id: null, flag: 1 },
				{ area_name: '市', area_id: null, flag: 2 },
				{ area_name: '区/县', area_id: null, flag: 3 },
				{ area_name: '街/镇', area_id: null, flag: 4 }
			];
			this[keyname].pagenumber = 1;
			this[keyname].flag = 1;
			this[keyname].keyword = '';
			this[keyname].qudaoName = '全部客户';
			this[keyname].one_category_id = null;
			this[keyname].two_category_id = null;
			this[keyname].three_category_id = null;

			try {
				getData = await this.getData({
					pagenumber: this[keyname].pagenumber,
					pagesize: this[keyname].pagesize,
					is_active: this[keyname].is_active,
					flag: this[keyname].flag
				});
				if (!this.isloadChannel) {
					tempChannelData = await this.getQuDaoData();
					this.channelData = tempChannelData;
					this.isloadChannel = true;
				}
				const { customer_count, datas, length } = getData;
				this.resetUploadOption(keyname,length)
				this[keyname].store_count = customer_count;
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
		
		// 处理上拉参数
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
				params.keyword = tempObj.keyword;
			}
			if (!__validationParams(tempObj, 'flag')) {
				params.flag = tempObj.flag;
			}
			if (!__validationParams(tempObj, 'area_id')) {
				params.area_id = tempObj.area_id;
			}
			params.pagenumber = tempObj.pagenumber;
			params.pagesize = tempObj.pagesize;
			params.is_active = tempObj.is_active;
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
				title:"查询中...",
				mask:true
			})
			const { one_category_id, two_category_id, three_category_id, text = '全部客户' } = temp;
			this[keyname].one_category_id = one_category_id;
			this[keyname].two_category_id = two_category_id;
			this[keyname].three_category_id = three_category_id;
			this[keyname].qudaoName = text;
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			this.getData(parmas)
				.then(res => {
					uni.hideLoading()
					this.isLoading = false;
					const { customer_count, datas, length } = res;
					this.resetUploadOption(keyname,length)
					this[keyname].store_count = customer_count;
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
			uni.showLoading({
				title:"查询中...",
				mask:true
			})
			this[keyname].one_category_id = null;
			this[keyname].two_category_id = null;
			this[keyname].three_category_id = null;
			this[keyname].qudaoName = '全部客户';
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			console.log('渠道重置触发搜索', parmas);
			this.getData(parmas)
				.then(res => {
					uni.hideLoading()
					this.isLoading = false;
					const { customer_count, datas, length } = res;
					this.resetUploadOption(keyname,length)
					this[keyname].store_count = customer_count;
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
				title:"查询中...",
				mask:true
			})
			const { value = '' } = temp;
			this[keyname].keyword = value;
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			this.getData(parmas)
				.then(res => {
					uni.hideLoading()
					const { customer_count, datas, length } = res;
					this.resetUploadOption(keyname,length)
					this[keyname].store_count = customer_count;
					this[keyname].list = datas;
					this.isLoading = false;
					
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
		cancelInput( keyname) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			this[keyname].keyword = "";
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			this.getData(parmas)
				.then(res => {
					const { customer_count, datas, length } = res;
					this.resetUploadOption(keyname,length)
					this[keyname].store_count = customer_count;
					this[keyname].list = datas;
					this.isLoading = false;
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

		// 选择地址模块start------------------------------------------------------------
		cancelSl(res, keyname) {
			this.setErea(res, keyname);
		},
		sureSl(res, keyname) {
			this.setErea(res, keyname);
		},
		setErea(obj, keyname) {
			console.log('选择地址触发事件', obj);
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title:"查询中...",
				mask:true
			})
			const { data = [], currentindex = 0 } = obj;
			const { area_id = null, flag = 1 } = data[currentindex];
			this[keyname].arreArr = data;
			this[keyname].area_id = area_id;
			this[keyname].flag = flag;
			this[keyname].pagenumber = 1;
			const parmas = this.reqIntercepts(keyname);
			this.getData(parmas)
				.then(res => {
					uni.hideLoading()
					const { customer_count, datas, length } = res;
					this.resetUploadOption(keyname,length)
					this[keyname].store_count = customer_count;
					this[keyname].list = datas;
					this.isLoading = false;
				})
				.catch(error => {
					this.isLoading = false;
					uni.showToast({
						title: error.message || '搜索失败',
						icon: 'none'
					});
				});
		},
		openadress(keyname) {
			this.$refs[keyname].open();
		},
		// 选择地址模块end---------------------------------------------------------------

		//  下拉刷新start------------------------------------------------------------------
		downReset(temp, keyname) {
			console.log(temp, keyname);
			const { triggerRefreStatus = false, cb = false } = temp;
			if (!triggerRefreStatus) {
				return;
			}
		
			this.activePageInit(keyname, cb);
		},

		// 下拉刷新end------------------------------------------------------------------
// 下拉刷新end------------------------------------------------------------------
		upMoreFun(keyname){
			if(this.isLoading){return}
			this.isLoading = true;
			this[keyname].loadingType = 1;
			const parmas = this.reqIntercepts(keyname);
			parmas.pagenumber += 1;
			this.getData(parmas)
				.then(res => {
					const { customer_count, datas, length } = res;
					this[keyname].store_count = customer_count;
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
					this[keyname].loadingType = 5
					this.isLoading = false;
					uni.showToast({
						title: error.message || '网络不好,再刷新看看！',
						icon: 'none'
					});
				});
		},
		// 上拉加载start------------------------------------------------------------------
		scrollUpMore(keyname) {
			if (this[keyname].loadingType !== 5 && this[keyname].islodMore === false) return;
			// 防抖函数
			if (this.cleaTime) clearTimeout(this.cleaTime);
			this[keyname].loadingType = 0;
			this.cleaTime = setTimeout(this.upMoreFun, 400,keyname);
		},
		// 上拉加载end------------------------------------------------------------------

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
		getData(options) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.custBizIndex,
					data: options,
					success: res => {
						let { customer_count = 0, datas = [], length = 0 } = res;
						resolve({ customer_count, datas, length });
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

// 顶部导航栏
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
.adress-box {
	background: #ffffff;
	height: 88rpx;
	border-bottom: 1rpx solid #eeeeee;
	display: flex;
	align-content: center;
	box-sizing: border-box;
	.adress-item {
		color: #666666;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		&.active {
			color: #fdc100;
		}
	}
}
</style>
