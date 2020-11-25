<template>
	<view class=" d-flex flex-column w-100" style="height: 100%;">
		<view class="w-100">
			<view class="search ">
				<view class="header w-100"><ly-search-bar placeholder="搜索关键字" :radius="70" @confirm="confirm" @cancel="cancel"></ly-search-bar></view>
			</view>
			<view class="tabs w-100 d-flex">
				<view class=" tab-item flex-1" :id="tab.id" v-for="(item, index) in tabBars" :key="index" @click="ontabtap(index)">
					<view class="tab-item-title" :class="tabIndex == index ? 'tab-item-title-active' : ''">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<swiper :current="tabIndex" :duration="20" class="swiper-box pt-2" style="flex: 1;" @change="ontabchange">
			<swiper-item class="swiper-item w-100 h-100" v-for="(tab, index) in listdata" :key="index">
				<scroll-view class="scroll-v list" enableBackToTop="true" scroll-y :style="{ height: scrollHeight + 'px' }" @scrolltolower="upMore">
					<template v-if="tab.list.length > 0">
						<view class="archCard d-flex a-center" v-for="(ins, ini) in tab.list" :key="ini" @click="goarchivesDetail(ins)">
							<view class="left-contanier flex-1 box-bb">
								<view class="title">{{ ins.customer_name }}</view>
								<view class="desc adress">{{ ins.area_fullname }}</view>
								<view class="desc">联系人:{{ ins.contacts }}</view>
							</view>
							<view class="activeBtn" @tap.stop="submitApply(ins)" v-if="tab.requestData.apply_stat == 0">提交</view>
						</view>
						<load-more :islodMore="islodMore" :loadingType="loadingType"></load-more>
					</template>
					<template v-if="tab.list.length == 0 && tab.firstLoad == 'after'">
						<not-thing class="w-100" />
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="add-button" @click="goaddArchives">
			<view class="iconfont icon-hao"></view>
			<text class="textsize">客户建档</text>
		</view>
	</view>
</template>

