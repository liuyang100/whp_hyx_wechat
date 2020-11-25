<template>
	<view>
		<view class=" table-head">
			<view class="table-head-item" :style="{ flex: item.flex, 'text-align': item.textAlign }" v-for="(item, index) in tableHader" :key="item.domkey">
				<view class="d-flex flex-column">
					<text class="title-style">{{ item.title }}</text>
					<text class="symbol-style">{{ item.symbol }}</text>
				</view>
				<view class="d-inline-block" v-if="item.order" @tap="doSort(item, index)">
					<view class="iconfont sort_arrow" :style="{ color: item.orderType == 1 ? '#FDC100' : '#000' }">&#xe600;</view>
					<view class="iconfont sort_arrow" :style="{ color: item.orderType == 2 ? '#FDC100' : '#000' }">&#xe603;</view>
				</view>
			</view>
		</view>
		<view class="d-flex table-row" v-for="(litem, lindex) in list" :key="litem.id">
			<view :style="{ flex: item.flex, 'text-align': item.textAlign }" v-for="(item, index) in tableHader" :key="item.domkey">
				{{ item.isPoint ? getPoint(litem[item.nameKey]) : litem[item.nameKey] }}
			</view>
		</view>
		<l-scroll-loading :loadingType="upLoadType" />
	</view>
</template>

