<template>
	<view class="container">
		<!-- 头部内容 -->
		<view class="header">
			<view class="head-btn">
				<view class="head-btnlis" v-for="item in doNavs" :key="item.key_val" @tap="handClickNextPage(item)">
					<text class="iconfont color-yellow">&#xe7bd;</text>
					<text class="text">{{ item.name_val }}</text>
					<text class="iconfont color-999">&#xe601;</text>
				</view>
			</view>
			<view class="searchbox ">
				<view class="search">
					<ly-search-bar class="flex-1 px-3" bgColor="#fff" clearButton="auto" cancelButton="none" :radius="10" placeholder="搜索关键词" @confirm="dataReset">
						<text class="iconfont ml-2 mian-colot100">&#xe643;</text>
					</ly-search-bar>
				</view>
			</view>
		</view>

		<!-- 中间列表 -->
		<view class="main">
			<picker mode="selector" class="picker" @change="pickerChange" :value="index" :range="store" range-key="name">
				<view class="main-screen">
					<text>筛选条件</text>
					<view>
						<text>{{ store[storeIndex].name }}</text>
						<text class="iconfont color-999">&#xe601;</text>
					</view>
				</view>
			</picker>

			<!-- 列表 -->
			<view class="dot-lis" v-for="d in data" :key="d.kanban_id" @click="pulishDetail(d)">
				<text class="iconfont already-green" v-if="d.is_read">&#xe659;</text>
				<text class="iconfont already-red" style="font-size: 38px;" v-else>&#xe745;</text>
				<view class="lis-top">
					<view class="lis-logo"><image :src="d.image_name"></image></view>
					<view class="lis-main">
						<text class="lis-name lin">{{ d.name }}</text>
						<text>客户名称：{{ d.customer_name }}</text>
						<text>主题：{{ d.title }}</text>
						<text>内容：{{ d.content }}</text>
						<view class="main-img"><image v-for="p in d.pic_attachs" :key="p" :src="p.file_url"></image></view>
						<view class="lin">
							<text class="iconfont">&#xe6b7;</text>
							<text>{{ d.visited_adress }}</text>
						</view>
						<view class="time">
							<text>{{ d.create_date }}</text>
						</view>
					</view>
				</view>
				<view class="lis-tist">
					<view class="tise-lis" v-for="r in d.replys" :key="r.userid">
						<view class="tist-logo"><image :src="r.image_name"></image></view>
						<view class="tise-main">
							<view class="tise-head">
								<text class="lin">{{ r.name }}</text>
								<text>{{ r.create_date }}</text>
							</view>
							<text>{{ r.content }}</text>
						</view>
					</view>
				</view>
			</view>
			<l-scroll-loading :loadingType="loadingType" />
			<!-- END 列表 -->
		</view>
	</view>
</template>

<script>
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
import { mapState } from 'vuex';

