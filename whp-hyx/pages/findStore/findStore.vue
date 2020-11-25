<template>
	<view class="container">
		<view class="search">
			<view class="search-inp">
				<text class="search-icon iconfont">&#xe643;</text>
				<view class="input-box">
					<input class="input-kesword" type="search" placeholder="请输入关键字" v-model="keyword" @confirm="search" />
					<text class="close-keyword iconfont" v-if="isShowClearn" @tap="keyword = ''">&#xe61b;</text>
				</view>
				<text class="tip-cancel" v-if="isShowClearn" @click="cancel">取消</text>
			</view>
		</view>
		<!-- 中间列表 -->
		<view class="main">
			<view class="main-lis check-list">
				<view class="list-row" @tap="checkIsAllOpen = !checkIsAllOpen">
					<view class="lis-parent-row">
						<text :class="checkIsAllOpen ? 'rotate-s' : ''" class="iconfont color-ddd mr-2">&#xe71a;</text>
						已选中的人员
					</view>
				</view>
				<template v-if="checkIsAllOpen">
					<view class="main-lis" v-for="(item, index) in tempList" :key="item.store_id">
						<view class="list-row">
							<view class="lis-parent-row" v-if="item.selectPar">
								<view @tap="changeCheckRow(index)" class="plader_icon-box">
									<view class="iconfont color-ddd rotate-animation" :class="item.select ? 'rotate-s' : ''">&#xe71a;</view>
									<view class="iconfont color-r1">&#xe7b9;</view>
								</view>
								<view class="org-name">
									{{ item.member_name }}
									<!-- <view class="org-name-text"></view> -->
								</view>
								<view class="iconfont check-icon" @click.stop="changeCheckAll(index)" :class="item.allSelect ? 'color-g2' : 'color-g1'"></view>
							</view>
							<template v-if="item.list && item.list.length > 0 && item.selectPar && item.select">
								<block v-for="(chitem, chindex) in item.list" :key="chitem.store_id">
									<view class="lis-child-row" v-if="chitem.select">
										<view class="plader_icon-box"><view class="iconfont color-r2">&#xe7b9;</view></view>
										<view class="org-name">
											{{ chitem.name }}
											<!-- <view class="org-name-text"></view> -->
										</view>
										<view
											class="iconfont check-icon"
											@click.stop="changeCheckChildItem(index, chindex)"
											:class="chitem.select ? 'color-g2' : 'color-g1'"
										></view>
									</view>
								</block>
							</template>
						</view>
					</view>
				</template>
			</view>
			<!-- 实际数据列表 -->
			<view class="main-lis" v-for="(item, index) in data" :key="index">
				<view class="list-row">
					<view class="lis-parent-row">
						<view @tap="changeRow(index)" class="plader_icon-box">
							<view class="iconfont color-ddd rotate-animation" :class="item.select ? 'rotate-s' : ''">&#xe71a;</view>
							<view class="iconfont color-r1">&#xe7b9;</view>
						</view>
						<view class="org-name">
							{{ item.member_name }}
							<!-- <view class="org-name-text"></view> -->
						</view>
						<view class="iconfont check-icon" @click.stop="onParentAll(index)" :class="item.allSelect ? 'color-g2' : 'color-g1'"></view>
					</view>
					<template v-if="item.list && item.list.length > 0 && item.select">
						<view class="lis-child-row" v-for="(chitem, chindex) in item.list" :key="chitem.store_id">
							<view class="plader_icon-box"><view class="iconfont color-r2">&#xe7b9;</view></view>
							<view class="org-name">
								{{ chitem.name }}
								<!-- <view class="org-name-text"></view> -->
							</view>
							<view class="iconfont check-icon" @click.stop="onChildItem(index, chindex)" :class="chitem.select ? 'color-g2' : 'color-g1'"></view>
						</view>
					</template>
				</view>
			</view>
		</view>

		<view class="pagebtn"><text class="screen-btn" @click="screenBtn">确定</text></view>
	</view>
</template>

