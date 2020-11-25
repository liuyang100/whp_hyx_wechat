<template>
	<view class="search-model border-bottom border-light-secondary" @touchmove.stop.prevent="moveHandle">
		<view class="w-100 d-flex a-center ">
			<view class="d-flex" style="flex: 2;" @click="oppup = !oppup">
				<view class="s-item">
					<text>{{ cust[oneci].name ? cust[oneci].name : '大渠道' }}</text>
					<text class="iconfont">&#xe605;</text>
				</view>
				<view class="s-item">
					<text>{{ cust[oneci].list[twoci].name ? cust[oneci].list[twoci].name : '小渠道' }}</text>
					<text class="iconfont">&#xe605;</text>
				</view>
			</view>
			<template v-if="showBrandModule">
				<view class="s-item s-item-overflow">
					<view class="screenb" @click="goarchivesScreen">
						<view class="screenb-box" >
							<scroll-view scroll-x="true" style="width: 100%;">
								<view class="values" >{{!!valueName? valueName:'分公司/人员' }}</view>
							</scroll-view>
						</view>
						<text class="iconfont">&#xe605;</text>
					</view>
				</view>
			</template>
		</view>
		<view class="oppup" v-if="oppup">
			<cover-view class="oppup-bg" @click="oppup = false"></cover-view>
			<cover-view class="oppup-content">
				<cover-view class="oppuplis">
					<cover-view class="oppuplis-left">
						<cover-view class="item_style" v-for="(l, index) in cust" :class="index == oneci && 'child'" @click="custclick(1, index)" :key="l.id">
							{{ l.name }}
						</cover-view>
					</cover-view>
					<cover-view class="oppuplis-left bg-clo">
						<cover-view
							class="item_style"
							v-if="oneci !== null"
							:class="index == twoci && 'child'"
							v-for="(l, index) in cust[oneci].list"
							:key="l.id"
							@click="custclick(2, index)"
						>
							{{ l.name }}
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view class="oppuplbtn">
					<cover-view class="oppuplcz" @click="oppuplcz">重置</cover-view>
					<cover-view class="oppuplqd" @click="oppuplqd">确定</cover-view>
				</cover-view>
			</cover-view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'cover-channel-search', // 渠道搜索
	props: {
		cust: {
			type: Array,
			default: () => []
		},
		qxControl: {
			type: Boolean,
			default: true
		},
		valueName:{
			type: String,
			default: '分公司/人员'
		}
	},
	data() {
		return {
			oppup: false, //选择渠道类型选择
			oneci: null, //一级选项
			twoci: null, //二级选项
			datas: {
				// threeci: null //三级选项
				one_category_id: null, //大渠道id
				two_category_id: null //小渠道id
			},
			show_brandlist: ['HYXFGSJL', 'HYXZB', 'HYXPFQDZJ', 'HYXLSQDZJ']
		};
	},
	computed: {
		...mapState({
			role_code: state => state.user.role_code
		}),
		showBrandModule() {
			// 允许显示分公司角色类型
			if (this.qxControl) {
				return this.show_brandlist.includes(this.role_code);
			} else {
				return true;
			}
		}
	},
	methods: {
		moveHandle() {
			return false;
		},
		custclick(type, index) {
			//选择渠道类型
			if (type == 1) {
				//一级选项
				this.oneci = index;
				this.twoci = null;
				this.datas.two_category_id = null;
			} else if (type == 2) {
				//二级选项
				this.twoci = index;
			}
		},
		// 选择渠道搜索
		oppuplqd() {
			let custData = this.cust;
			let options = this.datas;
			if (this.oneci !== null) {
				options.one_category_id = custData[this.oneci].id;
			}
			if (this.oneci !== null && this.twoci !== null) {
				options.two_category_id = custData[this.oneci].list[this.twoci].id;
			}
			this.datas = options;
			this.oppup = false;
			this.$emit('search', options);
		},
		// 重置
		oppuplcz() {
			this.oneci = null; //一级选项
			this.twoci = null; //二级选项
			this.datas = {
				one_category_id: null, //大渠道id
				two_category_id: null //小渠道id
			};
			this.oppup = false;
			this.$emit('reset', {
				one_category_id: null,
				two_category_id: null
			});
		},
		goarchivesScreen() {
			if (!this.goarchivesScreen) {
				return false;
			}
			//选择终端主管
			var _this = this;
			this.$eventHub.$on('screenLis', function(data) {
				_this.$emit('selperson', data);
				//清除监听，不清除会消耗资源
				_this.$eventHub.$off('screenLis');
			});
			this.$myNavigateTo('/kpireport/dotScreen/screening-personnel');
		}
	}
};
</script>

<style lang="scss" scoped>
.search-model {
	width: 100%;
	height: 88rpx;
	background-color: #ffffff;
	display: flex;
	font-size: 28rpx;
	position: relative;
	.s-item-overflow{
		overflow: hidden;
	}
	.s-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		.screenb{
			width: 100%;
			display: flex;
			box-sizing: border-box;
			.screenb-box{
				flex: 1;
				display: flex;
				align-items: center;
				overflow: hidden; box-sizing: border-box;
				.values{
					white-space: nowrap;
					text-align: right;
				}
			}
		}
		.iconfont {
			flex-shrink: 0;
			box-sizing: border-box;
			font-size: 50rpx;
			line-height: 1;
			vertical-align: middle;
			padding-top: 8rpx;
		}

	
	}
	.oppup {
		position: absolute;
		top: 110rpx;
		left: 0;
		z-index: 199;
		width: 750rpx;
		background-color: #fff;
		font-size: 28rpx;
		.oppup-bg {
			width: 750rpx;
			height: calc(100vh - 44px);
			background-color: rgba(0, 0, 0, 0.3);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}
		.oppuplbtn {
			width: 710rpx;
			height: 70rpx;
			display: flex;
			justify-content: space-around;
			padding: 20rpx;
			background-color: #fff;
			.oppuplcz {
				background-color: #f0f0f0;
				color: #366699;
				width: 270rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 10rpx;
			}
			.oppuplqd {
				background-color: #fdc100;
				color: #ffffff;
				width: 270rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 10rpx;
			}
		}
		.oppup-content {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1;
			.oppuplis {
				border-bottom: 2rpx solid #f3f4f5;
				display: flex;
				background-color: #fff;
				.oppuplis-left {
					flex: 1;
					.item_style {
						display: block;
						width: 92%;
						height: 80rpx;
						line-height: 80rpx;
						border-bottom: 2rpx solid #f3f4f5;
						padding-left: 8%;
						color: #333;
					}

					.child {
						color: #fdc100;
					}
				}
				.bg-clo {
					background: #f9f9f9;
				}
				.bg-cll {
					background: #f5f5f5;
				}
			}
		}
	}
}
</style>
