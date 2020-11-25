<template>
	<view class="container">
		<!-- 头部内容 -->
		<view class="header">
			<view class="search">
				<text class="iconfont">&#xe643;</text>
				<input type="text" v-model="keyword" placeholder="搜索关键词" @confirm="search" />
			</view>
		</view>
		<!-- 中间列表 -->
		<view class="main">
			<view class="main-lis" v-if="dataList.length > 0">
				<view class="lis-title" v-for="(item, index) in dataList" :key="item.supervisor_id" @click="onchildall(item)">
					<view>
						<text class="iconfont color-r1">&#xe7b9;</text>
						<text class="text">{{ item.supervisor_name }}</text>
					</view>
					<view class="user">{{ item.username }}</view>
					<view>
						<text class="iconfont color-g2" v-if="item.selection">&#xe61f;</text>
						<text class="iconfont color-g1" v-if="!item.selection">&#xe634;</text>
					</view>
				</view>
				<l-scroll-loading :loadingType="loadingType" />
			</view>
			<view v-if="dataList.length === 0 && !firstLoad" class="nodata">亲,暂时没数据哦!</view>
		</view>
		<!-- 底部提交按钮 -->
		<view class="footer" v-if="isMoreSelect">
			<view class="temp-height"></view>
			<view class="pagebtn"><button class="screen-btn" @click="_confirm">确定</button></view>
		</view>
	</view>