<script>
import { deepClone } from '@/ulits/Validation.js';
export default {
	data() {
		return {
			tempList: [],
			checkIsAllOpen: false,
			data: [],
			keyword: '',
			isLoading: false,
			storeKeyName: 'CREATE_BRAND_CATEGORY',
			sale_org_id: null
		};
	},

	onLoad(option) {
		try {
			option && (option = this.$formateOption(option));
			this.sale_org_id = option.id;
			const value = uni.getStorageSync(this.storeKeyName);
			if (value) {
				const { data = [] } = JSON.parse(value);
				this.tempList = data;
			}
			this.__init();
		} catch (e) {
			//TODO handle the exception
			console.log(e);
			uni.showToast({
				title: '传递参数错误',
				icon: 'none'
			});
		}
	},
	computed: {
		isShowClearn() {
			return typeof this.keyword == 'string' && !!this.keyword.trim().length;
		}
	},
	methods: {
		// 首次进来页面加载
		async __init() {
			try {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				const { datas, length } = await this.getsaleOrgList();
				uni.hideLoading();
				const tempData = this.formatrequest(datas, { isSelect: false });
				this.data = deepClone(tempData);
				this.tempList = deepClone(tempData);
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
				// error
			}
		},

		// 给每个数据设置一个是否选中的标识符
		formatrequest(arr, initOption) {
			const { isSelect = false } = initOption;
			let tempList = this.tempList;
			let datas = [];
			datas = arr.map(v => {
				let { list, member_name, company_id, select = false, selectPar = false, allSelect = false } = v;
				if (isSelect) {
					select = true;
				}
				try {
					const findIndex = tempList.findIndex(s => s.company_id == company_id);
					if (findIndex > -1) {
						let findItem = tempList[findIndex];
						selectPar = findItem.selectPar || selectPar;
						allSelect = findItem.allSelect || allSelect;
						const findSaleMans = findItem.list.filter(v => v.select).map(v => v.store_id) || [];
						list = list.map(s => {
							let { company_id, member_name,name,store_id, select = false } = s;
							if (findSaleMans.includes(store_id)) {
								select = true;
							}
							return {
								name,
								company_id,
								store_id,
								member_name,
								select
							};
						});
						if (selectPar && !allSelect) {
							select = true;
						}
					} else {
						list = list.map(k => {
							return {
								...k,
								select: false
							};
						});
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					return {
						list,
						member_name,
						company_id,
						select,
						selectPar,
						allSelect
					};
				}
			});
			return datas;
		},
		// 点击确定
		screenBtn() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			try {
				let sales_man_ids = [];
				let sales_man_str = [];
				this.tempList.forEach(v => {
					if (v.selectPar && v.allSelect) {
						v.list.forEach(s => {
							sales_man_ids.push(s.store_id);
							sales_man_str.push(s.name);
						});
					} else if (v.selectPar && !v.allSelect) {
						v.list.forEach(k => {
							if (k.select) {
								sales_man_ids.push(k.store_id);
								sales_man_str.push(k.name);
							}
						});
					}
				});
				let tempObj = {
					store_id: sales_man_ids,
					valueName: sales_man_str.join(';')
				};
				const screeningPersonnel = {
					data: this.tempList
				};
				uni.setStorage({
					key: this.storeKeyName,
					data: JSON.stringify(screeningPersonnel),
					success: function() {
						console.log('添加缓存成功');
					}
				});
				//将数据发射到父级监听事件中
				this.$eventHub.$emit('findStoredata', tempObj);
				//关闭当前窗口
				uni.navigateBack({});
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			} finally {
				this.isLoading = false;
			}
		},

		// 取消
		cancel() {
			this.keyword = '';
			this.search();
		},

		// 关键字搜索
		async search() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '搜索中...',
				mask: true
			});
			try {
				let { datas, length } = await this.getsaleOrgList();
				const isTrue = this.isShowClearn;
				uni.hideLoading();
				const tempData = this.formatrequest(datas, { isSelect: isTrue });
				this.data = deepClone(tempData);
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: '搜索失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		getsaleOrgList() {
			return new Promise((resolve, reject) => {
				let params = {
					sale_org_id: this.sale_org_id,
					type: 2
				};
				if (this.isShowClearn) {
					params.keyword = this.keyword;
				}
				this.$myRequest({
					url: this.$myhttpUrl.findStore,
					data: params,
					success: res => {
						const result = {
							datas: res.data,
							length: res.data.length
						};
						resolve(result);
					},
					fail: err => {
						resolve();
					}
				});
			});
		},

		// 收缩或者打开展开机构
		changeRow(Pindex) {
			this.data[Pindex].select = !this.data[Pindex].select;
		},

		// 选中收缩或者打开展开机构
		changeCheckRow(Pindex) {
			this.tempList[Pindex].select = !this.tempList[Pindex].select;
		},

		// 全选或者取消全选
		onParentAll(Pindex) {
			let dataItem = this.data[Pindex];
			const tempSale_org_id = dataItem.company_id;
			const tempAllSelect = dataItem.allSelect;
			dataItem.allSelect = !tempAllSelect;
			dataItem.selectPar = !tempAllSelect;
			dataItem.list = dataItem.list.map(v => {
				let { store_id, company_id, company_name, name, select } = v;
				return {
					store_id,
					company_id,
					company_name,
					name,
					select: !tempAllSelect
				};
			});
			this.data.splice(Pindex, 1, dataItem);
			const findPindex = this.tempList.findIndex(v => v.company_id == tempSale_org_id);
			if (findPindex > -1) {
				let newdata = deepClone(dataItem);
				this.tempList.splice(findPindex, 1, newdata);
			}
		},

		// 选中机构下员工单个
		onChildItem(Pindex, Cindex) {
			try {
				let list = this.tempList;
				let dataItem = this.data[Pindex];
				const tempSale_org_id = dataItem.company_id;
				let childDataItem = dataItem.list[Cindex];
				const initChildDataItemSelect = childDataItem.select;
				childDataItem.select = !childDataItem.select;
				let isAllSelect = true;
				let isSelectPar = false;
				dataItem.list.forEach(v => {
					if (v.select) {
						!isSelectPar && (isSelectPar = true);
					} else {
						isAllSelect && (isAllSelect = false);
					}
				});
				dataItem.allSelect = isAllSelect;
				dataItem.selectPar = isSelectPar;
				if (!isAllSelect && isSelectPar) {
					dataItem.select = true;
				}
				this.data.splice(Pindex, 1, dataItem);
				const findPindex = this.tempList.findIndex(v => v.company_id == tempSale_org_id);
				if (findPindex > -1) {
					let newdata = deepClone(dataItem);
					newdata.select = true;
					this.tempList.splice(findPindex, 1, newdata);
				}
			} catch (e) {
				//TODO handle the exception
				console.log('error', e);
			}
		},

		/*
		 * 点击选中取消操作
		 * 1，找到品牌company_id
		 * 2,根据id找到所在数据的索引
		 * 2,修改取消全部选中的状态
		 * 3,删除自己在tempList
		 */
		changeCheckAll(Pindex) {
			// list,
			// member_name,
			// company_id,
			// select,
			// selectPar,
			// allSelect
			let { list, company_id, allSelect, selectPar, select, member_name } = this.tempList[Pindex];
			let datas = this.data;
			const findPindex = datas.findIndex(v => v.company_id == company_id);
			if (findPindex > -1) {
				this.onParentAll(findPindex);
			} else {
				allSelect = !allSelect;
				selectPar = !allSelect;
				list.forEach(v => {
					v.select = !allSelect;
				});
			}
			if (!this.tempList.length) {
				this.checkIsAllOpen = !!this.tempList.length;
			}
		},

		/*
		 * 取消品牌下的品类
		 * 1，找到品牌company_id
		 * 2,根据id找到所在数据的索引
		 * 2,修改取消全部选中的状态
		 * 3,删除自己在tempList
		 */
		changeCheckChildItem(Pindex, Cindex) {
			let dataItem = this.tempList[Pindex];
			const { store_id } = dataItem.sale_mans[Cindex];
			let datas = this.data;
			const findPindex = datas.findIndex(v => v.company_id == dataItem.company_id);
			if (findPindex > -1) {
				let findPartItem = datas[findPindex];
				const findCindex = findPartItem.list.findIndex(v => v.store_id == store_id);
				if (findCindex > -1) {
					this.onChildItem(findPindex, findCindex);
				}
			} else {
				dataItem.list[Cindex].select = false;
				let isAllSelect = true;
				let isSelectPar = false;
				dataItem.list.forEach(v => {
					if (v.select) {
						!isSelectPar && (isSelectPar = true);
					} else {
						isAllSelect && (isAllSelect = false);
					}
				});
				dataItem.allSelect = isAllSelect;
				dataItem.selectPar = isSelectPar;
				this.tempList.splice(Pindex, 1, dataItem);
			}
			if (!this.tempList.length) {
				this.checkIsAllOpen = !!this.tempList.length;
			}
		}
	}
};
</script>

