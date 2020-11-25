<template>
	<view class="container">
		<view class="search">
			<view class="search-inp">
				<text class="search-icon iconfont">&#xe643;</text>
				<view class="input-box">
					<input class="input-kesword" type="search" placeholder="请输入业务员/终端主管关键字" v-model="keyword" @confirm="search" />
					<text class="close-keyword iconfont" v-if="isShowClearn" @tap="keyword = ''">&#xe61b;</text>
				</view>
				<text class="tip-cancel" v-if="isShowClearn" @click="cancel">取消</text>
			</view>
		</view>
		<!-- 中间列表 -->
		<view class="main">
			<view class="main-lis check-list" >
				<view class="list-row" @tap="checkIsAllOpen = !checkIsAllOpen">
					<view class="lis-parent-row">
						<text  :class="checkIsAllOpen ? 'rotate-s' : ''" class="iconfont color-ddd mr-2">&#xe71a;</text>
						已选中的人员
					</view>
				</view>
				<template v-if="checkIsAllOpen">
					<view class="main-lis" v-for="(item, index) in tempList" :key="item.sale_org_id">
						<view class="list-row">
							<view class="lis-parent-row" v-if="item.selectPar">
								<view @tap="changeCheckRow(index)" class="plader_icon-box">
									<view class="iconfont color-ddd rotate-animation" :class="item.select ? 'rotate-s' : ''">&#xe71a;</view>
									<view class="iconfont color-r1">&#xe7b9;</view>
								</view>
								<view class="org-name">
									{{ item.sale_org_name }}
								</view>
								<view class="iconfont check-icon" @click.stop="changeCheckAll(index)" :class="item.allSelect ? 'color-g2' : 'color-g1'"></view>
							</view>
							<template v-if="item.sale_mans && item.sale_mans.length > 0 &&  item.selectPar && item.select">
								<block v-for="(chitem, chindex) in item.sale_mans" :key="chitem.sale_man_id">
									<view class="lis-child-row" v-if="chitem.select">
										<view class="plader_icon-box"><view class="iconfont color-r2">&#xe7b9;</view></view>
										<view class="org-name">
											{{ chitem.sale_man_name }}
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
							{{ item.sale_org_name }}
							<!-- <view class="org-name-text"></view> -->
						</view>
						<view class="iconfont check-icon" @click.stop="onParentAll(index)" :class="item.allSelect ? 'color-g2' : 'color-g1'"></view>
					</view>
					<template v-if="item.sale_mans && item.sale_mans.length > 0 && item.select">
						<view class="lis-child-row" v-for="(chitem, chindex) in item.sale_mans" :key="chitem.sale_man_id">
							<view class="plader_icon-box"><view class="iconfont color-r2">&#xe7b9;</view></view>
							<view class="org-name">
								{{ chitem.sale_man_name }}
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
			isMoreSelect:false,
			tempList: [],
			checkIsAllOpen: false,
			data: [],
			keyword: '',
			isLoading: false,
			storeKeyName: 'KPISALESMAN_LIST',
		};
	},
	/**
	 * @param {object} option
	 * option.isMoreSelect {Boolean}  判断是多选还是单选
	 * */
	onLoad(option) {
			try{
				option&&(option=this.$formateOption(option));
				 const {isMoreSelect} = option;
				 this.isMoreSelect = isMoreSelect;
				console.log(option);
				const value = uni.getStorageSync(this.storeKeyName);
				if (value) {
					const { data = []} = JSON.parse(value);
					this.tempList = data;
				} 
				this.__init();
			}catch(e){
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title:'传递参数错误',
					icon:'none'
				})
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
				const tempData = this.formatrequest(datas,{isSelect:false});
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
		formatrequest(arr, initOption) {
			// 控制是否为搜索展开处理 isSelect
			const { isSelect = false } = initOption;
			let tempList = this.tempList;
			let datas = [];
			datas = arr.map(v => {
				let { sale_mans, sale_org_name, sale_org_id, select = false, selectPar = false, allSelect = false } = v;
				// 如果是有关键字，默认为搜索处理，将搜索的内容全部自动展开
				if (isSelect) {
					select = true;
				}
				try {
					const findIndex = tempList.findIndex(s => s.sale_org_id == sale_org_id);
					if (findIndex > -1) {
						let findItem = tempList[findIndex];
						selectPar = findItem.selectPar || selectPar;
						allSelect = findItem.allSelect || allSelect;
						const findSaleMans = findItem.sale_mans.filter(v => v.select).map(v => v.sale_man_id) || [];
						sale_mans = sale_mans.map(s => {
							let { sale_man_id, sale_man_name, select = false } = s;
							if (findSaleMans.includes(sale_man_id)) {
								select = true;
								console.log("sdf",sale_man_id)
							}
							return {
								sale_man_id,
								sale_man_name,
								select
							};
						});
						if (selectPar && !allSelect) {
							
							select = true;
						}
					} else {
						sale_mans =sale_mans.map(k => {
							return {
								...k,
								select: false
							};
						});
					}
				} catch (e) {
					console.log('组织数据错误', e);
				} finally {
					return {
						sale_mans,
						sale_org_name,
						sale_org_id,
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
				let sales_man_str =[];
				this.tempList.forEach(v =>{
					if(v.allSelect){
						sales_man_str.push(v.sale_org_name)
						v.sale_mans.forEach(k => {
							if(k.select){
								sales_man_ids.push(k.sale_man_id);
							}
						})
					}else{
						v.sale_mans.forEach(k => {
							if(k.select){
								sales_man_ids.push(k.sale_man_id);
								sales_man_str.push(k.sale_man_name);
							}
						})
					}
					
				})
				let tempObj = {
					store_id: sales_man_ids,
					valueName: sales_man_str.join(";")
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
				this.$eventHub.$emit('screenLis', tempObj);
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
				const tempData = this.formatrequest(datas,{isSelect:isTrue});
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
				let params = {};
				if(this.isShowClearn){
					params.keyword = this.keyword;
				}
				this.$myRequest({
					url: this.$myhttpUrl.findSalemanList,
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
		changeCheckRow(Pindex){
			const { sale_org_name, sale_org_id, sale_mans, select, selectPar, allSelect } = this.tempList[Pindex];
			this.tempList.splice(Pindex, 1, {
				sale_org_name,
				sale_org_id,
				sale_mans,
				select: !select,
				selectPar,
				allSelect
			});
		},


		// 全选或者取消全选
		onParentAll(Pindex) {
			let dataItem = this.data[Pindex];
			const tempSale_org_id = dataItem.sale_org_id;
			const tempAllSelect = dataItem.allSelect;
			dataItem.allSelect = !tempAllSelect;
			dataItem.selectPar = !tempAllSelect;
			dataItem.sale_mans = dataItem.sale_mans.map(v => {
				const { sale_man_id, sale_man_name, select } = v;
				return {
					sale_man_id,
					sale_man_name,
					select: !tempAllSelect
				};
			});
			this.data.splice(Pindex, 1, dataItem);
			const findPindex = this.tempList.findIndex(v => v.sale_org_id == tempSale_org_id);
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
				const tempSale_org_id = dataItem.sale_org_id;
				let childDataItem = dataItem.sale_mans[Cindex];
				const initChildDataItemSelect = childDataItem.select;
				const tempSale_man_id = childDataItem.sale_man_id;
				childDataItem.select = !childDataItem.select;
				let isAllSelect = true;
				let isSelectPar = false;
				dataItem.sale_mans.forEach(v => {
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
				const findPindex = this.tempList.findIndex(v => v.sale_org_id == tempSale_org_id);
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
		changeCheckAll(Pindex){
			let { sale_org_id, allSelect, selectPar, select, sale_mans } = this.tempList[Pindex];
			let datas = this.data;
			const findPindex = datas.findIndex(v => v.sale_org_id == sale_org_id);
			if (findPindex > -1) {
				this.onParentAll(findPindex);
			} else {
				allSelect = !allSelect;
				selectPar = !allSelect;
				sale_mans.forEach(v => {
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
		changeCheckChildItem(Pindex, Cindex){
			let dataItem = this.tempList[Pindex]
			const { sale_man_id } = dataItem.sale_mans[Cindex];
			let datas = this.data;
			const findPindex = datas.findIndex(v => v.sale_org_id == dataItem.sale_org_id);
			if (findPindex > -1) {
				let findPartItem = datas[findPindex];
				const findCindex = findPartItem.sale_mans.findIndex(v => v.sale_man_id == sale_man_id);
				if (findCindex > -1) {
					this.onChildItem(findPindex, findCindex);
				}
			} else {
				dataItem.sale_mans[Cindex].select = false;
				let isAllSelect = true;
				let isSelectPar = false;
				dataItem.sale_mans.forEach(v => {
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
		&.check-list{
			position: sticky;top: 0;left: 0;right: 0;background-color: #EEEEEE;color:#fdc100;
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
