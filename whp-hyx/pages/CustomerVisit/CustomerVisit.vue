<template>
	<view>
		<view class="bg-white w-100 box-bb">
			<evan-form class="evan-form-show" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="datas">
				<evan-form-item prop="title">
					<view slot="formItem" class="evan-form-item">
						<view class="label required">标题</view>
						<input type="text" confirm-type="确定" v-model="datas.title" class="form-input" placeholder-class="placeholder-style" placeholder="请填写主题内容" />
					</view>
				</evan-form-item>
				<evan-form-item>
					<view slot="formItem" class="evan-form-item" @click="goSelectCustomer">
						<view class="label">选择客户</view>
						<input disabled type="text" class="form-input" :value="customer_name" placeholder-class="placeholder-style" placeholder="请选择客户" />
						<view class="iconfont rigth-arrow">&#xe770;</view>
					</view>
				</evan-form-item>
				<evan-form-item>
					<view slot="formItem" class="evan-form-item">
						<view class="label">拜访方式</view>
						<input disabled type="text" class="form-input" :value="visit_name" />
						<view class="iconfont rigth-arrow">&#xe770;</view>
					</view>
				</evan-form-item>
				<interval-line bg-color="#F7F7F7" height="20rpx" />
				<evan-form-item prop="content">
					<view slot="formItem" class="evan-form-item flex-column">
						<view class="label required">拜访记录</view>
						<textarea class="form-input textarea" type="text" v-model="datas.content" placeholder="请输入您的拜访记录..." placeholder-class="placeholder-style" />
					</view>
				</evan-form-item>
				<interval-line bg-color="#F7F7F7" height="20rpx" />
				<evan-form-item>
					<view slot="formItem" class="evan-form-item">
						<view class="label">当前地址</view>
						<view class="form-input adress-style">
							<view class="iconfont ">&#xe68c;</view>
							<text>{{ datas.visited_adress }}</text>
						</view>
					</view>
				</evan-form-item>
				<interval-line bg-color="#F7F7F7" height="20rpx" />
				<view class="up-img-box">
					<view class="head">
						<text class="iconfont">&#xe65d;</text>
						上传图片
					</view>
					<view class="upload-img-model">
						<view class="imgage-item " v-for="(item, index) in imgs" :key="item">
							<image class="image" :src="item"></image>
							<text class="iconfont delete-icon" @click="deletUpImage(index)">&#xe64c;</text>
						</view>
						<view class="imgage-item" :key="index" @tap="chooseImage"><view class="iconfont upload_item_content_haost">&#xe602;</view></view>
					</view>
				</view>
			</evan-form>
		</view>
		<button @click="submit" class="submit-confrim">提交</button>
	</view>
</template>

