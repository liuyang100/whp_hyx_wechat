<template>
	<view class="container">
		<!-- 头部内容 -->
		<view class="header">
			<view class="search">
				<icon class="search-icon" type="search" size="18" />
				<input class="search-input" type="text" v-model="keyword" placeholder="搜索关键词" @confirm="search" />
				<icon v-show="keyword.trim() != ''" @click="keyword=''" class="search-icon" type="clear" size="18" />
			</view>
			<view class="quxioa" v-show="keyword.trim() != ''" @click="cancel">取消</view>
		</view>
		<!-- 中间列表 -->
		<view class="main">
			<view class="list-row">
				<block v-for="(item, index) in data" :key="index">
					<view class="label hover-label" @tap="onExendAndReq(index)">
						<view style="display: flex; align-items: center;">
							<text class="iconfont parent-color">&#xe7b9;</text>
							<text class="name" :style="{ color: item.check ? '#fdc100' : '#444444' }">{{ item.sale_org_name }}</text>
						</view>
						<view class="sanjiao" :class="item.check ? 'rote' : ''"></view>
					</view>
					<template v-if="item.list.length > 0">
						<view v-show="item.check">
							<label class="label sub" v-for="(citem, cindex) in item.list" :key="cindex" @click="subClick(index, cindex)">
								<view style="display: flex; align-items: center;">
									<text class="iconfont green-color">&#xe7b9;</text>
									<text class="name">{{ citem.salesman_name }}</text>
								</view>
								<checkbox
									class="checkbox"
									:checked="citem.check"
									:value="JSON.stringify({ ...citem, sale_org_name: item.sale_org_name, sale_org_id: item.sale_org_id })"
								/>
							</label>
						</view>
					</template>
				</block>
			</view>
		</view>
		<view class="footer"><button class="submit-btn" @click="submit">确定</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			data: [],
			keyword: '',
			ppagesize: 999,
			ppagenumber: 1,
			spagesize: 999,
			spagenumber: 1,
			clearTime: null,
			arr_s: new Map(),
			lastUpMoreStatus: true,
			isInitLoading: true
		};
	},
	onLoad(option) {
		option && (option = this.$formateOption(option));
		console.log(option, 1111);
		// 数据缓存处理
		if (option && option.worker && option.worker.length > 0) {
			option.worker.forEach(v => {
				this.arr_s.set(`${v.sale_org_id}${v.salesman_id}`, v);
			});
		}
		if (option && option.listdata && option.listdata.length > 0) {
			this.data = option.listdata;
			return;
		}
		// 如果之前没有加载过,则初始化
		uni.showLoading({
			title: '加载中...'
		});
		this.__init();
	},

	// 下拉刷新
	async onPullDownRefresh() {
		this.isInitLoading = true;
		this.ppagenumber = 1;
		this.spagenumber = 1;
		this.__init();
		uni.stopPullDownRefresh();
	},

	// 触底事件
	onReachBottom() {
		if (this.isprentClose) {
			// 公司列表刷新
			if (this.clearTime) {
				clearTimeout(this.clearTime);
			}
			this.isInitLoading = false;
			this.clearTime = setTimeout(async () => {
				if (this.lastUpMoreStatus) {
					this.ppagenumber++;
				}
				let param = {
					pagesize: this.ppagesize,
					pagenumber: this.ppagenumber
				};
				this.getCompanyList(param)
					.then(res => {
						if (this.isInitLoading) {
							this.data = res;
						} else {
							this.data = [...this.data, ...res];
						}
						this.lastUpMoreStatus = true;
						uni.hideLoading();
					})
					.catch(err => {
						this.lastUpMoreStatus = false;
						uni.hideLoading();
						uni.showToast({
							title: '加载失败,重新加载试试哦!',
							icon: 'none',
							duration: 1500
						});
					});
			}, 800);
		} else {
			// 公司下的员工列表刷新
			return true;
		}
	},
	computed: {
		isprentClose() {
			return this.data.every(v => v.check == false);
		}
	},

	methods: {
		/* 初始化数据 */
		__init() {
			let param = {
				pagesize: this.ppagesize,
				pagenumber: this.ppagenumber
			};
			this.getCompanyList(param)
				.then(res => {
					if (this.isInitLoading) {
						this.data = res;
					} else {
						this.data = [...this.data, ...res];
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '获取分工司列表失败',
						icon: 'none'
					});
				});
		},

		/* 选择员工触发的事件源 */
		subClick(index, cindex) {
			if (this.data[index] && this.data[index].list && this.data[index].list[cindex]) {
				this.data[index].list[cindex].check = !this.data[index].list[cindex].check;
				let partId = this.data[index].sale_org_id;
				let subId = this.data[index].list[cindex].salesman_id;
				if (this.data[index].list[cindex].check) {
					let selectObj = {
						sale_org_id: partId,
						sale_org_name: this.data[index].sale_org_name,
						salesman_id: subId,
						salesman_name: this.data[index].list[cindex].salesman_name
					};
					this.arr_s.set(`${partId}${subId}`, selectObj);
				} else {
					this.arr_s.delete(`${partId}${subId}`);
				}
			}
		},

		/* 选择分工司动态获取分公司下的员工 */
		onExendAndReq(index) {
			// 节流
			if (this.clearTime) {
				clearTimeout(this.clearTime);
			}
			if (this.data[index].isReq) {
				this.data[index].check = !this.data[index].check;
				return;
			}
			this.clearTime = setTimeout(async () => {
				if (this.data[index].isReq) return;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 60000);
				try {
					let option = {
						itemids: `${this.data[index].sale_org_id}`,
						pagesize: this.spagesize,
						pagenumber: this.spagenumber,
						keyword: this.keyword
					};
					let resultData = await this.getMenber(option);
					if (Array.isArray(resultData)) {
						this.data[index].list = resultData;
						this.data[index].isReq = true;
						this.data[index].check = !this.data[index].check;
						uni.hideLoading();
					} else {
						this.data[index].isReq = false;

						throw new error('数据格式不规范');
					}
				} catch (err) {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			}, 800);
		},

		/* 关键字搜索 */
		async search() {
			this.isInitLoading = true;
			this.pagenumber = 1;
			let param = {
				pagesize: this.ppagesize,
				pagenumber: this.ppagenumber
			};
			let companyList = await this.getCompanyList(param);
			for (let i = 0; i < companyList.length; i++) {
				let option = {
					itemids: companyList[i].sale_org_id,
					pagesize: this.spagesize,
					pagenumber: this.spagenumber,
					keyword: this.keyword
				};
				let resultData = await this.getMenber(option);
				companyList[i].list = resultData;
				companyList[i].isReq = true;
				companyList[i].check = false;
			}
			this.data = companyList;
		},
		cancel(){
			this.keyword="";
			this.search()
		},
		/* 获取公司列表数据 */
		getCompanyList(param) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.memberSaleOrgList,
					data: param,
					success: res => {
						let resdata = this.orgCompanyData(res.data);
						resolve(resdata);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},
		/**
		 * 获取人分公司人员
		 * */
		getMenber(param) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.salemanList,
					data: param,
					success: res => {
						let list = res.data;
						let resultData = this.orgWorkerData(list);
						resolve(resultData);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},
		/* 组织公司的数据模板 */
		orgCompanyData(arr) {
			let newarr = arr.map(v => {
				return {
					...v,
					check: false,
					isReq: false,
					list: []
				};
			});
			return newarr;
		},

		/* 组织公司下员工的数据模板 */
		orgWorkerData(list) {
			return list.map(v => {
				return {
					...v,
					check: false
				};
			});
		},

		/* 确定提交 */
		submit() {
			let result = [];
			let listarr = this.arr_s;
			for (const [key, value] of listarr) {
				result.push(value);
			}
			this.$eventHub.$emit('screenLis', { worker: result, listdata: this.data });
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.container {
	padding-bottom: 140rpx;
}
.header {
	width: 750rpx;
	height: 120rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	background-color: #fdc100;
	display: flex;
	align-items: center;
	.search {
		flex: 1;
		height: 70rpx;
		border-radius: 35rpx;
		background-color: #fefefe;
		display: flex;
		align-items: center;
		.search-icon {
			padding: 0 16rpx 0 16rpx;
		}
		.search-input {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
		}
	}
	.quxioa {
		white-space: nowrap;
		flex-shrink: 0;
		padding-left: 10rpx;
		color: #666666;
		font-size: 30rpx;
	}
}

.list-row {
	.label {
		background-color: #fefefe;
		width: 100%;
		height: 94rpx;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&.sub {
			background-color: #ecf0f1;
		}
	}
	.hover-label:active {
		background-color: #f2f2f2;
	}

	.sanjiao {
		width: 0;
		height: 0;
		border-top: 14rpx solid transparent;
		border-left: 16rpx solid #dddddd;
		border-bottom: 14rpx solid transparent;
		transform: rotate(0deg);
		transition: 0.2s linear;
	}
	.sanjiao.rote {
		transform: rotate(90deg);
		transition: 0.2s linear;
	}
	.name {
		font-size: 30rpx;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx;
	.submit-btn {
		width: 100%;
		height: 88rpx;
		font-size: 36rpx;
		color: #ffffff;
		text-align: center;
		line-height: 88rpx;
		background-color: #fdc100;
		&:active {
			opacity: 0.8;
		}
	}
}

.iconfont {
	display: inline-block;
	vertical-align: middle;
}
.parent-color {
	color: #fdc100;
	font-size: 44rpx;
	padding: 0 20rpx;
}
.green-color {
	color: #42dc61;
	font-size: 44rpx;
	padding: 0 20rpx;
}

/* #ifdef APP-PLUS || MP-WEIXIN */
.checkbox .wx-checkbox-input {
	border-radius: 50%;
	width: 36rpx;
	height: 36rpx;
}
.checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	color: #ffffff !important;
	background-color: #fdc100;
	border: 1rpx solid #fdc100;
}
/* #endif */
</style>
