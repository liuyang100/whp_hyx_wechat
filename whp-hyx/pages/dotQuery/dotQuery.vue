<template>
	<view class="container">
		<!-- 头部内容 -->
		<view class="header">
			<view class="search">
				<text  class="iconfont text">&#xe643;</text>
				<input class="input" type="search" placeholder="搜索关键词" v-model="keyword" @confirm="searchReset" />
			</view>
		</view>

		<!-- 中间列表 -->
		<view class="main">
			<view class="main-screena" @click="godotTime">
				<view class="main-screena-main">
					<text class="iconfont color-yellow">&#xe7be;</text>
					<text>选择日期</text>
				</view>
				<view class="main-screena-time">
					<text v-if="ktime && jtime">{{ ktime.year }}.{{ ktime.month }}.{{ ktime.day }}至{{ jtime.year }}.{{ jtime.month }}.{{ jtime.day }}</text>
					<text class="iconfont color-999">&#xe601;</text>
				</view>
			</view>
			<view class="main-screenb">
				<view class="color-yellow main-screenb-average" @click="godotScreen">
					<view>{{ stop_name_str || '多选'}}</view>
					<view class="iconfont">&#xe605;</view>
				</view>
				<view class="main-screenb-average" @click="onType">
					<text>拜访次数</text>
					<view class="nisicon">
						<text class="iconfont" :class="type===0?'color-yellow':''">&#xe604;</text>
						<text class="iconfont" :class="type===1?'color-yellow':''">&#xe605;</text>
					</view>
				</view>
			</view>

			<view class="main-lis">
				
				<view class="lis" v-for="d in data" :key="d">
					<view class="lis-min">
						<label>门店名称：</label>
						<text>{{ d.customer_name ? d.customer_name : '' }}</text>
					</view>
					<view class="lis-min">
						<label>门店等级：</label>
						<text>{{ d.store_level ? d.store_level : '' }}</text>
					</view>
					<view class="lis-min">
						<label>所属分公司：</label>
						<text>{{ d.sale_org_name ? d.sale_org_name : '' }}</text>
					</view>
					<view class="lis-min">
						<label>拜访次数：</label>
						<text>{{ d.visit_count }}</text>
					</view>
				</view>
				<template v-if="!!data.length">
					<l-scroll-loading :loadingType="loadingType" />
				</template>
			</view>
		</view>

		<!-- 时间选择 -->
		<time-range ref="select-time" @confirm="confirmTime" @cancel="cancelTime" />
	</view>
</template>

