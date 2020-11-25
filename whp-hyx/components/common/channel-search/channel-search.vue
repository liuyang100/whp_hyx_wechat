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
				<view class="s-item" @click="goarchivesScreen">
					<view class="screenb">
						<text>分公司/人员</text>
						<text class="iconfont">&#xe605;</text>
					</view>
				</view>
			</template>
		</view>
		<view class="oppup" v-if="oppup">
			<view class="oppup-bg" @click="oppup = false"></view>
			<view class="oppuplis">
				<view class="oppuplis-left">
					<text v-for="(l, index) in cust" :class="index == oneci && 'child'" @click="custclick(1, index)" :key="l.id">{{ l.name }}</text>
				</view>
				<view class="oppuplis-left bg-clo">
					<text v-if="oneci != null" :class="index == twoci && 'child'" v-for="(l, index) in cust[oneci].list" :key="l.id" @click="custclick(2, index)">
						{{ l.name }}
					</text>
				</view>
			</view>
			<view class="oppuplbtn">
				<text class="oppuplcz" @click="oppuplcz">重置</text>
				<text class="oppuplqd" @click="oppuplqd">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'channel-search', // 渠道搜索
	props: {
		cust: {
			type: Array,
			default: () => []
		},
		qxControl: {
			type: Boolean,
			default: true
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

	.s-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		.iconfont {
			box-sizing: border-box;
			font-size: 50rpx;
			line-height: 1;
			vertical-align: middle;
			padding-top: 8rpx;
		}
	}
	.oppup {
		position: absolute;
		top: 110upx;
		left: 0;
		z-index: 199;
		width: 750upx;
		background-color: #fff;
		font-size: 28upx;
		.oppup-bg {
			width: 750upx;
			height: calc(100vh - 44px);
			background-color: rgba(0, 0, 0, 0.3);
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.oppuplbtn {
			width: 710upx;
			height: 70upx;
			display: flex;
			justify-content: space-around;
			padding: 20upx;
			background-color: #fff;
			text {
				width: 270upx;
				height: 70upx;
				line-height: 70upx;
				text-align: center;
				border-radius: 10upx;
			}
			.oppuplcz {
				background-color: #f0f0f0;
				color: #366699;
			}
			.oppuplqd {
				background-color: #fdc100;
				color: #ffffff;
			}
		}
		.oppuplis {
			border-bottom: 2upx solid #f3f4f5;
			display: flex;
			background-color: #fff;
			.oppuplis-left {
				flex: 1;
				text {
					display: block;
					width: 92%;
					height: 80upx;
					line-height: 80upx;
					border-bottom: 2upx solid #f3f4f5;
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
</style>
