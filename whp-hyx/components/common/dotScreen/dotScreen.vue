<template>
	<view>
		<view class="main-lis">
			<view class="lis-title" @click="getChild">
				<view>
					<text class="iconfont color-ddd">&#xe71a;</text>
					<text class="iconfont color-r1">&#xe7b9;</text>
					<text class="text">{{ data.sale_org_name }}</text>
				</view>
				<view @click.stop="onchildall">
					<text class="iconfont color-g2" v-if="data.selection">&#xe61f;</text>
					<text class="iconfont color-g1" v-if="!data.selection">&#xe634;</text>
				</view>
			</view>
			<view class="lis-child" v-if="data.salesman_list && childShow">
				<view class="lis-child-title" @click="onchild(c, index)" v-for="(c, index) in data.salesman_list" :key="c.salesman_id">
					<view>
						<text class="iconfont color-r2">&#xe7b9;</text>
						<text class="text">{{ c.salesman_name }}</text>
					</view>
					<view>
						<text class="iconfont color-g2" v-if="c.selection">&#xe61f;</text>
						<text class="iconfont color-g1" v-if="!c.selection">&#xe634;</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: ['screen', 'indexs', 'pageTypes', 'keswords'],
	data() {
		return {
			data:{},
			childShow: false,
			getchildus: false, //是否已经获取了人员
			pageType: this.pageTypes // 0 拜访，1 建党
		};
	},
	computed: {
		kesword() {
			//搜索
			this.childShow = this.getchildus = false;
			return this.keswords;
		}
	},
	watch: {
		screen: {
			handler: function(val, oldVal) {
				this.data = val;
			},
			deep: true,
			immediate:true
		}
	},
	
	methods: {
		getChild() {
			//获取人员
			console.log(this.data);
			
			if (this.getchildus) {
				this.childShow = !this.childShow;
				return;
			}
			uni.showLoading();
			let url = this.$myhttpUrl.salemanList;
			if (this.pageType == 1) {
				url = this.$myhttpUrl.supervisorList;
			}
			this.$myRequest({
				url: url,
				data: {
					itemids: this.data.sale_org_id,
					pagesize: 99999,
					pagenumber: 1,
					keyword: this.kesword ? this.kesword : ''
				},
				success: res => {
					uni.hideLoading();
					this.getchildus = true; //获取过就不需要再次获取了
					let data = res.data;
					console.log('获取分公司下员工返回数据', data);
					for (let i in data) {
						if (this.pageType == 1) {
							//终端主管
							data[i]['salesman_id'] = data[i].supervisor_id;
							data[i]['salesman_name'] = data[i].supervisor_name;
						}
						data[i]['selection'] = false;
						this.data.salesman_list.push(data[i]);
					}
					this.childShow = !this.childShow;
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},
		onchild(child, index) {
			this.data.salesman_list[index].selection = !this.data.salesman_list[index].selection;
			this.$emit('onscreen', this.data.salesman_list[index]);
			// this.dataLis();
		},
		onchildall() {
			if (!this.getchildus) {
				this.getChild();
				return;
			}
			if (this.pageType == 1) {
				//建党 没有全选
				return;
			}
			let type = true;
			if (this.data.selection) {
				// true 改为 false 全不选
				this.data.selection = false;
				type = false;
			} else {
				//全选
				this.data.selection = true;
			}
			for (let i in this.data.salesman_list) {
				this.data.salesman_list[i].selection = type;
				this.$emit('onscreen', this.data.salesman_list[i]);
			}
		},
		dataLis() {
			for (let i in this.data.salesman_list) {
				if (this.data.salesman_list[i].selection) {
					this.data.selection = true;
					return;
				}
			}
			this.data.selection = false;
		}
	}
};
</script>

<style lang="scss">
.main-lis {
	.lis-title {
		width: 710upx;
		height: 74upx;
		line-height: 74upx;
		padding: 20upx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		border-bottom: 2upx solid #f0f0f0;
		.color-ddd {
			font-size: 28upx;
			margin-right: 20upx;
		}
		.color-r1 {
			margin-right: 20upx;
		}
	}
	.lis-child {
		.lis-child-title {
			width: 670upx;
			height: 74upx;
			padding: 20upx;
			padding-left: 60upx;
			display: flex;
			justify-content: space-between;
			font-size: 32upx;
			border-bottom: 2upx solid #f0f0f0;
			.color-r2 {
				margin-right: 20upx;
			}
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
</style>
