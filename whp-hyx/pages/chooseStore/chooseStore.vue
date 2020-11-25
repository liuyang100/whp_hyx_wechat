<template>
	<view>
		<view class="search">
			<ly-search-bar class="flex-1" bgColor="#f2f2f2" clearButton="auto" cancelButton="none" :radius="35" placeholder="搜索关键词" @confirm="dataReset">
				<text class="iconfont ml-2 font-lg mian-colot100">&#xe643;</text>
			</ly-search-bar>
		</view>
		<view class="section">
			选择主店
			<text class="double">(单选)</text>
		</view>
		<scroll-view scroll-y="true" :scroll-into-view="scrollkey" id="scroll-view" class="scroll-view-style" :style="{ height: `calc(100vh - ${scrollTop}px)` }">
			<radio-group @change="radioChange" v-if="docbel === false">
				<block v-for="(item, index) in list" :key="index">
					<template v-if="item.length">
						<view style="height: 46rpx;width: 100%;" :id="index">{{ index }}</view>
						<view class="store-item" v-for="(sitem, sindex) in item" :key="sitem.store_id">
							<radio class="radio" :value="JSON.stringify(sitem)" />
							<text class="name">{{ sitem.store_name }}</text>
						</view>
					</template>
				</block>
			</radio-group>

			<checkbox-group v-if="docbel === true" @change="checkboxChange">
				<block v-for="(item, index) in list" :key="index">
					<template v-if="item.length">
						<view style="height: 46rpx;width: 100%;" :id="index">{{ index }}</view>
						<view class="store-item" v-for="(sitem, sindex) in item" :key="sitem.store_id">
							<checkbox class="checkbox" :value="JSON.stringify(sitem)" />
							<text class="name">{{ sitem.store_name }}</text>
						</view>
					</template>
				</block>
			</checkbox-group>
		</scroll-view>
		<view style="position: fixed; top: 180rpx; right: 0;bottom: 0; width: 60rpx;">
			<view
				@click.stop="sHandClick(titem)"
				:style="{ color: scrollkey == titem ? '#fdc100' : '#111111' }"
				style="line-height: 1.5; font-size: 24rpx; padding-left: 10rpx; color: #111111;"
				v-for="(titem, tindex) in indexList"
				:key="tindex"
			>
				{{ titem }}
			</view>
		</view>
	</view>
</template>

<script>
import lySearchBar from '@/components/uni/ly-search-bar/ly-search-bar.vue';
import { chineseToPinYin } from '@/ulits/pinyinsort.js';
export default {
	components: {
		lySearchBar
	},
	data() {
		return {
			isShopkeeper: 0,
			sale_org_id: null,
			is_mian_store: null,
			scrollTop: 0,
			list: [],
			indexList: [],
			scrollkey: 'A',
			docbel: false
		};
	},
	onLoad(option) {
		if (option) {
			// option=this.$formateOption(option)
			console.log(option);
			this.sale_org_id = Number(option.id);
			this.isShopkeeper = Number(option.isShopkeeper);
			if (this.isShopkeeper === 0) {
				this.is_mian_store = 1;
				uni.setNavigationBarTitle({
					title: '选择主店(单选)'
				});
				this.docbel = false;
			} else if (this.isShopkeeper === 1) {
				this.is_mian_store = 0;
				uni.setNavigationBarTitle({
					title: '选择分店(多选)'
				});
				this.docbel = true;
			}
		}

		if (this.sale_org_id !== null && this.is_mian_store !== null) {
			/* 获取数据 */
			this.getStoreData();
		}
	},

	onReady() {
		const query = uni.createSelectorQuery().in(this);
		query
			.select('#scroll-view')
			.boundingClientRect(data => {
				console.log('得到布局位置信息', data);
				this.scrollTop = data.top;
			})
			.exec();
	},
	methods: {
		// 主店单选
		radioChange(e) {
			console.log('单选');
			console.log(e);
		},
		checkboxChange(e) {
			console.log('多选');
			console.log(e);
		},
		// 点击索引
		sHandClick(sns) {
			this.scrollkey = '';
			this.$nextTick(() => {
				this.scrollkey = sns;
			});
		},
		pySegSort(arr) {
			let re = /[^\u4e00-\u9fa5]/; //中文正则
			let tempObj = {};
			let indexArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
			indexArr.forEach(function(v) {
				v === '#' ? (tempObj['other'] = []) : (tempObj[v] = []);
			});

			for (let i = 0; i < arr.length; i++) {
				let namePinyin = chineseToPinYin(arr[i].store_name[0]);
				if (tempObj.hasOwnProperty(namePinyin[0])) {
					tempObj[namePinyin[0]].push(arr[i]);
				} else {
					tempObj['other'].push(arr[i]);
				}
			}
			return {
				list: tempObj,
				indexList: indexArr
			};
		},
		getStoreData() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});

			let tempparams = {
				sale_org_id: this.sale_org_id,
				is_mian_store: this.is_mian_store
			};
			this.getRequest(tempparams).then(res => {
				console.log('请求成功的数据', res);
				let { list, indexList } = this.pySegSort(res.data);
				this.list = list;
				this.indexList = indexList;
			});
		},

		getRequest(params) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.storeList,
					data: params,
					success: res => {
						resolve(res);
					},
					fail: err => {
						reject({ message: '获取失败' });
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
page {
	min-height: 100vh;
	height: 100%;
	background-color: #f5f5f5;
	box-sizing: border-box;
	overflow: hidden;
}
.search {
	background-color: #ffffff;
	width: 750rpx;
	height: 100rpx;
	box-sizing: border-box;
	padding: 20rpx 30rpx;
}

.section {
	font-size: 28rpx;
	font-weight: 700;
	padding: 20rpx 30rpx;
	color: #000;
	background-color: #ffffff;
	border-bottom: 1rpx solid #eeeeee;
	.double {
		color: #cccccc;
		font-size: 24rpx;
		font-weight: 400rpx;
		margin-left: 10rpx;
	}
	&::before {
		content: '';
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		background-color: #fdc100;
		margin-right: 10rpx;
	}
}
.scroll-view-style {
	width: 750rpx;
	background-color: #ffffff;
	box-sizing: border-box;
	padding: 0 0 0 30rpx;
	.store-item {
		border-bottom: 1rpx solid #eeeeee;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 30rpx;
		.name {
			margin-left: 16rpx;
		}
	}
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
	border: 1px solid #fdc100;
}

.radio .wx-radio-input {
	border-radius: 50%;
	width: 36rpx;
	height: 36rpx;
}
.radio .wx-radio-input.wx-radio-input-checked {
	color: #ffffff !important;
	background-color: #fdc100;
	border: 1px solid #fdc100;
}
/* #endif */
</style>