export default {
	components: {
		lySearchBar,
		lScrollLoading
	},
	data() {
		return {
			clearTime: null,
			isLoading: false,
			isLoadMore: false,
			loadingType: 5,
			doNavs: [
				{
					name_val: '网点拜访发布',
					key_val: 'notrelease',
					path: '/pages/branch-pulish/branch-pulish',
					rules: ['HYXYWY', 'HYXZDZG', 'HYXFGSJL'],
					sicon: '&#xe7bd;',
					eicon: '&#xe601;'
				},
				{
					name_val: '网点拜访查询',
					key_val: 'notquery',
					path: '/pages/dotQuery/dotQuery',
					rules: ['HYXYWY', 'HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXZDZG', 'HYXLSQDZJ'],
					sicon: '&#xe7bd;',
					eicon: '&#xe601;'
				}
			],
			data: [],
			storeIndex: 0, //筛选
			store: [
				//筛选内容
				{
					name: '全部',
					id: 0
				},
				{
					name: '未读',
					id: 1
				},
				{
					name: '我提交的',
					id: 2
				},
				{
					name: '抄送给我的',
					id: 3
				}
			],
			pagenumber: 1,
			pagesize: 10,
			keyword: ''
		};
	},
	computed: {
		...mapState({
			role_code: state => state.user.role_code
		})
	},
	onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			icon: 'none'
		});
		this.dataReset();
	},

	onReachBottom() {
		if (this.isLoadMore) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			if (this.clearTime) {
				clearTimeout(this.clearTime);
			}
			this.loadingType = 0;
			this.clearTime = setTimeout(() => {
				this.loadingType = 1;
				let params = {
					state: this.store[this.storeIndex].id,
					pagesize: this.pagesize,
					pagenumber: this.pagenumber
				};
				this.keyword && (params.keyword = this.keyword);
				params.pagenumber += 1;
				this.getVisitData(params)
					.then(res => {
						if (res.length < this.pagesize) {
							this.isLoadMore = false;
							this.loadingType = 2;
						} else {
							this.isLoadMore = true;
							this.loadingType = 5;
						}
						let tempData = this.data;
						this.data = tempData.concat(res);
						this.pagenumber = params.pagenumber;
						this.isLoading = false;
					})
					.catch(err => {
						uni.showToast({
							title: '上拉加载失败'
						});
						this.isLoading = false;
					});
			});
		}
	},
	onPullDownRefresh() {
		//下拉刷新
		this.dataReset();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		// 获取详情页
		pulishDetail(item) {
			this.$myNavigateTo('/pages/branch-pulish/branch-detail', {
				kanban_id: item.kanban_id
			});
		},
		//
		handClickNextPage(item) {
			if (!item.rules.includes(this.role_code)) {
				uni.showToast({
					title: '没有访问权限',
					icon: 'none'
				});
				return;
			}
			this.$myNavigateTo(item.path);
		},
		// 修改筛选
		pickerChange(e) {
			//筛选
			this.storeIndex = e.detail.value;
			this.search();
		},
		async search() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			this.pagenumber = 1;
			let params = {
				state: this.store[this.storeIndex].id,
				pagesize: this.pagesize,
				pagenumber: this.pagenumber
			};
			this.keyword && (params.keyword = this.keyword);
			try {
				const data = await this.getVisitData(params);
				uni.hideLoading();
				if (data.length < this.pagesize) {
					this.isLoadMore = false;
				} else {
					this.isLoadMore = true;
				}
				this.data = data;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: e.message,
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		// 下拉刷新
		async dataReset() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			this.keyword = '';
			this.pagenumber = 1;
			this.storeIndex = 0;
			let params = {
				state: this.store[this.storeIndex].id,
				pagesize: this.pagesize,
				pagenumber: this.pagenumber
			};
			this.keyword && (params.keyword = this.keyword);
			try {
				const data = await this.getVisitData(params);
				uni.hideLoading();
				if (data.length < this.pagesize) {
					this.isLoadMore = false;
				} else {
					this.isLoadMore = true;
				}
				console.log(data.length);
				this.data = data;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: e.message,
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		getVisitData(params) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.twkanban_list,
					data: params,
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						resolve({ message: '获取失败' });
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
.container {
	background-color: #f6f6f6;
}
.header {
	width: 750rpx;
	height: 230rpx;
	background-color: #fdc100;
	.head-btn {
		width: 690rpx;
		height: 90rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		.head-btnlis {
			width: 320rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: rgba(255, 255, 255, 0.9);
			border-radius: 10rpx;
			color: #111;
			display: flex;
			.color-yellow {
				display: inline-block;
				width: 60rpx;
				text-align: center;
			}
			.text {
				display: inline-block;
				width: 200rpx;
			}
		}
	}
	.searchbox {
		width: 100%;
		height: 70rpx;
		background-color: #fdc100;
		display: flex;
		align-items: center;
		justify-content: center;
		.search {
			width: 100%;
			height: 70rpx;
			display: flex;
		}
	}
}

.main {
	width: 750rpx;
	.main-screen {
		height: 80rpx;
		padding: 0 20rpx;
		line-height: 80rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 2rpx solid #ccc;
		font-size: 30rpx;
		color: #444;
		background-color: #fff;
		text {
			display: inline-block;
		}
	}

	.dot-lis {
		width: 710rpx;
		position: relative;
		padding: 0 20rpx;
		padding-top: 25rpx;
		background-color: #fff;
		border-bottom: 20rpx solid #f6f6f6;
		.already-green {
			position: absolute;
			top: 0;
			right: 0;
			font-size: 90rpx;
			color: #00aa00;
		}
		.already-red {
			position: absolute;
			top: 0;
			right: 0;
			font-size: 90rpx;
			color: #f00;
		}
		.lis-top {
			display: flex;
			.lis-logo {
				width: 100rpx;
				image {
					width: 80rpx;
					height: 80rpx;
					padding: 10rpx;
				}
			}
			.lis-main {
				width: 550rpx;
				text {
					display: block;
					font-size: 26rpx;
					line-height: 42rpx;
					color: #888;
				}
				.main-img {
					margin: 10rpx 0;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					image {
						width: 180rpx;
						height: 180rpx;
						margin: 10rpx 0;
					}
				}
				.lin {
					display: flex;
					.iconfont {
						font-size: 34rpx;
						font-weight: 600;
						margin-right: 10rpx;
					}
				}
				.time {
					display: flex;
					justify-content: space-between;
					.iconfont {
						font-size: 30rpx;
						font-weight: 600;
					}
				}
			}
		}
		.lis-tist {
			width: 710rpx;
			margin: 20rpx 0;
			background-color: #f6f6f6;
			.tise-lis {
				width: 690rpx;
				padding: 20rpx 0;
				min-height: 100rpx;
				display: flex;
				.tist-logo {
					width: 100rpx;
					image {
						width: 80rpx;
						height: 80rpx;
						padding: 10rpx;
					}
				}
				.tise-main {
					width: 610rpx;
					min-height: 100rpx;
					border-bottom: 2rpx solid #f0f0f0;
					color: #999999;
					.tise-head {
						display: flex;
						justify-content: space-between;
						text {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
}

.color-yellow {
	color: #fdc100;
}
.color-999 {
	color: #999;
}
.lin {
	color: #54a5f9 !important;
	text {
		color: #54a5f9 !important;
	}
}
</style>
