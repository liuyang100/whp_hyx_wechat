<template>
	<view class="w-100 h-100 d-flex flex-column">
		<!-- 头部内容 -->
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
		<view class="list-content">
			<view class="main-lis">
				<template v-if="list.length > 0">
					<view class="lis" v-for="(item, index) in list" :key="item.customer_id" @click="hanldSelect(item)">
						<view class="lis-min">
							<label class="label">门店名称：</label>
							<text>{{ item.customer_name }}</text>
						</view>
						<view class="lis-min">
							<label class="label">电话：</label>
							<text>{{ item.mobile }}</text>
						</view>
					</view>
					<!-- <load-more :islodMore="islodMore" :loadingType="loadingType"></load-more> -->
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
import notThing from '@/components/common/nothing/nothing.vue';
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading';
export default {
	name: 'field-customer',
	data() {
		return {
			firstLoad: 'before',
			list: [],
			loadingType: 5,
			keyword: '',
			pagenumber: 1,
			pagesize: 20,
			clearnTime: null
		};
	},
	components: {
		notThing,
		lySearchBar,
		lScrollLoading
	},
	onLoad() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.upLoadFun();
	},
	// 下拉刷新
	onPullDownRefresh() {},
	// 上拉加载
	onReachBottom() {
		if (this.loadingType !== 5) return;
		this.loadingType = 0;
		if (this.clearnTime) {
			clearTimeout(this.clearnTime);
		}
		this.clearnTime = setTimeout(this.upLoadFun, 800);
	},
	computed: {
		tremKeyword() {
			return typeof this.keyword == 'string' ? this.keyword.trim() : '';
		}
	},
	methods: {
		// 上拉加载执行方法
		async upLoadFun() {
			if (this.loadingType === 0) {
				this.loadingType = 1;
			}
			this.pagenumber++;
			try {
				let result = await this.getData();
				this.list = this.list.concat(result);
				uni.hideLoading();
				if (this.firstLoad == 'before') {
					this.firstLoad = 'after';
				}
				if (result.length >= this.pagesize) {
					this.loadingType = 5;
				} else {
					if (this.pagenumber === 1) {
						this.loadingType = 5;
					} else {
						this.loadingType = 2;
					}
				}
			} catch (e) {
				this.pagenumber--;
				uni.showToast({
					title: e || '加载失败',
					icon: 'none',
					mask: true
				});
				//TODO handle the exception
			}
		},

		// 搜索
		async confirm(obj) {
			try {
				this.keyword = obj.value;
				uni.showLoading({
					title: '查询中...',
					mask: true
				});
				this.loadingType = 5;
				this.pagenumber = 1;
				let result = await this.getData();
				this.list = result;
				uni.hideLoading();
			} catch (e) {
				//TODO handle the exception
				uni.showToast({
					title: '查询失败',
					icon: 'none',
					mask: true
				});
			}
		},
		async cancel() {
			this.loadingType = 5;
			this.pagenumber = 1;
			this.keyword = '';
			let result = await this.getData();
			this.list = result;
		},
		getData() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.store_attendance_clock,
					data: {
						keyword: this.tremKeyword,
						pagenumber: this.pagenumber,
						pagesize: this.pagesize
					},
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						resolve();
					}
				});
			});
		},
		// 点击事件
		hanldSelect(ele) {
			console.log(ele);
			this.$eventHub.$emit('fieldCustomer', { customer_id: ele.customer_id, customer_name: ele.customer_name });
			uni.navigateBack();
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
	position: sticky;
	top: 0;

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
		margin: 20rpx 40rpx 0 40rpx;
		.lis {
			width: 630rpx;
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
					min-width: 130rpx;
					color: #999999;
					flex-shrink: 0;
				}
			}
		}
	}
}
</style>
