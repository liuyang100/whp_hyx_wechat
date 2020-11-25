<template>
	<view class="current-page">
		<uni-popup type="bottom" ref="uni-popup" @maskTask="maskTask">
			<view class="s-adress">
				<view class="adree-head">
					<view class="adree-head-conent">
						<block v-for="(hitem, hindex) in selectList" :key="hitem.flag">
							<view class="head-item" @click="handNav(hitem.flag)">
								{{ hitem.area_name }}
								<text class="iconfont del-icon">&#xe7b8;</text>
							</view>
						</block>
					</view>
					<view class="adree-head-right">
						<view class="confrim-btn" @click="confirm">{{isSkip?'跳过':'确定'}}</view>
					</view>
				</view>
				<view class="adree-main">
					<scroll-view scroll-y="true" style=" width: 100%;height: 100%;" :scroll-into-view="activeKeyval">
						<template v-if="currentActive == 1">
							<block v-for="(item, keyval) in oneData" :key="keyval">
								<template v-if="item.length > 0">
									<view class="lab-key" :id="keyval">{{ keyval }}</view>
									<view class="list-item" v-for="(citem, sindex) in item" :key="sindex" @click.stop="selseIns(citem)">
										<view class="list-item__container">{{ citem.area_name }}</view>
									</view>
								</template>
							</block>
						</template>
						<template v-if="currentActive == 2">
							<block v-for="(item, keyval) in twoData" :key="keyval">
								<template v-if="item.length > 0">
									<view class="lab-key" :id="keyval">{{ keyval }}</view>
									<view class="list-item" v-for="(citem, sindex) in item" :key="sindex" @click.stop="selseIns(citem)">
										<view class="list-item__container">{{ citem.area_name }}</view>
									</view>
								</template>
							</block>
						</template>
						<template v-if="currentActive == 3">
							<block v-for="(item, keyval) in threeData" :key="keyval">
								<template v-if="item.length > 0">
									<view class="lab-key" :id="keyval">{{ keyval }}</view>
									<view class="list-item" v-for="(citem, sindex) in item" :key="sindex" @click.stop="selseIns(citem)">
										<view class="list-item__container">{{ citem.area_name }}</view>
									</view>
								</template>
							</block>
						</template>
						<template v-if="currentActive == 4">
							<block v-for="(item, keyval) in fourData" :key="keyval">
								<template v-if="item.length > 0">
									<view class="lab-key" :id="keyval">{{ keyval }}</view>
									<view class="list-item" v-for="(citem, sindex) in item" :key="sindex" @click.stop="selseIns(citem)">
										<view class="list-item__container">{{ citem.area_name }}</view>
									</view>
								</template>
							</block>
						</template>
					</scroll-view>
					<view class="s-index-box" @touchmove.stop.prevent>
						<view>
							<view
								:style="{ color: activeKeyval == sitem ? '#fdc100' : '#111111' }"
								class="s-index-box-item"
								v-for="(sitem, sindex) in sList"
								:key="sindex"
								@click.stop="sHandClick(sitem)"
							>
								{{ sitem }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni/uni-popup/uni-popup.vue';
import { flatten } from '@/ulits/Validation.js';
export default {
	components: {
		uniPopup
	},
	props: {
		controlTel: {
			type: Number,
			default: 3
		}
	},
	data() {
		return {
			isSkip:false,
			headActive: 1,
			currentActive: 1,
			activeKeyval: 'A',
			sList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			oneData: {},
			twoData: {},
			threeData: {},
			fourData: {},
			param: {
				flag: 1
			},
			navList: {
				'1': {
					key: 'province',
					area_name: '',
					area_id: null,
					flag: 1
				},
				'2': {
					key: 'city',
					area_name: '',
					area_id: null,
					flag: 2
				},

				'3': {
					key: 'county',
					area_name: '',
					area_id: null,
					flag: 3
				},

				'4': {
					key: 'town',
					area_name: '',
					area_id: null,
					flag: 4
				}
			}
		};
	},
	created() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		let data = { flag: this.param.flag};
		this.getAdress(data)
			.then(res => {
				this.oneData = res;
			})
			.catch(err => {
				uni.showModal({
					title: '提示',
					content: err.err
				});
			});
	},
	computed: {
		selectList() {
			let arr = Object.values(this.navList);
			return arr.splice(0, this.headActive - 1);
		}
	},
	watch:{
		fourData(){
			const valueArr = flatten(Object.values(this.fourData));
			if (this.controlTel >= 3 && valueArr.length === 0) {
				this.isSkip = true;
			} else {
				this.isSkip = false;
			}
		}
		
	},
	methods: {
		// 打开地址选择模块
		open() {
			this.$refs['uni-popup'].open();
		},
		
		// 点击蒙版自动收缩起来 || 不做任何操作处理
		maskTask(){
			this.$emit('maskTask')
		},
		
		/**
		 * 选中地址获取下一级的地址 || 选中展示页面上操作
		 * @param {number} type  是否乡镇(1是  0否)
		 * */
		selseIns(ins) {
			let lastFlay = this.param.flag;
			if (this.controlTel < 3  && lastFlay >= 3) {
				this.navList['3'].area_name = ins.area_name;
				this.navList['3'].area_id = ins.area_id;
				this.headActive = 4;
				return;
			}
			if (this.controlTel === 3 && lastFlay >= 4) {
				this.navList['4'].area_name = ins.area_name;
				this.navList['4'].area_id = ins.area_id;
				this.headActive = 5;
				return;
			}
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.param.flag++;
			let data = { flag: this.param.flag, area_id: ins.area_id };
			this.getAdress(data)
				.then(res => {
					switch (lastFlay) {
						case 1:
							this.navList['1'].area_name = ins.area_name;
							this.navList['1'].area_id = ins.area_id;
							this.twoData = res;
							break;
						case 2:
							this.navList['2'].area_name = ins.area_name;
							this.navList['2'].area_id = ins.area_id;
							this.threeData = res;
							break;
						case 3:
							this.navList['3'].area_name = ins.area_name;
							this.navList['3'].area_id = ins.area_id;
							this.fourData = res;
							break;
					}
					this.currentActive = this.param.flag;
					this.headActive = this.param.flag;
				})
				.catch(err => {
					this.param.flag  = lastFlay;
					uni.showToast({
						title:"加载地址失败",
						icon:'none'
					});
				});
		},
		
		// 点击快速索引
		sHandClick(sns) {
			this.activeKeyval = '';
			this.$nextTick(() => {
				this.activeKeyval = sns;
			});
		},
		
		// 点击已经选中的地址做回退操作 || 重选
		handNav(nat) {
			for (let i = nat; i < 5; i++) {
				this.navList[`${i}`].area_name = '';
				this.navList[`${i}`].area_id = null;
			}
			let item = this.navList[`${nat}`];
			this.currentActive = item.flag; // 当前目标数据控制
			if(item.flag <= 3 ){
				this.isSkip = false;
			}else{
				this.isSkip = true;
			}
			this.param.flag = this.currentActive;
			this.headActive = nat; // 显示已选择
		},
		// 跳过提交
		// isSkipConfirm(){},
		
		// 点击确认提交
		confirm() {
			const list = this.selectList;
			if (list.length === 0) {
				return uni.showToast({
					title: '请选择省',
					icon: 'none'
				});
			} else if (list.length === 1) {
				return uni.showToast({
					title: '请选择市',
					icon: 'none'
				});
			} else if (list.length === 2) {
				return uni.showToast({
					title: '请选择区/县',
					icon: 'none'
				});
			} else if (list.length === 3) {
				if (!this.isSkip && this.controlTel === 3) {
					return uni.showToast({
						title: '请选择乡/镇',
						icon: 'none'
					});
				}
			}
			let obj = {
				text: '',
				area_id: null
			};
			obj.text = list.map(v => v.area_name).join('');
			obj.area_id = list[list.length - 1].area_id;
			this.$emit('clickpop', obj);
			this.$refs['uni-popup'].close();
		},
		// 获取省市地区的地址组合方法
		getAdress(params) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.areaSelect,
					data: params,
					success: res => {
						if (res && res.datas) {
							resolve(res.datas);
						} else {
							reject({ err: '数据格式不正确' });
						}
					},
					fail: err => {
						reject({ err: '请求失败' });
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
.s-adress {
	background-color: #ffffff;
	border-radius: 20rpx 20rpx 0rpx 0rpx;
	.adree-head {
		min-height: 100rpx;
		width: 750rpx;
		display: flex;
		border-bottom: 1rpx solid #eeeeee;
		box-sizing: border-box;
		.adree-head-conent {
			flex: 1;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 20rpx 0 0 20rpx;
			.head-item {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				white-space: nowrap;
				border: 1rpx solid #fdc100;
				border-radius: 8rpx;
				color: #fdc100;
				padding: 0 10rpx;
				line-height: 1.6;
				font-size: 24rpx;
				.del-icon {
					margin-left: 8rpx;
					font-size: 28;
				}
			}
		}
		.adree-head-right {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: flex-end;
			padding-right: 20rpx;
			.confrim-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100rpx;
				height: 50rpx;
				font-size: 24rpx;
				background-color: #00aa00;
				border-radius: 8rpx;
				color: #ffffff;
			}
		}
	}
	.adree-main {
		position: relative;
		flex-shrink: 0;
		width: 100vw;
		height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		.lab-key {
			background-color: #f5f5f5;
			width: 750rpx;
			height: 50rpx;
			display: inline-block;
			vertical-align: center;
			padding-left: 20rpx;
			font-weight: 700;
		}
		.list-item {
			position: relative;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #eeeeee;
			padding: 10rpx 20rpx;
			.list-item__container {
				position: relative;
				display: flex;
				flex-direction: row;
			}
		}
	}
}

.s-index-box {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 60rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	.s-index-box-item {
		padding-left: 20rpx;
		font-size: 24rpx;
		line-height: 1.2;
	}
}
</style>