<script>
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import loadMore from '@/components/common/load-more/load-more.vue';
import notThing from '@/components/common/nothing/nothing.vue';
export default {
	name: 'archives-list',
	components: {
		loadMore,
		notThing,
		lySearchBar
	},
	data() {
		return {
			tabBars: [
				{
					name: '未提交',
					id: 'guanzhu',
					apply_stat: 0
				},
				// {
				// 	name: '已提交',
				// 	id: 'tuijian',
				// 	apply_stat: 1
				// },
				{
					name: '审核中',
					id: 'caijing',
					apply_stat: 4
				},
				{
					name: '已审核',
					id: 'redian',
					apply_stat: 2
				}
				// {
				// 	name: '被驳回',
				// 	id: 'rejected',
				// 	apply_stat: 3
				// }
			],
			tabIndex: 0,
			listdata: [],
			scrollHeight: 0
			
		};
	},

	onLoad() {
		this.__init();
	},
	mounted() {
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.swiper-item')
			.boundingClientRect(data => {
				this.scrollHeight = data.height;
			})
			.exec();
	},
	// 下拉刷新
	onPullDownRefresh(e) {
		console.log(e, '下拉刷新');
		if (e) {
			this.tabIndex = e.tabIndex;
		}
		let item = this.listdata[this.tabIndex];
		item.firstLoad = 'before';
		item.loadingType = 0;
		item.islodMore = false;
		item.requestData.pagenumber = 1;
		item.requestData.keyword = '';
		uni.showLoading({
			title: '刷新中...'
		});
		this.getData(res => {
			uni.stopPullDownRefresh();
			uni.hideLoading();
		}, true);
	},
	watch: {
		tabIndex(val) {
			this.changLoadFun(val);
		}
	},

	methods: {
		changLoadFun(val) {
			let item = this.listdata[val];
			item.firstLoad = 'before';
			item.loadingType = 0;
			item.islodMore = false;
			item.requestData.pagenumber = 1;
			this.getData( false, true);
		},
		__init() {
			this.tabBars.forEach(v => {
				this.listdata.push({
					firstLoad: 'before',
					loadingType: 0,
					islodMore: false,
					requestData: {
						pagesize: 10,
						pagenumber: 1,
						apply_stat: v.apply_stat,
						keyword: ''
					},
					list: []
				});
			});

			uni.showLoading({
				title: '加载中...'
			});
			this.getData(false,true);
		},
	
		// 处理请求参数
		formatRequest(reqdata = {}) {
			let itemReq = this.listdata[this.tabIndex].requestData;
			for (let k in itemReq) {
				if (itemReq[k] !== '' && itemReq[k] !== null) {
					reqdata[k] = itemReq[k];
				}
			}
			return reqdata;
		},

		// 获取详情
		goarchivesDetail(res) {
			let apply_stat = this.tabBars[this.tabIndex].apply_stat;
			this.$myNavigateTo('/pages/archives-detail/archives-detail', {
				customer_apply_id: res.customer_apply_id,
				apply_stat: apply_stat,
				is_active: this.tabIndex ? 1 : 0
			});
		},

		// 点击提交验证是通过校验
		getDetailData(ins) {
			let customer_apply_id = ins.customer_apply_id;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.customerApply_select,
					data: {
						customer_apply_id: customer_apply_id,
						is_active: 0
					},
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},

		vaildatas(target, val) {
			if (target.hasOwnProperty(val)) {
				if (target[val] == null || (typeof target[val] == 'string' && target[val].trim() == '') || typeof target[val] == 'undefind') {
					return false;
				}
				return true;
			} else {
				return false;
			}
		},

		validmyRequest(resData) {
				console.log(resData);
				if (!this.vaildatas(resData, 'one_category_id')) {
					console.log(1);
					return false;
				} else if (!this.vaildatas(resData, 'two_category_id')) {
					console.log(2);
					return false;
				} else if (!this.vaildatas(resData, 'three_category_id')) {
					console.log(3);
					return false;
				} else if (!this.vaildatas(resData, 'sale_org_id')) {
					console.log(4);
					return false;
				} else if (!this.vaildatas(resData, 'store_level')) {
					console.log(5);
					return false;
				} else if (!this.vaildatas(resData, 'administrative')) {
					console.log(6);
					return false;
				} else if (!this.vaildatas(resData, 'contacts')) {
					console.log(8);
					return false;
				} else if (!this.vaildatas(resData, 'mobile')) {
					console.log(9);
					return false;
				} else if (!this.vaildatas(resData, 'area_name')) {
					console.log(10);
					return false;
				} else if (!this.vaildatas(resData, 'address')) {
					console.log(11);
					return false;
				} else if (!this.vaildatas(resData, 'location_code')) {
					console.log(12);
					return false;
				} else if (!this.vaildatas(resData, 'consignee_area_id')) {
					console.log(13);
					return false;
				} else if (!this.vaildatas(resData, 'consignee_address')) {
					console.log(14);
					return false;
				} else if (!this.vaildatas(resData, 'taxpayer_type')) {
					console.log(15);
					return false;
				} else if (!this.vaildatas(resData, 'consignee_mobile')) {
					console.log(16);
					return false;
				} else if (!this.vaildatas(resData, 'bank_account')) {
					console.log(17);
					return false;
				} else if (!this.vaildatas(resData, 'opening_bank')) {
					console.log(18);
					return false;
				} else if (!this.vaildatas(resData, 'taxpayer_number')) {
					if (!this.vaildatas(resData, 'snified_social_credit_code')) {
						console.log(19);
						return false;
					}
					if (!this.vaildatas(resData, 'company_name')) {
						console.log(20);
						return false;
					}
					if (resData.cust_apply_attachs[0].url == '') {
						console.log(21);
						return false;
					}
				} else if (this.vaildatas(resData, 'taxpayer_number')) {
					if (!this.vaildatas(resData, 'business_license_number')) {
						console.log(22);
						return false;
					}
					if (!this.vaildatas(resData, 'business_license_number')) {
						console.log(23);
						return false;
					}
					if (!this.vaildatas(resData, 'organization_code')) {
						console.log(24);
						return false;
					}
					if (!this.vaildatas(resData, 'invoice_title')) {
						console.log(25);
						return false;
					}
					let isgo = false;
					let data = resData.cust_apply_attachs;
					for (let i = 1; i < data.length; i++) {
						if (data[i].url) {
							isgo = true;
						}
					}
					if (!isgo) {
						console.log(26);
						return false;
					}
				}
				return true;
		
		},

		// 提交
		async submitApply(ins) {
			// 获取详情数据
			let getDetailData = await this.getDetailData(ins);
			let vaildata = await this.validmyRequest(getDetailData);
			console.log(vaildata, '校验是否通过');
			if (!vaildata) {
				return uni.showToast({
					title:'请完善提交信息',
					icon:'none',
					duration:2000
				})
			}
			uni.showLoading({
				title: '提交中...',
				mask: true
			});
			this.$myRequest({
				url: this.$myhttpUrl.customer_apply_submit,
				data: {
					customer_apply_id: ins.customer_apply_id
				},
				success: res => {
					uni.hideLoading();
					let item = this.listdata[this.tabIndex];
					this.tabIndex++;
					if (this.tabIndex > this.tabBars.length) {
						this.tabIndex--;
					}
				},
				fail: err => {
					uni.showToast({
						title: '提交失败！',
						icon: 'none'
					});
				}
			});
		},
		// 撤回申请
		recallApply(ins) {
			this.$myRequest({
				url: this.$myhttpUrl.customer_apply_statback,
				data: {
					customer_apply_id: ins.customer_apply_id
				},
				success: res => {
					let item = this.listdata[this.tabIndex];
					this.tabIndex--; // 回退未提交列表
					if (this.tabIndex > 0) {
						this.tabIndex++;
					}
					uni.hideLoading();
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},

		// 添加客户
		goaddArchives() {
			this.$myNavigateTo('/pages/add-archives/add-archives', {
				is_active: 1
			});
		},

		// 获取数据
		getData(callback = false, refresh = false) {
			let data = this.formatRequest();
			this.$myRequest({
				url:this.$myhttpUrl.customer_apply_list,
				data: data,
				success: res => {
					uni.hideLoading();
					let item = this.listdata[this.tabIndex];
					if (res.datas) {
						item.list = refresh ? [...res.datas] : [...item.list, ...res.datas];
						// 没有更多数据
						if (res.datas.length < item.pagesize) {
							item.loadingType = 2;
							setTimeout(() => {
								item.islodMore = false;
							}, 2000);
						}
						if ((item.firstLoad = 'before')) {
							item.firstLoad = 'after';
						}
						// 执行回调
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						item.list = [];
						if ((item.firstLoad = 'before')) {
							item.firstLoad = 'after';
						}
						// 执行回调
						if (typeof callback == 'function') {
							callback();
						}
					}
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},
		cancel() {
			let item = this.listdata[this.tabIndex];
			// 如果之前加载过不用在获取请求
			item.requestData.pagenumber = 1;
			item.requestData.keyword = '';
			this.getData( false, true);
		},
		confirm(val) {
			let item = this.listdata[this.tabIndex];
			// 如果之前加载过不用在获取请求
			item.requestData.pagenumber = 1;
			item.requestData.keyword = val.value;
			uni.showLoading({
				title: '查询中...'
			});
			this.getData( false, true);
		},
		// 切换tabars
		ontabtap(index) {
			this.tabIndex = index;
		},
		// 滑动swiper
		ontabchange(e) {
			if (this.tabIndex == e.detail.current) return;
			this.tabIndex = e.detail.current;
		},
		// 加载更多
		upMore() {
			let item = this.listdata[this.tabIndex];
			item.islodMore = true;
			setTimeout(() => {
				if (item.loadingType !== 0) {
					return;
				}
				item.loadingType = 1;
				item.requestData.pagenumber++;
				this.getData( () => {
					item.islodMore = false;
					item.loadingType = 0;
				});
			}, 800);
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.header {
	padding: 30rpx 20rpx;
}
.search {
	width: 100%;
	background-color: #fdc100;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 20rpx 20rpx;
	.search_box {
		height: 70upx;
		border-radius: 70rpx;
		background-color: #ffffff;
		width: 100%;
		display: flex;
		align-items: center;
		text {
			font-size: 40rpx;
			line-height: 40rpx;
			color: #fdc100;
			margin-left: 10rpx;
		}
		input {
			flex: 1;
		}
	}
}

.tabs {
	height: 84rpx;
}
.tab-item {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

.tab-item-title {
	padding: 4rpx 0;
	margin-left: 10rpx;
	margin-right: 10rpx;
}

.tab-item-title-active {
	border-bottom: 4rpx solid #fdc100;
	color: #fdc100;
}

.add-button {
	width: 240rpx;
	height: 70rpx;
	border-radius: 70rpx;
	background: #fdc100;
	color: #ffffff;
	position: fixed;
	left: 50%;
	transform: translatex(-50%);
	bottom: 70rpx;
	box-shadow: 1rpx 1rpx 10rpx #cccccc;
	display: flex;
	align-items: center;
	justify-content: center;
}

.textsize {
	font-size: 34rpx;
}

.archCard {
	border: 1px solid #eeeeee;
	box-sizing: border-box;
	width: 100%;
	height: 180rpx;
	.left-contanier {
		background-color: #ffffff;
		color: #999999;
		font-size: 28rpx;
		padding: 10rpx 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.title {
			font-size: 32rpx;
			line-height: 60rpx;
			color: #444444;
		}

		.desc {
			line-height: 44rpx;
		}
		.adress {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.activeBtn {
		width: 120rpx;
		height: 50rpx;
		border-radius: 5rpx;
		font-size: 30rpx;
		color: #9cd4f5;
		border: 1rpx solid #9cd4f5;
		line-height: 50rpx;
		text-align: center;
		margin-right: 50rpx;
	}
	.hover-activeBtn {
		background-color: #fdc100;
		color: #fefefe;
	}
}
</style>
