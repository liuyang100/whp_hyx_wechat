<template>
	<view class="w-100 h-100 d-flex flex-column">
		<!-- 头部内容 -->
		<view style="position: sticky;top: 0;">
			<view class="searchbox">
				<view class="search">
					<ly-search-bar
						class="flex-1 px-3"
						bgColor="#fff"
						clearButton="auto"
						:radius="100"
						cancelButton="auto"
						cancelText="取消"
						placeholder="搜索关键词"
						@confirm="confirm"
						@cancel="cancel"
					>
						<text class="iconfont ml-2 mian-colot100">&#xe643;</text>
					</ly-search-bar>
				</view>
			</view>
			<template v-if="isShowAdress">
				<adress-search @adressClick="adressClick"></adress-search>
			</template>
		</view>
		<view class="list-content">
			<view class="main-lis">
				<template v-if="list.length > 0">
					<view class="lis" v-for="(item, index) in list" :key="item.customer_apply_id" @click="hanldSelect(item)">
						<view class="lis-min">
							<label class="label">门店名称：</label>
							<text>{{ item.customer_name }}</text>
						</view>
						<view class="lis-min">
							<label class="label">姓名：</label>
							<text>{{ item.contacts }}</text>
						</view>
						<view class="lis-min">
							<label class="label">电话：</label>
							<text>{{ item.mobile }}</text>
						</view>
						<view class="lis-min">
							<label class="label">地址：</label>
							<text>{{ item.area_fullname }}</text>
						</view>
					</view>

					<l-scroll-loading :loadingType="loadingType" />
				</template>
				<template v-if="list.length == 0 && firstLoad == 'after'">
					<not-thing></not-thing>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
import adressSearch from '@/components/common/adress-search/adress-search.vue';
import notThing from '@/components/common/nothing/nothing.vue';
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading';
export default {
	name: 'see-customer',
	data() {
		return {
			clearTime: null,
			isShowAdress: true,
			loadingType: 5,
			islodMore: false,
			userInfo: {},
			list: [],
			pagesize: 10,
			pagenumber: 0,
			customerList: [],
			is_checked: 0,
			area_id: null,
			flag: 1,
			keyword: '',
			firstLoad: 'before'
		};
	},
	components: {
		adressSearch,
		notThing,
		lySearchBar,
		lScrollLoading
	},
	onLoad(option) {
		try {
			if (option) {
				option = this.$formateOption(option);
				console.log(option);
				option.hasOwnProperty('isShowAdress') && (this.isShowAdress = option.isShowAdress);
				this.is_checked = option.is_checked;
			}
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.upLoadFun();
		} catch (e) {
			//TODO handle the exception
			uni.showToast({
				icon: 'none',
				title: '加载失败'
			});
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中...',
			mask: true
		});
		this.pagenumber = 1;
		let data = this.getReqParam();
		this.getCustomerList(
			data,
			() => {
				this.loadingType = 5;
				uni.hideLoading();
			},
			true
		);
	},
	// 上拉加载
	onReachBottom() {
		if (this.loadingType !== 5) {
			return false;
		}
		this.loadingType = 0;
		if (this.clearTime) {
			clearTimeout(this.clearTime);
		}
		this.clearTime = setTimeout(this.upLoadFun, 800);
	},
	methods: {
		upLoadFun() {
			if (this.loadingType === 0) {
				this.loadingType = 1;
			}
			let data = this.getReqParam();
			data.pagenumber += 1;
			this.getCustomerList(data, res => {
				this.pagenumber++;
				if (this.firstLoad == 'before') {
					this.firstLoad = 'after';
				}
				if (res.length - this.pagesize < 0) {
					if (this.pagenumber === 1) {
						this.loadingType = 5;
					} else {
						this.loadingType = 2;
					}
				} else {
					this.loadingType = 5;
				}
			});
		},
		// 获取请求参数
		getReqParam() {
			let data = {
				pagesize: this.pagesize,
				pagenumber: this.pagenumber,
				flag: this.flag,
				is_checked: this.is_checked
			};

			if (this.keyword) {
				data.keyword = this.keyword;
			}
			if (this.area_id !== null) {
				data.area_id = this.area_id;
			}
			return data;
		},
		getCustomerList(data = {}, callback = false, refresh = false) {
			//网点拜访获取客户名称
			this.$myRequest({
				url: this.$myhttpUrl.customerList,
				data: data,
				success: res => {
					uni.stopPullDownRefresh();
					uni.hideLoading();
					if (!res && !res.data) {
						return uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					}
					let result = res.data;

					if (result) {
						// 是否下拉刷新refresh
						this.list = refresh ? [...result] : [...this.list, ...result];
						if (typeof callback == 'function') {
							callback(result);
						}
					}
				},
				fail: err => {
					return uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					});
				}
			});
		},

		// 筛选地址完后动态实时搜索
		adressClick(obj) {
			this.area_id = obj.area_id;
			this.flag = obj.flag;
			this.loadingType = 5;
			let data = this.getReqParam();
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			this.getCustomerList(
				data,
				() => {
					uni.hideLoading();
				},
				true
			);
		},

		// 点击选中客户名称
		hanldSelect(item) {
			this.$eventHub.$emit('changSelect', item);
			uni.navigateBack({});
		},
		// 搜索
		confirm(obj) {
			if (obj) {
				this.keyword = obj.value;
			}
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			this.loadingType = 5;
			this.pagenumber = 1;
			let data = this.getReqParam();
			this.getCustomerList(
				data,
				() => {
					uni.hideLoading();
				},
				true
			);
		},
		// 点击取消搜索
		cancel() {
			this.loadingType = 5;
			this.keyword = '';
			let data = this.getReqParam();
			this.getCustomerList(
				data,
				() => {
					uni.hideLoading();
				},
				true
			);
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100vw;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.searchbox {
	width: 750rpx;
	height: 120rpx;
	background-color: #fdc100;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	.search {
		width: 100%;
		height: 70rpx;
		display: flex;
	}
}
.list-content {
	width: 100%;
	background-color: #f5f5f5;
	box-sizing: border-box;
	padding: 20rpx 0;
	flex: 1;
	.main-lis {
		margin: 20rpx 40rpx;
		.lis {
			width: 630rpx;
			min-height: 200rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			font-size: 28rpx;

			.lis-min {
				min-height: 50rpx;
				line-height: 50rpx;
				display: flex;
				color: #333333;
				.label {
					color: #999999;
					flex-shrink: 0;
				}
			}
		}
	}
}
</style>
