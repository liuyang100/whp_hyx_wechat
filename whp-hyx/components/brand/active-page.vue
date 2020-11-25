<template>
	<view class="currt-page">
		<view class="ly-Header-dis">
			<slot name="keHuInfo"></slot>
			<view class="branch-module">
				<view class="branch_search" id="channel-model">
					<view class="search_select" @click="openSelect">
						<text>{{ qudaoName }}</text>
						<view class="iconfont">&#xe605;</view>
					</view>
					<view class="search">
						<view class="search-inp">
							<text class="search-icon iconfont">&#xe643;</text>
							<input
								class="input-kesword"
								type="search"
								placeholder="请输入关键字"
								:value="keyword"
								@input="$emit('inputChang', $event.detail.value)"
								@confirm="searchGo"
							/>
							<text class="tip-cancel" v-if="isShowClearn" @click="cancel">取消</text>
						</view>
					</view>
				</view>
				<channel-popup
					ref="channel-popup"
					:newCust="channelData"
					:maskHeight="maskHeight"
					:top="upx2px(110)"
					@qdreset="QuDaoModelReset"
					@qdsearch="QuDaoModelSearch"
					@rqmask="handMask"
				/>
			</view>
			<slot name="adressModal"></slot>
		</view>
		<view class="scroll-conent">
			<scroll-view
				scroll-y="true"
				id="scroll-view"
				class="scroll_views"
				:enable-flex="true"
				:refresher-threshold="45"
				:refresher-triggered="triggerRefreStatus"
				:refresher-enabled="true"
				refresher-default-style="none"
				@refresherpulling="refresherpulling"
				@refresherrefresh="refresherrefresh"
				@refresherrestore="refresherrestore"
				@refresherabort="refresherabort"
				@scrolltolower="upMore"
			>
				<view class="scroll-reload"><l-scroll-reload ref="l-scroll-reload" :reloadStatus="reloadStatus" /></view>
				<template v-if="isEmpty">
					<view class=" d-flex  j-center a-center" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0; background-color: #EEEEEE; flex-direction: column;">
						<text>没有查到任何数据哦~。</text>
						<button type="default" size="mini" @tap="$emit('resetIsEmpty', { value: !isEmpty })">再搜索看看</button>
					</view>
				</template>
				<slot name="default"></slot>
				<l-scroll-loading :loadingType="loadingType" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import lScrollReload from '@/components/ScrollViewReload/ScrollViewReload.vue';
import lScrollLoading from '@/components/lScrollLoading/lScrollLoading.vue';
import channelPopup from '@/components/brand/channel-popup.vue';
import { mapState } from 'vuex';
import { isEmptyArarry, deepClone } from '@/ulits/Validation.js';
const globalData = getApp().globalData;
export default {
	props: {
		loadingType:{
			type: Number,
			default:5
		},
		channelData: {
			type: Array,
			default: function() {
				return [];
			}
		},
		islodMore: {
			type: Boolean,
			default: true
		},
		keyword: {
			type: String,
			default: ''
		},
		qudaoName: {
			type: String,
			default: '全部客户'
		},
		isEmpty: {
			type: Boolean,
			default: false
		}
	},
	components: {
		lScrollReload,
		lScrollLoading,
		channelPopup
	},

	data() {
		return {
			// 下拉刷新
			reloadStatus: 0,
			triggerRefreStatus: false,
			// 渠道选择
			maskHeight: 0
		};
	},
	watch:{
		loadingType:{
			handler(newval){
				console.log("watch:loadingType",newval);
			},
			immediate:true,
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.getClientRect('#channel-model', res => {
				this.maskHeight = globalData.screenHeight - res.top;
			});
		});
	},
	computed: {
		...mapState({
			is_has_company: state => state.user.is_has_company,
			role_code: state => state.user.role_code
		}),
		isShowClearn() {
			return typeof this.keyword == 'string' && this.keyword.trim().length;
		}
	},
	methods: {
		upx2px(num) {
			return uni.upx2px(num);
		},

		// 渠道重置
		QuDaoModelReset() {
			this.$emit('qudaoReset', { one_category_id: null, two_category_id: null, three_category_id: null, text: '全部客户' });
		},
		// 选择搜索事件
		QuDaoModelSearch(emoption) {
			console.log(emoption);
			const { one_category_id = null, two_category_id = null, three_category_id = null, text = '' } = emoption || {};
			this.$emit('qudaoConfim', { one_category_id, two_category_id, three_category_id, text });
		},
		// 点击渠道蒙版
		handMask(emoption) {
			console.log(emoption);
		},

		// 搜索input取消事件
		cancel() {
			this.$emit('cancelInput');
		},

		// 客户名称搜索input确定事件
		searchGo() {
			this.$emit('searchInput', { value: this.keyword });
		},
		// 关键字搜索
		searchData(fn = false) {},

		refresherpulling() {
			this.reloadStatus = 0;
		},
		refresherrefresh() {
			if (this.triggerRefreStatus) {
				return;
			}
			this.triggerRefreStatus = true;
			this.reloadStatus = 1;
			this.$emit('downReset', { triggerRefreStatus: this.triggerRefreStatus, cb: this.stopScrollLoading });
		},
		stopScrollLoading(code = 2) {
			if (code) {
				this.reloadStatus = 2;
			}
			setTimeout(() => {
				this.triggerRefreStatus = false;
			}, 1000);
		},
		refresherrestore() {
			console.log('自定义下拉刷新被复位');
			this.triggerRefreStatus = false;
			this.reloadStatus = 0;
		},
		refresherabort() {
			console.log('自定义下拉刷新被中止');
			this.triggerRefreStatus = false;
			this.reloadStatus = 0;
		},

		// 加载更多
		upMore() {
			this.$emit('scrollUpMore');
		},
		// 打开全部客户
		openSelect() {
			this.$refs['channel-popup'].open();
		},

		// 获取节点信息
		getClientRect(selectDom, fn) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(selectDom)
				.boundingClientRect(res => {
					if (typeof fn === 'function') {
						fn(res);
					}
				})
				.exec();
		},
	}
};
</script>

<style lang="scss" scoped>
@import './branch.scss';
page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	overflow: hidden;
}
</style>
