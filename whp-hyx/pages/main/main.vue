<template>
	<view class="w-100 d-flex flex-column box-bb">
		<view class="w-100">
			<view class="w-100">
				<swiper class="swiper" indicator-dots autoplay circular indicator-active-color="#ffffff" :interval="3000">
					<swiper-item v-for="(item, index) in swiperList" :key="item.ad_id" @tap="getnewurl(item)">
						<view class="swiper-item uni-bg-red"><image class="w-100" v-if="item.type === 'image'" :src="item.path" mode="widthFix"></image></view>
					</swiper-item>
				</swiper>
			</view>
			<view
				style="
				border-radius: 20rpx;20rpx 0 0;
				background: #FFFFFF;
				"
			>
				<!-- 导航栏 -->
				<nav-list :navList="navList"></nav-list>
				<!-- 采购任务进度 -->
				<view class="statisCard box-bb py-4 w-100">
					<view class="statisCard-header d-flex a-center j-sb  px-4"><view class="font-weight " style="font-size: 34rpx;">门店采购任务进度</view></view>
					<view class="statisCard-body active d-flex flex-column a-center ">
						<view class="switchBox d-flex j-sb mt-4 font-md ">
							<view
								v-for="(hitem, hindex) in index_cg"
								:key="hitem.flag"
								class="months  flex-1 active p-1 d-flex a-center j-center"
								:class="cg_tabIndex === hindex ? 'switchBox-active' : ''"
								@click="switchFun('cg', hindex)"
							>
								{{ hitem.type == 'years' ? '年' : '月' }}
							</view>
						</view>
						<view v-for="(citem, cindex) in index_cg" :key="citem.flag">
							<block v-if="cg_tabIndex == cindex">
								<view class="py-6 d-flex flex-column a-center">
									<cmd-progress strokeColor="rgb(255, 139, 111)" type="circle" :percent="citem.data.proportion" :width="130" :stroke-width="10"></cmd-progress>
									<view class="font-md py-2">采购完成的情况</view>
								</view>
								<view class="d-flex a-center j-center">
									<view class="d-flex flex-column  px-4 border-right">
										<text class="text-muted font">累计提货额(万元)</text>
										<view>
											￥
											<text class="font-lg">{{ citem.data.cg_amount }}</text>
										</view>
									</view>
									<view class="d-flex flex-column  px-4">
										<text class="text-muted font">提货任务总额(万元)</text>
										<view>
											￥
											<text class="font-lg">{{ citem.data.cg_task_amout }}</text>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<!-- 零售任务进度 -->
				<view class="statisCard box-bb py-4 w-100">
					<view class="statisCard-header d-flex a-center j-sb  px-4"><view class="font-weight " style="font-size: 34rpx;">门店零售任务进度</view></view>
					<view class="statisCard-body active d-flex flex-column a-center ">
						<view class="switchBox d-flex j-sb mt-4 font-md ">
							<view
								v-for="(hitem, hindex) in index_ls"
								:key="hitem.flag"
								class="months  flex-1 active p-1 d-flex a-center j-center"
								:class="ls_tabIndex === hindex ? 'switchBox-active' : ''"
								@click="switchFun('ls', hindex)"
							>
								<!-- @click="changSwitch2(hindex)" -->
								{{ hitem.type == 'years' ? '年' : '月' }}
							</view>
						</view>

						<view v-for="(citem, cindex) in index_ls" :key="citem.flag">
							<block v-if="ls_tabIndex == cindex">
								<view class="py-6 d-flex flex-column a-center">
									<cmd-progress strokeColor="rgb(250,225,73)" type="circle" :percent="citem.data.proportion" :width="130" :stroke-width="10"></cmd-progress>
									<view class="font-md py-2">零售完成的情况</view>
								</view>
								<view class="d-flex a-center j-center">
									<view class="d-flex flex-column  px-4 border-right">
										<text class="text-muted font">累计零售额(万元)</text>
										<view>
											￥
											<text class="font-lg">{{ citem.data.sale_amount }}</text>
										</view>
									</view>
									<view class="d-flex flex-column  px-4">
										<text class="text-muted font">零售任务总额(万元)</text>
										<view>
											￥
											<text class="font-lg">{{ citem.data.sale_task_amout }}</text>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<!-- 新网点进度 -->
				<view class="statisCard box-bb py-4 w-100">
					<view class="statisCard-header d-flex a-center j-sb px-4">
						<view class="font-weight  " style="font-size: 34rpx;">新网点进度</view>

						<view class="text-muted font-md" @click="goDetail('notpress')">
							<text>查看明细</text>
							<text class="iconfont">&#xe601;</text>
						</view>
					</view>
					<view class="statisCard-body d-flex flex-column a-center ">
						<view class="switchBox d-flex j-sb mt-4 font-md">
							<view
								class="months  flex-1 active p-1 d-flex a-center j-center"
								v-for="(hitem, hindex) in notpress"
								:key="hitem.flag"
								:class="not_tabindex == hindex ? 'switchBox-active' : ''"
								@click="switchFun('ns', hindex)"
							>
								<!-- @click="changSwitch3(hindex)" -->
								{{ hitem.type == 'years' ? '年' : '月' }}
							</view>
						</view>
						<view v-for="(citem, cindex) in notpress" :key="citem.flag">
							<block v-if="not_tabindex == cindex">
								<view class="py-6 d-flex flex-column a-center">
									<cmd-progress strokeColor="rgb(81, 218, 252)" type="circle" :percent="citem.data.proportion" :width="130" :stroke-width="10"></cmd-progress>
									<view class="font-md py-2">新开网点完成情况</view>
								</view>
								<view class="d-flex a-center j-center">
									<view class="d-flex flex-column a-center px-4 border-right">
										<text class="text-muted font">已完成家</text>
										<view>
											<text class="font-lg">{{ citem.data.completed }}</text>
										</view>
									</view>
									<view class="d-flex flex-column a-center  px-4">
										<text class="text-muted font">计划任务(家)</text>
										<view>
											<text class="font-lg">{{ citem.data.target_task }}</text>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<!-- 巡店计划 -->
				<view class="statisCard box-bb py-4 w-100">
					<view class="statisCard-header d-flex a-center j-sb px-4"><view class="font-weight " style="font-size: 34rpx;">巡店月计划</view></view>
					<view class="statisCard-body d-flex flex-column a-center ">
						<view class="py-6 d-flex flex-column a-center">
							<cmd-progress strokeColor="rgb(111, 232, 46)" type="circle" :percent="patrol_store.proportion" :width="130" :stroke-width="8"></cmd-progress>
						</view>
						<view class="d-flex a-center j-center  w-100 px-2" style="box-sizing: border-box;">
							<view class="flex-1 d-flex flex-column a-center" @tap="gofintStore(0, patrol_store.not_visited)">
								<text class="text-muted font">未巡店(家)</text>
								<view>
									<text class="font-lg">{{ patrol_store.not_visited }}</text>
								</view>
							</view>
							<view class="flex-1 d-flex flex-column a-center" @tap="gofintStore(1, patrol_store.visited)">
								<text class="text-muted font">已巡店(家)</text>
								<view>
									<text class="font-lg">{{ patrol_store.visited }}</text>
								</view>
							</view>
							<view class="flex-1 d-flex flex-column a-center  ">
								<text class="text-muted font">近3月巡店率</text>
								<view>
									<text class="font-lg">{{ patrol_store.visited_rate }}%</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 排行榜 -->
				<view class="w-100 box-bb">
					<view class="px-4 d-flex a-center j-sb " style="height: 80rpx;">
						<view class=" font-weight" style="font-size: 34rpx;">Top机型</view>
						<view class="text-muted font-md" @click="goDetail('ranklist')">
							<text>查看明细</text>
							<text class="iconfont">&#xe601;</text>
						</view>
					</view>
					<view class="p-3 ">
						<block v-for="(item, index) in rankList" :key="index"><ranking-list :item="item" :index="index"></ranking-list></block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navList from '@/components/main/nav-list.vue';
