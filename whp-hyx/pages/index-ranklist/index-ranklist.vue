<template>
	<view class="w-100 h-100">
		<template v-if="isEmpty">
			<not-thing class="h-100 w-100" />
		</template>
		<template v-else>
			<block v-for="(item, index) in list" :key="index"><ranking-list :item="item" :index="index"></ranking-list></block>
			<l-scroll-loading :loadingType="loadingType" />
		</template>
	</view>
</template>

<script>
import rankingList from '@/components/main/ranking-list.vue';
import notThing from '@/components/common/nothing/nothing.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
export default {
	components: {
		rankingList,
		lScrollLoading,
		notThing
	},
	data() {
		return {
			isLock: false, // 控制上拉加载锁
			loadingType: 5,
			islodMore: true,

			isEmpty: false,
			list: [],
			pageNumber: 1,
			pageSize: 10,
			maxSize: 50
		};
	},
	onLoad() {
		this.__init();
	},
	// 上拉加载
	onReachBottom() {
		const upFun = async () => {
			let datas = null;
			if (this.loadingType !== 5 && !this.islodMore) {
				return;
			}
			if (this.isLock) return;
			this.isLock = true;
			this.loadingType = 1;
			this.pageNumber += 1;
			try {
				console.log(this.pageNumber);
				datas = await this.getList({
					isInit: false,
					isShowLoding: false,
					refresh: false
				});
				this.list = [...this.list, ...datas];
				if (datas.length < this.pageSize) {
					this.loadingType = 2;
					this.islodMore = false;
				} else {
					this.loadingType = 5;
					this.islodMore = true;
				}
				uni.hideLoading();
			} catch (e) {
				this.pageNumber -= 1;
				this.loadingType = 5;
				this.islodMore = true;
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.isLock = false;
			}
		};
		const onReachFun = this.upLoadMore();
		onReachFun(upFun, 800);
	},
	onPullDownRefresh() {
		this.__downRefresh();
	},
	methods: {
		async __downRefresh() {
			try {
				let datas = await this.getList({
					isInit: true,
					isShowLoding: false,
					refresh: true
				});
				if (datas.length === 0 && this.pageNumber === 1) {
					this.isEmpty = true;
				}else{
					this.isEmpty = false;
				}
				this.loadingType = 5;
				this.list = datas;
				uni.stopPullDownRefresh();
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: '刷新失败',
					icon: 'none'
				});
			}
		},
		async __init() {
			try {
				let datas = await this.getList({
					isInit: true,
					isShowLoding: true,
					loadingText: '努力加载中...',
					refresh: true
				});
				if (datas.length === 0 && this.pageNumber === 1) {
					this.isEmpty = true;
				}else{
					this.isEmpty = false;
				}
				this.loadingType = 5;
				this.list = datas;
				uni.hideLoading();
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			}
		},
		upLoadMore() {
			let istrue = null;
			return function(fn, time) {
				time = time || 800;
				if (istrue) {
					clearTimeout(istrue);
				}
				istrue = setTimeout(fn, time);
			};
		},
		getList(option) {
			let { isInit, isShowLoding, loadingText, refresh, cb } = option;
			loadingText = loadingText || '加载中...';
			let params = {
				pageSize: this.pageSize,
				pageNumber: this.pageNumber
			};
			if (isInit) {
				params.pageNumber = 1;
				this.pageNumber = 1;
			}
			option = option || {};
			if (isShowLoding) {
				uni.showLoading({
					title: loadingText,
					mask: true
				});
			}
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.index_topList,
					data: params,
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						reject({ err: '获取失败' });
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
}
</style>