</template>
<script>
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
export default {
	components: {
		lScrollLoading
	},
	data() {
		return {
			loadingType: 5,
			firstLoad: true, // 是否第一次加载
			isLoading: false, // 是否为加载状态
			nomoreData: false, // 没有数据
			isMoreSelect: false, // 判断是多选还是单选
			ckeckList: [], //多选
			radioTemp: {}, // 单选
			dataList: [],
			pagesize: 20,
			pagenumber: 1,
			keyword: '',
			id: null
		};
	},
	/**
	 * @param {object} option
	 * option.id  (number)  分公司的id
	 * option.ckeckList {Array}  默认选中的参数 [{supervisor_id: 21921,...}]
	 * option.isMoreSelect {Boolean}  判断是多选还是单选
	 * */
	onLoad(option) {
		if (option) {
			try {
				option = this.$formateOption(option);
				option.ckeckList && (this.ckeckList = option.ckeckList);
				option.isMoreSelect && (this.isMoreSelect = option.isMoreSelect);
				option.id && (this.id = option.id);
				if (!this.id) {
					throw { message: '所选区域的ID参数错误' };
				}
				let param = {
					pagesize: this.pagesize,
					pagenumber: this.pagenumber,
					id: this.id,
					keyword: ''
				};
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				this.getData(param)
					.then(res => {
						this.dataList = this.formateData(res);
						this.firstLoad = false;
					})
					.catch(err => {
						uni.showModal({
							title: '提示',
							content: err.message,
							showCancel: false,
							success() {
								return false;
							}
						});
					});
			} catch (e) {
				uni.showModal({
					title: '提示',
					content: e.message,
					showCancel: false,
					success() {
						return false;
					}
				});
			}
		}
	},

	/**
	 * 下拉刷新
	 * */

	onPullDownRefresh() {
		if (this.isLoading) return;
		this.isLoading = true;
		this.nomoreData = false;
		(this.pagesize = 10), (this.pagenumber = 1), (this.keyword = '');
		let param = {
			pagesize: this.pagesize,
			pagenumber: 1,
			id: this.id
		};
		try {
			this.getData(param)
				.then(res => {
					this.dataList = this.formateData(res);
				})
				.catch(err => {
					uni.showModal({
						title: '提示',
						content: err.message,
						showCancel: false,
						success() {
							return false;
						}
					});
				});
		} catch (e) {
			console.log(e);
		} finally {
			uni.stopPullDownRefresh();
		}
	},

	/*
	 *上拉加载更多
	 */

	onReachBottom() {
		if (this.loadingType !== 5) return;
		this.loadingType = 0;
		if (this.clearnTime) {
			clearTimeout(this.clearnTime);
		}
		this.clearnTime = setTimeout(this.upLoadFun, 800);
	},

	methods: {
		// 上拉加载执行方法
		async upLoadFun() {
			if (this.loadingType === 0) {
				this.loadingType = 1;
			}
			this.pagenumber++;
			let param = {
				pagesize: this.pagesize,
				pagenumber: this.pagenumber,
				id: this.id,
				keyword:this.keyword
			};
			try {
				let result = await this.getData(param);
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
		search() {
			if (this.isLoading) return;
			this.isLoading = true;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			//搜索
			let param = {
				pagesize: this.pagesize,
				pagenumber: 1,
				id: this.id,
				keyword: this.keyword
			};
			this.getData(param)
				.then(res => {
					let list = this.formateData(res);
					this.dataList = list;
				})
				.catch(err => {
					uni.showToast({
						title: '查询失败',
						icon: 'none'
					});
				});
		},

		getData(param) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.memberSupervisorList,
					data: param,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject({
							message: '请求失败'
						});
					},
					complete: () => {
						uni.hideLoading();
						this.isLoading = false;
					}
				});
			});
		},

		/**
		 * 组织数据
		 * */

		formateData(data) {
			if (!Array.isArray(data)) return data;
			let list = data.map(v => {
				if (this.isMoreSelect) {
					// 多选
					let list = this.ckeckList;
					let index = list.findIndex(s => s.supervisor_id === v.supervisor_id);
					if (index > -1) {
						return {
							...v,
							selection: true
						};
					} else {
						return {
							...v,
							selection: false
						};
					}
				} else {
					// 单选
					if (this.radioTemp.supervisor_id === v.supervisor_id) {
						return {
							...v,
							selection: true
						};
					} else {
						return {
							...v,
							selection: false
						};
					}
				}
			});

			return list;
		},

		/*
		选中事件
		*/
		onchildall(item) {
			item.selection = !item.selection;
			if (this.isMoreSelect) {
				// 多选
				let list = this.ckeckList;
				let index = list.findIndex(v => item.supervisor_id === v.supervisor_id);
				if (index > -1) {
					list.splice(index, 1);
				} else {
					list.push(item);
				}
			} else {
				// 单选
				this.radioTemp = item;
				this.$eventHub.$emit('screenLis', item);
				uni.navigateBack({});
			}
		},

		/*
		多选确定事件
		*/
		_confirm() {
			this.$eventHub.$emit('screenLis', this.ckeckList);
			uni.navigateBack({});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.header {
	width: 750rpx;
	height: 120rpx;
	background-color: #fdc100;
	overflow: hidden;

	.search {
		width: 690rpx;
		height: 70rpx;
		margin: 35rpx;
		border-radius: 35rpx;
		background-color: #fff;
		display: flex;
		text {
			width: 70rpx;
			text-align: center;
			color: #fdc100;
			font-size: 36rpx;
		}
		input {
			width: 620rpx;
			height: 70rpx;
			line-height: 70rpx;
		}
	}
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

.main {
	width: 750rpx;
}

.footer {
	.temp-height {
		width: 100%;
		height: 140rpx;
	}
	.pagebtn {
		width: 750rpx;
		height: 120rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 199;

		.screen-btn {
			display: inline-block;
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: 20rpx 30rpx;
			background-color: #fdc100;
			color: #fff;
			text-align: center;
			font-size: 34rpx;
		}
	}
}

.color-ddd {
	color: #dddddd !important;
}
.color-r1 {
	color: #f5a623 !important;
}
.color-r2 {
	color: #42dc61 !important;
}
.color-g1 {
	color: #bdc3c7 !important;
}
.color-g2 {
	color: #fdc100 !important;
}

.main-lis {
	.lis-title {
		width: 710rpx;
		height: 74rpx;
		line-height: 74rpx;
		padding: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
		border-bottom: 2rpx solid #f0f0f0;
		.user {
			flex: 1;
			text-align: right;
			font-size: 28rpx;
			margin-right: 20rpx;
		}
		.color-ddd {
			font-size: 28rpx;
			margin-right: 20rpx;
		}
		.color-r1 {
			margin-right: 20rpx;
		}
	}
	.lis-child {
		.lis-child-title {
			width: 670rpx;
			height: 74rpx;
			padding: 20rpx;
			padding-left: 60rpx;
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			border-bottom: 2rpx solid #f0f0f0;
			.color-r2 {
				margin-right: 20rpx;
			}
		}
	}
}
</style>