<script>
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
export default {
	components: {
		'l-scroll-loading': lScrollLoading
	},
	data() {
		return {
			tableHader: [],
			list: [],
			tabIndex: 0,
			isDownLoading: false,
			upLoadType: 5,
			url: '',
			brand_id: null,
			pc_id: null,
			one_category_id: null,
			two_category_id: null,
			salesman_ids: '',
			type: null,
			order_type: 0,
			order_direct: 0,
			is_existed: null,
			pagenumber: 1,
			pagesize: 100,
			is_lock: false
		};
	},

	onLoad(option) {
		try {
			option && (option = this.$formateOption(option));
			const { navtitleText, type, url, one_category_id, two_category_id, salesman_ids, is_existed=null, brand_id, pc_id } = option.item;
			
			this.setTitle(navtitleText);
			this.url = url;
			this.type = type;
			this.two_category_id = two_category_id;
			this.one_category_id = one_category_id;
			this.salesman_ids = salesman_ids;
			this.is_existed = is_existed;
			this.brand_id = brand_id || null;
			this.pc_id = pc_id || null;
			this.__init();
		} catch (e) {
			//TODO handle the exception
			console.log('错误', e.message);
			uni.showToast({
				title: e.message,
				icon: 'none'
			});
		}
	},
	onReachBottom() {
		if (this.upLoadType !== 5 || this.is_lock) {
			return false;
		}
		this.is_lock = true;
		this.isDownLoading = true;
		this.upLoadType = 1;
		this.pagenumber += 1;
		this.getDetailData(this.reqParams)
			.then(res => {
				this.list = [...this.list, ...res];
				this.is_lock = false;
				this.isDownLoading = false;
				this.upLoadType = 5;
			})
			.catch(err => {
				this.pagenumber -= 1;
				this.is_lock = false;
				this.isDownLoading = false;
				this.upLoadType = 5;
				uni.showToast({
					title: '上拉加载失败',
					icon: 'none'
				});
			});
	},
	computed: {
		reqParams() {
			let temp = {
				url: '',
				param: {}
			};
			if (this.url) {
				temp.url = this.url;
			}
			if (this.two_category_id) {
				temp.param.two_category_id = this.two_category_id;
			}
			if (this.one_category_id) {
				temp.param.one_category_id = this.one_category_id;
			}
			if (this.salesman_ids) {
				temp.param.salesman_ids = this.salesman_ids;
			}
			if (this.salesman_ids) {
				temp.param.is_existed = this.is_existed;
			}
			if (this.type) {
				temp.param.type = this.type;
			}
			if(this.order_type){
				temp.param.order_type = this.order_type;
			}
			if(this.order_direct){
				temp.param.order_direct = this.order_direct;
			}
			if(this.is_existed !== null){
				temp.param.is_existed = this.is_existed;
			}	
			if (this.brand_id) {
				temp.param.brand_id = this.brand_id;
			}
			if (this.pc_id) {
				temp.param.pc_id = this.pc_id;
			}
			temp.param.pagenumber = this.pagenumber;
			temp.param.pagesize = this.pagesize;
			return temp;
		}
	},
	methods: {
		getPoint(num) {
			num = (parseFloat(num)/10000).toFixed(2);
			num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			return num;
		},
		async __init() {
			if (this.is_lock) return;
			this.is_lock = true;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				console.log(this.reqParams);
				let res = await this.getDetailData(this.reqParams);
				this.initRenderTable(res);
				uni.hideLoading();
			} catch (e) {
				//TODO handle the exception
				console.log('错误', e);
				uni.showToast({
					title: e.message || '加载失败',
					icon: 'none'
				});
			} finally {
				this.is_lock = false;
			}
		},
		initRenderTable(arr) {
			this.tableHader = [
				{
					type: 0,
					title: '名称',
					nameKey: 'name',
					textAlign: 'left',
					flex: 4,
					domkey: 'h_0',
					symbol: '',
					isPoint: false
				},
				{
					type: 1,
					order: true,
					orderType: 0,
					title: this.type == 1 ? '年任务' : this.type == 2 ? '月任务' : '',
					nameKey: 'renwu_amount',
					textAlign: 'center',
					flex: 2,
					domkey: 'h_1',
					symbol: '（万元）',
					isPoint: true
				},
				{
					type: 2,
					order: true,
					orderType: 0,
					title: '已完成',
					nameKey: 'amount',
					textAlign: 'center',
					flex: 2,
					domkey: 'h_3',
					symbol: '（万元）',
					isPoint: true
				},
				{
					type: 3,
					order: true,
					orderType: 0,
					title: '完成率',
					nameKey: 'ratio',
					textAlign: 'center',
					flex: 2,
					domkey: 'h_4',
					symbol: '（%）',
					isPoint: false
				}
			];
			this.list = arr;
		},
		// 排序
		doSort(item, index) {
			if (index === 0) {
				return false;
			}
			// let param = this.reqParams;
			let currentItem = this.tableHader[this.tabIndex];
			if (this.tabIndex == index) {
				if (currentItem.orderType == 1) {
					this.tableHader[this.tabIndex].orderType = 2;
				} else if (currentItem.orderType == 2) {
					this.tableHader[this.tabIndex].orderType = 1;
				}
			} else {
				this.tabIndex = index;
				this.tableHader.forEach(v => {
					if (v.order) {
						v.orderType = 0;
					}
				});
				this.tableHader[this.tabIndex].orderType = 1;
			}
			switch (index) {
				case 1:
					this.order_type = 1;
					break;
				case 2:
					this.order_type = 2;
					break;
				case 3:
					this.order_type = 3;
					break;
				default:
					break;
			}
			this.order_direct = this.tableHader[this.tabIndex].orderType;
			
			if (this.is_lock) return;
			this.is_lock = true;
			this.pagenumber = 1;
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			
			this.getDetailData(this.reqParams)
				.then(res => {
					this.list = res;
					uni.hideLoading();
					this.is_lock = false;
				})
				.catch(err => {
					this.is_lock = false;
					uni.showToast({
						title: '加载失败!',
						icon: 'none'
					});
				});
		},

		setTitle(title) {
			if (!title) {
				throw new Error('设置页面标题错误');
			}
			uni.setNavigationBarTitle({
				title: title || ''
			});
		},
		// 初始化|| 获取数据
		getDetailData(option) {
			if (!option.url) {
				throw new Error('请求路径错误');
			}
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: option.url,
					data: option.param,
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						reject(err);
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
	background-color: #f5f5f5;
}
.table-head {
	position: sticky;
	top: 0;
	background: #ffffff;
	height: 100rpx;
	padding: 0 8px 0 20rpx;
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #eeeeee;
	.table-head-item {
		display: flex;
		align-items: center;
		.title-style {
			font-size: 28rpx;
			font-weight: bold;
		}
		.symbol-style {
			font-size: 24rpx;
		}
	}
}
.table-row {
	background-color: #ffffff;
	display: flex;
	min-height: 42rpx;
	padding: 20rpx 8rpx 20rpx 20rpx;
	line-height: 1.4;
	font-size: 28rpx;
}
.d-inline-block {
	display: inline-block;
	vertical-align: middle;
}
.sort_arrow {
	font-size: 30rpx;
	font-weight: bold;
	line-height: 0.7;
}
</style>