<style lang="scss">
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
.main {
	width: 750rpx;
	padding-bottom: 150rpx;
	.main-lis {
		&.check-list {
			position: sticky;
			top: 0;
			left: 0;
			right: 0;
			background-color: #eeeeee;
			color: #fdc100;
		}
		width: 750rpx;
		box-sizing: border-box;
		overflow: hidden;
		.list-row {
			width: 100%;
			box-sizing: border-box;
			.lis-parent-row {
				box-sizing: border-box;
				padding: 10rpx 10rpx 10rpx 20rpx;
				min-height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				.rotate-s {
					transform: rotate(90deg);
				}
				.plader_icon-box {
					width: 80rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-right: 20rpx;
					font-size: 32rpx;
					.color-ddd {
						color: #dddddd;
					}
					.color-r1 {
						color: #f5a623;
					}
					.rotate-animation {
						transition: all 0.1s linear;
					}
				}
				.org-name {
					flex: 1;
					overflow-x: scroll;
					font-size: 32rpx;
					// .org-name-text{
					// 	white-space: nowrap;
					// }
				}
				.check-icon {
					width: 60rpx;
					text-align: center;
				}
				.color-g1 {
					color: #bdc3c7;
					&::after {
						content: '\e634';
					}
				}
				.color-g2 {
					color: #fdc100;
					&::after {
						content: '\e61f';
					}
				}
			}
			.lis-child-row {
				box-sizing: border-box;
				min-height: 80rpx;
				width: 100%;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 10rpx 10rpx 10rpx 60rpx;
				.plader_icon-box {
					width: 40rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin-right: 20rpx;
					font-size: 32rpx;
					.color-r2 {
						color: #42dc61;
					}
				}
				.org-name {
					flex: 1;
					overflow-x: scroll;
					font-size: 32rpx;
					// .org-name-text{
					// 	white-space: nowrap;
					// }
				}
				.check-icon {
					width: 60rpx;
					text-align: center;
				}
				.color-g1 {
					color: #bdc3c7;
					&::after {
						content: '\e634';
					}
				}
				.color-g2 {
					color: #fdc100;
					&::after {
						content: '\e61f';
					}
				}
			}
		}
	}
}
.search {
	width: 750rpx;
	height: 120rpx;
	background-color: #fdc100;
	overflow: hidden;
	display: flex;
	.search-inp {
		width: 690rpx;
		height: 70rpx;
		margin: 35rpx;
		border-radius: 35rpx;
		position: relative;
		display: flex;
		align-items: center;
		.search-icon {
			color: #888;
			position: absolute;
			left: 20rpx;
			font-size: 32rpx;
			z-index: 1;
		}
		.input-box {
			flex: 1;
			display: flex;
			align-items: center;
			position: relative;
			.input-kesword {
				flex: 1;
				padding-left: 60rpx;
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 30rpx;
				background-color: #f5f6f8;
			}
			.close-keyword {
				position: absolute;
				right: 0;
				top: 0;
				right: 10rpx;
				font-size: 34rpx;
				color: #888;
				z-index: 999;
				display: block;
				width: 40rpx;
				height: 64rpx;
				text-align: center;
				line-height: 64rpx;
			}
		}

		.tip-cancel {
			font-size: 28rpx;
			color: #333333;
			margin-left: 10rpx;
		}
	}
}
</style>