import cmdProgress from '@/components/common/cmd-progress/cmd-progress.vue';
import rankingList from '@/components/main/ranking-list.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
const isObject = function(val) {
	return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

const app = getApp();
export default {
	components: {
		navList,
		cmdProgress,
		rankingList
	},
	data() {
		return {
			isLoading: false,
			swiperList: [],
			navList: [
				{
					src: '../../static/img/icon_jiandang.png',
					name: '网点建档',
					id: 1,
					path: '/pages/branch/branch',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ']
				},
				{
					src: '../../static/img/icon_baifang.png',
					name: '网点拜访',
					id: 2,
					path: '/pages/dotVisit/dotVisit',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ']
				},
				{
					src: '../../static/img/icon_yunying.png',
					name: '客户运营',
					id: 3,
					path: '/pages/operation/operation',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ']
				},

				{
					src: '../../static/img/icon_kpi.png',
					name: 'KPI报表',
					id: 4,
					path: '/kpireport/kpireport',
					isreq: true,
					role_code:['HYXYWY','HYXFGSJL','HYXZB','HYXPFQDZJ','HYXZDZG','HYXLSQDZJ']
				},
				{
					src: '../../static/img/icon_gonggao.png',
					name: '通知公告',
					id: 5,
					path: '/pages/notice/notice',
					isreq: true,
				role_code:['HYXYWY','HYXFGSJL','HYXZB','HYXPFQDZJ','HYXZDZG','HYXLSQDZJ']
				},
				// {
				// 	src: '../../static/img/icon_pankou.png',
				// 	name: '上月门店/网点盘口录入',
				// 	id: 6,
				// 	path: '',
				// 	isreq: false,
				// 	role_code:['HYXYWY','HYXFGSJL','HYXZB','HYXPFQDZJ','HYXZDZG','HYXLSQDZJ']
				// },
				{
					src: '../../static/img/icon_cuxiao.png',
					name: '促销活动',
					id: 7,
					path: '/pages/index-sales-activity/index-sales-activity',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ']
				},
				{
					src: '../../static/img/icon_waiqindaka.png',
					name: '外勤打卡',
					id: 8,
					path: '/pages/FieldClock/FieldClock',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ', 'HYXZN']
				},
				{
					src: '../../static/img/customer_visit.png',
					name: '客户拜访',
					id: 9,
					path: '/pages/CustomerVisit/CustomerVisit',
					isreq: true,
					role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ']
				},
				// {
				// 	src: '../../static/img/icon_waiqindaka.png',
				// 	name: '测试',
				// 	id: 10,
				// 	path: '/pages/test/test',
				// 	isreq: true,
				// 	role_code: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ', 'HYXZN']
				// },
			],

			// top机型
			rankList: []
		};
	},
	filters: {
		toWanFixedTwo: function(val) {
			val = val * 10000;
			val = val.toFixed(2);
			return val;
		},
		toNormalFixedTwo: function(val) {
			val = Number(val);
			val = val.toFixed(2);
			return val;
		}
	},
	computed: {
		...mapState({
			loginInfo: state => state.user.loginInfo, //用户的名称
			cg_tabIndex: state => state.main.cg_tabIndex,
			index_cg: state => state.main.index_cg,
			ls_tabIndex: state => state.main.ls_tabIndex,
			index_ls: state => state.main.index_ls,
			not_tabindex: state => state.main.not_tabindex,
			notpress: state => state.main.notpress,
			patrol_store: state => state.main.patrol_store,
			isLogin: state => state.user.isLogin,
			role_code: state => state.user.role_code,
			is_has_company: state => state.user.is_has_company,
			forcedLogin: state => state.user.forcedLogin,
			userData: state => state
		})
	},
	onLoad() {
		this.__init();
	},
	onShow() {
		if (this.isLogin) {
			console.log('角色类型', this.role_code);
			console.log('企业类型', this.is_has_company);
		}
	},

	// 下拉刷新
	onPullDownRefresh() {
		if (!this.isLogin) {
			return uni.stopPullDownRefresh();
		}
		this.__init();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1500);
	},

	methods: {
		...mapMutations(['setIndex_cg', 'setIndex_ls', 'setNotpress']),
		...mapActions(['getPatrol_storeData', 'login']),
		/* 判断是否有职能角色权限 */
		isZhiNengRoleFun(rules, ele) {
			if (rules === undefined && ele === undefined) return false;
			if (!this.isLogin) {
				uni.showToast({
					title:'还没有登录, 前往登录。',
					icon:'none'
				})
				throw new Error('还没有登录, 前往登录。');
			}
			if (rules.includes(ele)) {
				return true;
			} else {
				uni.showToast({
					title: '无权限访问',
					icon: 'none',
					duration: 2000
				});
				throw new Error('无权限访问。');
			}
		},

		async __init() {
			try {
				await this.login();
				if (this.isLogin) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					// 获取顶部广告
					await this.switchFun('ba', 0, true);
					if (this.role_code !== 'HYXZN') {
						// 采购任务进度
						await this.switchFun('cg', 0, true);
						//零售任务进度
						await this.switchFun('ls', 0, true);
						// 新网点进度
						await this.switchFun('ns', 0, true);
						// 巡店计划
						await this.switchFun('xd', 0, true);
						// 获取Top机型
						await this.switchFun('jx', 0, true);
					}
				}
			} catch (e) {
				console.log('初始加载错误', e);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		// 轮播图跳转
		getnewurl(item) {
			this.isZhiNengRoleFun(['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ', 'HYXZN'], this.role_code);
			this.$myNavigateTo('/pages/web-view/web-view', { url: item.url });
		},

		/*
			组织采购的任务
			cg_amount  // 采购目标完成金额
			cg_task_amout//采购目标目标金额
		 */
		_renderCg(optionObject) {
			let index = optionObject.index || 0;
			let { cg_amount, cg_task_amout } = optionObject.data;
			const proportion = this.toCalculate(cg_amount, cg_task_amout);
			this.setIndex_cg({ data: { cg_task_amout, cg_amount, proportion }, index });
		},
		/*
			组织零售的任务
			cg_amount  // 采购目标完成金额
			cg_task_amout//采购目标目标金额
		 */
		_renderLs(optionObject) {
			let index = optionObject.index || 0;
			let { sale_amount, sale_task_amout } = optionObject.data;
			const proportion = this.toCalculate(sale_amount, sale_task_amout);
			this.setIndex_ls({ data: { sale_task_amout, sale_amount, proportion }, index });
		},
		_renderBanner(optionObject) {
			this.swiperList = optionObject.data.index_top_ad;
		},
		_renderJx(optionObject) {
			this.rankList = optionObject.data;
		},

		/*
		 @params type 类型
		 @params index 年或月
		 @params indexkey 对应的切换索引key
		 */

		async switchFun(type, index, isinit = false) {
			// 角色验证
			this.isZhiNengRoleFun(['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ'], this.role_code);
			if (type !== 'ba') {
				// return uni.showToast({
				// 	title: '暂未开发,正在开发中...',
				// 	icon: 'none'
				// });
			}
			try {
				let options = {
					ba: {
						funname: this.getBanner,
						vailkey: false,
						callback: this._renderBanner,
						url: this.$myhttpUrl.indexTop_ad,
						param: {}
					},
					cg: {
						funname: this.cg_and_lsFun,
						url: this.$myhttpUrl.index_cg_and_ls,
						param: {
							renwu_type: 1,
							type: index ? 2 : 1
						},
						indexkey: 'cg_tabIndex',
						callback: this._renderCg,
						vailkey: true
					},
					ls: {
						funname: this.cg_and_lsFun,
						url: this.$myhttpUrl.index_cg_and_ls,
						param: {
							renwu_type: 2,
							type: index ? 2 : 1
						},
						indexkey: 'ls_tabIndex',
						callback: this._renderLs,
						vailkey: true
					},
					ns: {
						funname: this.commonFun,
						url: this.$myhttpUrl.index_new_dot,
						param: {
							userid: this.loginInfo.username,
							flag: index ? 2 : 1
						},
						indexkey: 'not_tabindex',
						callback: this.setNotpress,
						vailkey: true
					},
					xd: {
						funname: this.getPatrol_storeData,
						url: this.$myhttpUrl.index_store_dot,
						param: {
							userid: this.loginInfo.username
						},
						vailkey: false,
						callback: function() {}
					},
					jx: {
						funname: this.getTop_models,
						url: this.$myhttpUrl.index_topList,
						param: {
							pageNumber: 1,
							pageSize: 10
						},
						vailkey: false,
						callback: this._renderJx
					}
				};
				if (!isinit) {
					if (options[type].vailkey) {
						let indexKey = options[type].indexkey;
						if (this[indexKey] == index) return;
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
					}
				}
				let data = await options[type].funname({ url: options[type].url, data: options[type].param });
				options[type].callback({ data, index });
				return true;
			} catch (e) {
				console.log("错误",e);
				uni.showToast({
					title: e.err,
					icon: 'none'
				});
			} finally {
				if (!isinit) {
					uni.hideLoading();
				}
			}
		},

		// 点击 0未巡逻  1巡逻
		gofintStore(ins, count) {
			// 角色验证
			this.isZhiNengRoleFun(['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ'], this.role_code);
			// return uni.showToast({
			// 	title: '暂未开发,正在开发中...',
			// 	icon: 'none'
			// });
			switch (ins) {
				case 0:
					this.$myNavigateTo('/pages/index-findstore/index-findstore', {
						type: ins,
						count: count || 0
					});
					break;
				case 1:
					this.$myNavigateTo('/pages/index-findstore/index-findstore', {
						type: ins,
						count: count || 0
					});
					break;
			}
		},
		goDetail(type) {
			let optionUrl = {
				ranklist: '/pages/index-ranklist/index-ranklist',
				notpress: '/pages/index-dpdetail/index-dpdetail'
			};
			this.isZhiNengRoleFun(['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ'], this.role_code);
			// return uni.showToast({
			// 	title: '暂未开发,正在开发中...',
			// 	icon: 'none'
			// });
			this.$myNavigateTo(optionUrl[type]);
		},

		// 计算完成率
		toCalculate(targetNum, actualNum) {
			targetNum = Number(targetNum);
			actualNum = Number(actualNum);
			let rate = 0;
			if (actualNum != 0.0) {
				rate = parseInt((targetNum / actualNum) * 10000) / 100;
			}
			return rate;
		},

		// 获取排行榜Top机型
		getTop_models(tempObj = {}) {
			const { url, data } = tempObj;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: url,
					data: data,
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						resolve({ err: '获取Top机型失败' });
					}
				});
			});
		},
		// 获取顶部轮播图
		getBanner(tempObj = {}) {
			const { url, data } = tempObj;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: url,
					data: data,
					success: res => {
						resolve(res);
					},
					fail: err => {
						reject({ err: '获取轮播图失败' });
					}
				});
			});
		},

		// 获取采购||零售任务数据
		cg_and_lsFun(tempObj = {}) {
			const { url, data } = tempObj;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: url,
					data: data,
					success: res => {
						resolve(res);
					},
					fail: err => {
						reject({ err: '获取采购或零售失败' });
					}
				});
			});
		},
		// 获取新开网点数据
		commonFun(tempObj = {}) {
			const { url, data } = tempObj;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: url,
					data: data,
					success: res => {
						if (!res && !res.data) {
							reject({ err: '获取新网点进度失败' });
						} else {
							resolve(res.data);
						}
					},
					fail: err => {
						reject({ err: '获取新网点进度失败' });
					}
				});
			});
		}
	}
};
</script>

<style scoped>
page {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: #000066;
}
.switchBox {
	width: 316rpx;
	height: 64rpx;
	box-sizing: border-box;
	border: 1rpx solid #eeeeee;
	border-radius: 64rpx;
	background-color: #ffffff;
	padding: 1rpx;
}
.switchBox-active {
	background-color: #fdc100;
	border-radius: 62rpx;
}
.months {
	flex: 1;
}
.years {
	flex: 1;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
</style>
