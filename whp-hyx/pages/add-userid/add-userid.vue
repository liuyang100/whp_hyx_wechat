<template>
	<view class="container w-100">
		<view class="list-content">
			<view class="uni-form-item uni-flex j-sb bg-white" @click="changCommon">
				<view class="title">添加其他成员</view>
				<view class="iconfont" style="color: #000066;font-size: 40rpx;vertical-align: middle;">&#xe770;</view>
			</view>

			<view class="uni-form-item uni-flex j-sb bg-white mt-2"><view class="title">常用联系人</view></view>
			<view class="lis bg-white">
				<label v-for="(its, ini) in customerList" :key="its.id" @tap="changeItem(ini)">
					<checkbox  :checked="its.select" color="#FFCC33" style="transform:scale(0.7)" />
					<text>{{ its.name }}</text>
				</label>
				<l-scroll-loading :loadingType="loadingType" />
			</view>

			<view style="width: 100%;height: 80rpx;"></view>
			<view class="successBtn main-bg-color text-white d-flex a-center j-center" @click="chechedUserid">确定</view>
		</view>
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
			customerList: [], // 获取常用的
			isLoadMore: false,
			pagesize: 10,
			pagenumber: 1,
			is_common: 1, // 是否常联系 0 否 1是
			loadingType: 5,
			
			menberName: [],
			checkList: [],
			slectListId:[]
		};
	},

	async onLoad(option) {
		try {
			let {slectListId =[]} = this.$formateOption(option);
			this.slectListId = slectListId
			const data = await this.getCustomerList({
				is_common: this.is_common,
				pagenumber: this.pagenumber,
				pagesize: this.pagesize
			});
			this.customerList = this.formateCustomerList(data);
		} catch (e) {
			//TODO handle the exception
			console.log(e);
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			});
		}
	},


	methods: {
		// 格式数据列表
		formateCustomerList(arr){
			const SelectListId = this.slectListId;
			for(let item of arr){
				if(SelectListId.includes(item.id)){
					item['select']=true;
				}else{
					item['select']=false;
				}
			}
			return arr;
		},
		// 添加其他成员
		changCommon() {
			let _this = this;
			const checkList = this.customerList.filter(v => v.select).map(v => v.id);
			this.$eventHub.$on('other', res => {
				console.log('返回监听函数', res);
				_this.$eventHub.$off('other');
			});
			this.$myNavigateTo('/pages/add-frequent/add-frequent',{slectListId:checkList});
		},
		// 选中 | 取消选中
		changeItem(index) {
			this.customerList[index].select = !this.customerList[index].select;
		},
		
		getCustomerList(params, isDownLoading = false) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.searchList,
					data: params,
					success: res => {
						if (isDownLoading) {
							uni.stopPullDownRefresh();
						}
						resolve(res.data);
					},
					fail: err => {
						reject({ message: '加载失败' });
					}
				});
			});
		},

		// 点击确定返回，并带出选中的项
		chechedUserid() {
			const checkList = this.customerList.filter(v => v.select);
			this.$eventHub.$emit('chechedUserid', { checkList: checkList });
			uni.navigateBack({});
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.container {
	width: 100%;
	min-height: 100%;
	background-color: #f5f5f5;
}
.header {
	width: 750upx;
	height: 120upx;
	background-color: #fdc100;
	overflow: hidden;

	.search {
		width: 690upx;
		height: 70upx;
		margin: 35upx;
		border-radius: 35upx;
		background-color: #fff;
		display: flex;
		text {
			width: 70upx;
			text-align: center;
			color: #fdc100;
			font-size: 36upx;
		}
		input {
			width: 620upx;
			height: 70upx;
			line-height: 70upx;
		}
	}
}
.list-content {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx 0;
	.lis {
		padding-left: 20rpx;
		label {
			border-bottom: 1rpx solid #eeeeee;
			display: flex;
			align-items: center;
			padding: 20rpx 0;
		}
	}
}
.successBtn {
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	height: 80rpx;
}
</style>