<script>
import timeRange from '@/components/time-range/time-range.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
export default {
	components: {
		timeRange,
		lScrollLoading
	},
	data() {
		return {
			cleaTime:null,
			islodMore:true,
			loadingType: 5,
			data: [],
			ktime: null, //开始时间
			jtime: null, //结束时间
			pagesize: 100,
			pagenumber: 1,
			type: null, // 1拜访次数降序  0拜访次数升序
			keyword: '',
			salesman_id: null,
			storeKeyName: 'DOTSALESMAN_LIST',
			stop_name_str:"",
			isLoading:false
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.clearBrandCatrty();
		this.__init();
	},
	onUnload() {
		this.clearBrandCatrty();
	},
	onReachBottom() {
		if (this.loadingType !== 5 && this.islodMore === false) return;
		this.loadingType = 0;
		// 防抖函数
		if (this.cleaTime) clearTimeout(this.cleaTime);
		this.cleaTime = setTimeout(this.upMoreFun, 500);
		
	},
	onPullDownRefresh() {
		if(this.isLoading) { return }
		this.isLoading =true;
		const cb = function(){
			uni.stopPullDownRefresh();
		}
		this.__init(cb);
		
	},
	computed: {
		isShowClearn() {
			return typeof this.keyword == 'string' && !!this.keyword.trim().length;
		}
	},
	methods: {
		async upMoreFun() {
			if(this.isLoading){return};
			this.isLoading = true;
			this.loadingType = 1;
			const lastPageNumber = this.pagenumber;
			this.pagenumber ++;
			try{
				const {datas,length} = await this.getList();
				if(length >= this.pagesize){
					this.islodMore = true;
				}else{
					this.islodMore = false;
				}
				this.data = this.data.concat(datas);
				uni.hideLoading()
			}catch(e){
				
				this.pagenumber = lastPageNumber
			}finally{
				this.isLoading  = false;
				this.loadingType = 5;
			}
		},
		async __init (cb =false){
			
			this.ktime= null; //开始时间
			this.jtime=null; //结束时间
			this.pagenumber= 1;
			this.type= null; // 1拜访次数降序  0拜访次数升序
			this.keyword= '';
			this.salesman_id= null;
			try{
				const {datas,length} = await this.getList();
				if(length >= this.pagesize){
					this.islodMore = true;
				}else{
					this.islodMore = false;
				}
				this.data = datas;
				uni.hideLoading()
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title:'加载失败',
					icon:'none'
				})
			}finally{
				this.isLoading  = false;
				if(cb && typeof cb =='function'){
					cb()
				}
			}
		},
		// 清除选择业务员或者终端主管
		clearBrandCatrty() {
			uni.removeStorage({
				key: this.storeKeyName,
				success: function(res) {
					console.log('success');
				}
			});
		},
		// 拜访次数排序
		async onType() {
			const types =this.type;
			if(types === null){
				this.type = 0;
			}else if(types === 0){
				this.type = 1;
			}else if(types === 1){
				this.type = 0;
			}else{
				this.types === null
			}
			if(this.isLoading) {
				return;
			}
			this.isLoading = true;
			this.pagenumber = 1;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try{
				const {datas,length} = await this.getList();
				if(length >= this.pagesize){
					this.islodMore = true;
				}else{
					this.islodMore = false;
				}
				this.data = datas;
				uni.hideLoading()
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title:'加载失败',
					icon:'none'
				})
			}finally{
				this.isLoading  = false;
			}
			
		},
		// 重置搜索
	 async	searchReset() {
			if(this.isLoading) {
				return;
			}
			this.isLoading = true;
			this.pagenumber = 1;
			this.type = null;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try{
				const {datas,length} = await this.getList();
				if(length >= this.pagesize){
					this.islodMore = true;
				}else{
					this.islodMore = false;
				}
				this.data = datas;
				uni.hideLoading()
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title:'加载失败',
					icon:'none'
				})
			}finally{
				this.isLoading  = false;
			}
			
		},
		// 选择分公司/人员信息
		godotScreen() {
			var _this = this;
			this.$eventHub.$on('screenLis', function(data) {
				const { store_id, valueName } = data;
				_this.stop_name_str= valueName;
				let salesman_id = null;
				if(store_id.length){
						salesman_id = store_id.join(',');
				}
				_this.salesman_id  = salesman_id;
				_this.searchReset();
				//清除监听，不清除会消耗资源
				_this.$eventHub.$off('screenLis');
			});
			this.$myNavigateTo('/pages/dotScreen/dotScreen', { isMoreSelect: true });
		},
		//选择完时间后
		confirmTime(e) {
			if (JSON.stringify(e) !== '{}') {
				this.ktime = e.start_time;
				this.jtime = e.end_time;
				this.searchReset();
			}
		},
		// 重置时间
		cancelTime() {
			this.ktime = null;
			this.jtime = null;
			this.searchReset();
		},
		//打开选择时间
		godotTime() {
			this.$refs['select-time'].open();
		},

		getList() {
			let params ={
				pagesize: 100,
				pagenumber: this.pagenumber
			}
			if(this.type !==null){
				params.type = this.type;
			}
			if(this.isShowClearn){
				params.keyword = this.keyword
			}
			if(this.salesman_id){
				params.salesman_id = this.salesman_id
			}
			if (this.ktime && this.jtime) {
				//开始时间
				params['begin_date'] = this.ktime.year + '-' + this.ktime.month + '-' + this.ktime.day;
				//结束时间
				params['end_date'] = this.jtime.year + '-' + this.jtime.month + '-' + this.jtime.day;
			}
			  return new Promise((resolve,reject) =>{
				  this.$myRequest({
				  	url: this.$myhttpUrl.visitCustomerList,
				  	data: params,
				  	success: res => {
						const result = {
							datas:res.datas,
							length : res.datas.length
						}
				  		resolve(result)
				  	},
				  	fail: err => {
				  		reject()
				  	}
				  });
			  })
			
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
		.text {
			width: 70rpx;
			text-align: center;
			color: #fdc100;
			font-size: 36rpx;
		}
		.input {
			width: 620rpx;
			height: 70rpx;
			line-height: 70rpx;
		}
	}
}

.main {
	width: 750rpx;
	.main-screena {
		width: 710rpx;
		height: 68rpx;
		line-height: 68rpx;
		padding: 20rpx;
		background-color: #fffbed;
		display: flex;
		justify-content: space-between;
		color: #050505;
		.main-screena-main {
			font-size: 30rpx;
			display: flex;
			.iconfont {
				margin-right: 20rpx;
			}
		}
		.main-screena-time {
			display: flex;
			font-size: 30rpx;
			color: #888;
		}
	}
	.main-screenb {
		width: 710rpx;
		height: 68rpx;
		line-height: 68rpx;
		padding: 20rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		color: #050505;
		.main-screenb-average{
			flex: 1;
			box-sizing: border-box;
			overflow-x: scroll;
			display: flex;
			justify-content: center;
			align-items: center;
			white-space: nowrap;
			.nisicon {
				display: block;
				width: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				line-height: 20rpx;
				.iconfont {
					line-height: 14rpx;
				}
			}
		}
		
	}

	.main-lis {
		width: 670rpx;
		margin: 20rpx 40rpx;
		.lis {
			width: 630rpx;
			min-height: 200rpx;
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
				label {
					flex-shrink: 0;
					width: 170rpx;
					color: #999999;
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
