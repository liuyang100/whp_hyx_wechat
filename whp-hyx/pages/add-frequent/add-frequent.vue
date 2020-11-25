<template>
	<view class="container">
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
					<text class="iconfont mx-2 mian-colot100" style="font-size: 40rpx;">&#xe643;</text>
				</ly-search-bar>
			</view>
		</view>
		<template v-if="listLength">
			<view class="list-content">
				<!-- 常用联系人 -->
				<template v-if="isEmpty">
					<view class=" d-flex  j-center a-center" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0; background-color: #EEEEEE; flex-direction: column;">
						<text>没有查到任何数据哦~。</text>
						<button type="default" size="mini" @tap="isEmpty = false">再搜索看看</button>
					</view>
				</template>
				<template v-else>
					<view class="lis">
						<block v-for="(item, index) in customerList" :key="index">
							<label class="label" @tap.stop="changeItem(index)">
								<checkbox :checked="item.select" color="#FFCC33" style="transform:scale(0.7)" />
								<text>{{ item.name }}</text>
							</label>
						</block>
					</view>
					<view class="successBtn " @click="chechedUserid">完成</view>
				</template>
			</view>
		</template>
	</view>
</template>

<script>
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import {deepClone} from '@/ulits/Validation.js'
export default {
	components: {
		lySearchBar
	},
	data() {
		return {
			isEmpty: false,
			listLength: 0,
			isLoading: false,
			tempList: [],
			pagesize: 50,
			pagenumber: 1,
			keyword: '',
			is_common: 0, // 是否常联系 0 否 1是
			slectListId: [],
			initData:[]
		};
	},

	onLoad(option) {
		try {
			let { slectListId = [] } = this.$formateOption(option);
			this.slectListId = slectListId;
		} catch (e) {
			console.log('参数格式错误');
			//TODO handle the exception
		} finally {
			this.__init();
		}
	},
	onReachBottom() {
		if (this.isLoading) {
			return;
		}
		this.isLoading = true;

		if (this.tempList.length > this.pagenumber * this.pagesize) {
			this.pagenumber++;
		}
		this.isLoading = false;
	},
	computed: {
		customerList() {
			if (Array.isArray(this.tempList)) {
				if (this.tempList.length > 0) {
					return this.tempList.slice(0, this.pagenumber * this.pagesize);
				} else {
					return [];
				}
			}
		}
	},
	methods: {
		// 格式数据列表
		formateCustomerList(arr) {
			const SelectListId = this.slectListId;
			for (let item of arr) {
				if (SelectListId.includes(item.id)) {
					item['select'] = true;
				} else {
					item['select'] = false;
				}
			}
			return arr;
		},
		
		formateSeachCustomerList(arr){
			const SelectListId = this.initData.filter(v =>v.select).map(v=>v.id);
			for (let item of arr) {
				if (SelectListId.includes(item.id)) {
					item['select'] = true;
				} else {
					item['select'] = false;
				}
			}
			return arr;
		},
		async __init() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				const { datas, length } = await this.getDataList();

				uni.hideLoading();
				this.listLength = length;
				const formateDatas =this.formateCustomerList(datas);
				this.tempList = deepClone(formateDatas);
				this.initData = deepClone(formateDatas);
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: e.message,
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		/* 取消搜索 */

		cancel(obj) {
			this.confirm({ value: '' });
		},
		/* 点击搜索完成按钮触发 */

		async confirm(obj) {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			const { value = '' } = obj || {};
			this.keyword = value;
			this.pagenumber = 1;
			uni.showLoading({
				title: '查询中...',
				mask: true
			});
			try {
				const { datas, length } = await this.getDataList();
				uni.hideLoading();
				if (!length) {
					this.isEmpty = true;
					return;
				} else {
					this.isEmpty = false;
				}
				this.listLength = length;
				this.tempList = this.formateSeachCustomerList(datas);
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: '搜索失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		// 选中
		changeItem(index) {
			console.log(index);
			let item = this.tempList[index];
			const tempSelect = !item.select;
			item.select = tempSelect
			this.tempList.splice(index,1,item);
			const findIndex = this.initData.findIndex(v => v.id == item.id);
			console.log(findIndex);
			if(findIndex> -1){
				const {select} = this.initData[findIndex];
				console.log("select",select)
				this.initData[findIndex].select = !select;
			}
		},

		// 获取数据
		getDataList() {
			let params = {
				is_common: this.is_common
			};
			let keyword = this.keyword;
			keyword = (typeof keyword == 'string' && keyword.trim()) || '';
			params.keyword = keyword;
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.searchList,
					data: params,
					success: res => {
						const tempData = res.data;
						resolve({ datas: tempData, length: tempData.length });
					},
					fail: err => {
						reject({ message: '加载失败' });
					}
				});
			});
		},
		/* 添加为常用联系人 */
		addCommon(params) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.addCommon,
					data: params,
					success(res) {
						resolve();
					},
					fail(err) {
						reject();
					}
				});
			});
		},

		// 点击选中客户名称
		async chechedUserid() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			let checkList=[];
			try{
				const slectListId = this.slectListId;
				checkList = this.initData.filter(v => v.select);
				let addList = [];
				let addListId ="";
				for (let item of checkList) {
					if (!slectListId.includes(item.id)) {
						addList.push(item.id);
					}
				}
				if(addList.length>0){
					addListId = addList.join(",")
					 await this.addCommon({ ids: addListId })
				}
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title: '添加常用联系人失败',
					icon: 'none'
				});
			}finally{
				this.$eventHub.$emit('chechedUserid', { checkList: checkList });
				this.isLoading = false;
				uni.navigateBack({
					delta: 2
				});	
			}
			
			
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
}
.container {
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
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
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	.lis {
		padding: 20rpx 0;
		.label {
			border-bottom: 1rpx solid #eeeeee;
			display: flex;
			align-items: center;
			padding: 20rpx 0;
		}
	}
	.successBtn {
		margin-top: auto;
		position: sticky;
		bottom: 0;
		right: 0;
		left: 0;
		height: 80rpx;
		background-color: #fdc100;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.uni-form-item {
	display: flex;
	width: 100%;
	// height: 100rpx;
	align-items: center;
	border-bottom: 1rpx solid #eeeeee;
	padding: 10rpx 30rpx;
	box-sizing: border-box;
}
/* 后加的 */
.uni-form-item .title {
	font-size: 28rpx;
	padding: 0;
	color: #666666;
}
</style>