<script>
import intervalLine from '@/components/common/interval-line/interval-line.vue';
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import utils from '@/components/evan-form/utils.js';
var QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');
var qqmapsdk;
export default {
	components: {
		evanForm,
		evanFormItem,
		intervalLine
	},
	data() {
		return {
			hideRequiredAsterisk: false,
			clearnTime: null,
			customer_name: '',
			visit_name: '客户拜访',
			datas: {
				// 标题
				title: '',
				// 选择客户id
				customerId: null,
				// 拜访记录
				content: '',
				// 拜访所在地址
				visited_adress: '',
				// 拜访模式 1客户拜访  2其他
				type: 1,
				// 精度
				longitude: '',
				// 纬度
				latitude: ''
			},
			imgs: [],

			rules: {
				title: {
					required: true,
					message: '主题不能为空'
				},

				content: {
					required: true,
					message: '拜访记录不能为空'
				},
				visited_adress: {
					required: true,
					message: '定位地址不能为空'
				},
				longitude: {
					required: true,
					message: '拜访地址不能为空'
				}, // 经度
				latitude: {
					required: true,
					message: '拜访地址不能为空'
				} // 纬度
			}
		};
	},
	onLoad() {
		this.$nextTick(() => {
			this.$refs.form.setRules(this.rules);
		});
		this.__init();
	},
	methods: {
		async __init() {
			try {
				let addressInfo = await this.getCurrentAdressInfo();
				this.datas.longitude = addressInfo.location.lng; // 经度
				this.datas.latitude = addressInfo.location.lat; // 纬度
				this.datas.visited_adress = addressInfo.address;
			} catch (e) {
				//TODO handle the exception
			}
		},

		validmyRequest(reqData = {}) {
			let data = { ...this.datas };
			reqData.title = data.title;
			data.customerId !== null && (reqData.customerId = data.customerId);
			reqData.content = data.content;
			reqData.address = data.visited_adress;
			data.type !== 0 && (reqData.type = data.type);
			reqData.longitude = data.longitude;
			reqData.latitude = data.latitude;
			reqData.attachs = this.imgs.map(v => {
				return {
					url: v
				};
			});
			return reqData;
		},
		submit() {
			let isOk = true;
			utils.validate(this.datas, this.rules, (res, errors) => {
				if (!res) {
					isOk = false;
				}
			});
			if (!isOk) return;
			if (this.clearnTime) {
				clearTimeout(this.clearnTime);
			}
			this.clearnTime = setTimeout(() => {
				let data = this.validmyRequest();
				console.log(JSON.stringify(data, null, 4));
				if (!data) return;
				uni.showLoading({
					title: '提交中...',
					mask: true
				});
				this.$myRequest({
					url: this.$myhttpUrl.store_attendance_clock_save,
					data: data,
					success: res => {
						uni.showToast({
							title: '拜访成功',
							mask: true
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1600);
					},
					fial: err => {
						uni.showToast({
							title: '拜访失败',
							icon: 'none',
							mask: true
						});
					}
				});
			});
		},
		/* 选择我司门店触发事件 */
		goSelectCustomer() {
			let _this = this;
			this.$eventHub.$on('fieldCustomer', res => {
				try {
					_this.datas.customerId = res.customer_id;
					_this.customer_name = res.customer_name;
					_this.$eventHub.$off('fieldCustomer');
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			});
			this.$myNavigateTo('/pages/FieldCustomerList/FieldCustomerList');
		},
		/* 获取当前的地理位置 */
		getCurrentAdressInfo() {
			let _self = this;
			qqmapsdk = new QQMapWX({
				key: _self.$myConfig.tMapsKey
			});
			return new Promise((resolve, reject) => {
				qqmapsdk.reverseGeocoder({
					success: res => {
						resolve(res.result);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},
		
		// 使用相机拍照
		async chooseImage() {
			let that = this;
			let tempFilePaths, uploadFile;
			try {
				tempFilePaths = await uni.chooseImage({
					count: 1,
					sizeType: ['compressed '],
					sourceType: ['camera']
				});
				const error = tempFilePaths[0];
				const success = tempFilePaths[1];
				if (error) {
					throw new Error('启用相机失败');
				}
				console.log("error:",error);
				console.log("success:",success);
				uploadFile = await uni.uploadFile({
					url: that.$myConfig.upUrl,
					filePath: success.tempFilePaths[0],
					name: 'file'
				});
				
				console.log("uploadFile:",uploadFile);
				if (uploadFile[0]) {
					throw new Error('上传图片失败');
				}
				let { message, url } = JSON.parse(uploadFile[1].data);
				if (message.type === 'success') {
					that.imgs.push(url);
					uni.showToast({
						title: message.content,
						icon: 'success'
					});
				} else {
					throw new Error('上传图片失败');
				}
			} catch (e) {
				//TODO handle the exception
				uni.showToast({
					title: e.message,
					icon: 'none'
				});
			}
		},
		/* 删除上传图片 */
		deletUpImage(index) {
			this.imgs.splice(index, 1);
		}
	}
};
</script>

<style lang="scss">
@import '../FieldClock/FieldClock.scss';
</style>
