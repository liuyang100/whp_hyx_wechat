<template>
	<view class="currt-page">
		<!--网点拜访发布  -->
		<evan-form class="evan-form-show" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="form">
			<evan-form-item label="看板主题" class="evan-form-item" prop="title">
				<input
					type="text"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="form.title"
					placeholder="请填写看板主题"
				/>
			</evan-form-item>
			<template v-if="is_has_company">
				<view class="isShopkeeper d-flex j-sb a-center">
					<text class="text">是否为我司网点/门店</text>
					<view class="d-flex a-center flex-1 j-end">
						<radio-group @change="radioChange" class="isShopkeeperpro">
							<view class="isShopkeeperlis">
								<text class="label">是</text>
								<checkbox color="#fdc100" :value="1" class="checkbox" :checked="true" />
							</view>
							<view class="isShopkeeperlis">
								<text class="label">否</text>
								<checkbox color="#fdc100" :value="0" class="checkbox" :checked="false" />
							</view>
						</radio-group>
					</view>
				</view>
			</template>
			<template v-else>
				<evan-form-item label="是否为我司网点/门店" class="evan-form-item"><input disabled type="text" class="form-input mynowarp" value="是" /></evan-form-item>
			</template>
			<evan-form-item label="网点/门店名称" show_jiantou class="evan-form-item" @click="goSelectCustomer">
				<view class="flex-1 text-right" :style="{ color: form.customer_name ? '#666' : '#ccc' }">{{ form.customer_name || '请选择门店名称' }}</view>
			</evan-form-item>
			<template v-if="hasStore">
				<evan-form-item label="联系人" class="evan-form-item"><input type="text" confirm-type="确定" class="form-input mynowarp" v-model="form.contacts" /></evan-form-item>
				<evan-form-item label="网点/门店联系电话" class="evan-form-item">
					<input type="text" confirm-type="确定" class="form-input mynowarp" v-model="form.mobile" />
				</evan-form-item>
				<evan-form-item label="网点/门店地址" class="evan-form-item">
					<input type="text" confirm-type="确定" class="form-input mynowarp" v-model="form.address" />
				</evan-form-item>
				
				<view class=" authorization-class">
					<view class="iconfont">&#xe672;</view>
					<view class="ml-1">授权的品牌品类</view>
				</view>
				<view class="shop-list">
					<view class="shop-card" v-for="(item, index) in shopList" :key="item.super_store_id">
						<view class="text-title d-flex">{{ item.super_store_name }}</view>
						<view class="shop-brand d-flex a-center" v-for="(subitem, subindex) in item.list" :key="subindex">
							<view class="header" :style="{ flex: store_name_width }">{{ subitem.business_category_name }}</view>
							<view class="header" :style="{ flex: business_width }">{{ subitem.salesman_name || '' }}</view>
							<view class="header" :style="{ flex: supervisor_width }">{{ subitem.supervisor_name || '' }}</view>
						</view>
					</view>
				</view>
				<uni-section marginTop="0rpx" title="导购信息" type="square" bgColor="#40CCFF"></uni-section>
				<view class="shoppers-info" v-if="guideInfos.length">
					<view class="text-title d-flex">
						<view class="header" :style="{ flex: business_width }">导购员联系人</view>
						<view class="header" :style="{ flex: business_width }">兼职/专职</view>
						<view class="header" :style="{ flex: business_width }">联系电话</view>
					</view>
					<view class="d-flex" style="min-height: 60rpx; border-bottom: 1rpx solid #CCCCCC; " v-for="item in guideInfos" :key="item.guideMobile">
						<view class="header" :style="{ flex: business_width }">{{ item.guideName }}</view>
						<view class="header" :style="{ flex: business_width }">{{item.workType}}</view>
						<view class="header" :style="{ flex: business_width }">{{ item.guideMobile }}</view>
					</view>
				</view>
			</template>
			<view class="diary">
				<view class="diary-lable ">拜访日记</view>
				<textarea class="textarea" placeholder-style="color:#cccccc;" v-model="form.content" placeholder="请输写拜访日记" />
			</view>
			<view class="mt-2">
				<evan-form-item label="拜访日期" class="evan-form-item " prop="visit_date">
					<view class="mynowarp text-right color333">{{ form.visit_date }}</view>
				</evan-form-item>
				<evan-form-item label="业务员" class="evan-form-item">
					<view class="mynowarp text-right color333">{{ loginInfo.name }}</view>
				</evan-form-item>
			</view>
			<view class="mt-2">
				<evan-form-item label="抄送人" :labelStyle="{ 'min-width': '200rpx' }" class="evan-form-item" show_jiantou @click="goAddUserid">
					<view class="text-right  " :style="{ color: membersName ? '#333333' : '#cccccc' }">{{ membersName || '请选择抄送人' }}</view>
				</evan-form-item>
			</view>
			<view class="mt-2">
				<evan-form-item label="添加附件" class="evan-form-item">
					<view class="d-flex"><view class="attachs-btn" @click="uploadFuJian">添加附件</view></view>
				</evan-form-item>
				<view class="up-other" v-for="(item, index) in attachs" :key="item.file_url">
					<view class="f-img"><image class="image" :src="formaImg(item)"></image></view>
					<view class="f-name">{{ item.file_name }}</view>
					<view class="f-btn" @click="deletAttachs(index)">删除</view>
				</view>
			</view>
			<view class="my-2">
				<evan-form-item label="地址" :labelStyle="{ 'min-width': '200rpx' }" class="evan-form-item">
					<view>
						<text class="iconfont mr-1" style="color: #ff6700;">&#xe62f;</text>
						<text class="text-right color333">{{ form.visited_adress }}</text>
					</view>
				</evan-form-item>
			</view>
			<uni-section title="上传照片" type="square" bgColor="#fdc100"></uni-section>
			<view class="upload-img-model">
				<block v-if="upPicture.length !== 0">
					<view class="imgage-item " v-for="(item, index) in upPicture" :key="index">
						<image class="image" v-if="item.file_url" :src="item.file_url"></image>
						<text class="iconfont delete-icon" @click="deletUpImage(index)">&#xe64c;</text>
					</view>
				</block>
				<view class="imgage-item" :key="index" @tap="chooseImage"><view class="iconfont upload_item_content_haost">&#xe602;</view></view>
			</view>
		</evan-form>
		<view class="bctj-btn"><button class=" button" size="mini" @click="submit">提交</button></view>
	</view>
</template>

<script>
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import uniSection from '@/components/uni/uni-section/uni-section.vue';
import utils from '@/components/evan-form/utils.js';
import { timeFormat } from '@/ulits/function/timeFormat.js';
import { deepClone } from '@/ulits/Validation.js';
import { mapState, mapActions } from 'vuex';

var QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// 门店运营的状态
var opstatus = ['在营业/在合作', '在营业/无样机/未合作', '在营业/有样机/待激活', '未营业'];
var firdge_type = ['U型厅', '一字厅', 'L型厅']; //冰箱
var washer_type = ['厅房', '独岛']; // 洗衣机

export default {
	name: 'branch-pulish',
	components: {
		evanForm,
		evanFormItem,
		uniSection
	},
	data() {
		return {
			store_name_width: 2,
			business_width: 1,
			supervisor_width: 1,
			clearnTime: null,
			hideRequiredAsterisk: true,
			form: {
				title: '', // 看板主题  string
				is_checked: 1, //拜访是否为我司网点 init 1:是  0:否
				customer_name: '', // 门店名称
				mobile: '', // 门店联系电话(选择门店带出的信息)
				contacts: '', // 门店联系人(选择门店带出的信息)
				address: '', //门店地址(选择门店带出的信息)
				customer_apply_id: null, //客户的id 是我司
				content: '', // 拜访日记
				longitude: '', // 经度
				latitude: '', // 纬度
				visited_adress: '', //拜访地址
				visit_date: '' // 拜访日期
			},
			guideInfos: [], //导购信息
			shopList: [], // 品牌品类信息
			file_info: [], // 上传图片
			members: [], //抄送人
			attachs: [], // 附件
			upPicture: [], // 附件上传图片

			rules: {
				title: {
					required: true,
					message: '看板主题不能为空'
				},
				customer_apply_id: {
					required: true,
					message: '请选择门店'
				},
				mobile: [
					{
						required: true,
						message: '请填写联系电话'
					},
					{
						validator: this.isMobilePhone
					}
				],
				visit_date: {
					required: true,
					message: '拜访日期不能为空'
				},
				visited_adress: {
					required: true,
					message: '拜访地址不能为空'
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

	onLoad(option) {
		this.$nextTick(() => {
			this.$refs.form.setRules(this.rules);
		});
		this.__init();
	},
	onUnload() {
		uni.removeStorage({
			key: 'NET_RE_CC',
			success: function(res) {
				console.log('清除发布抄送人缓存成功');
			}
		});
	},

	computed: {
		...mapState({
			is_has_company: state => state.user.is_has_company,
			loginInfo: state => state.user.loginInfo,
			find_store: state => state.channel.storedata,
			sale_org: state => state.user.sale_org
		}),
		hasStore() {
			return this.form.customer_apply_id !== '' && this.form.customer_apply_id !== undefined && this.form.customer_apply_id !== null;
		},

		membersName() {
			// 选择抄送人的name值
			return this.members.map(v => v.name).join('; ');
		}
	},

	methods: {
		...mapActions(['getPatrol_storeData']),
		isMobilePhone(rule, value, callback) {
			if (test.mobile(value)) {
				callback();
			} else {
				callback(new Error('手机号格式不正确'));
			}
		},
		async __init() {
			try {
				let addressInfo = await this.getCurrentAdressInfo();
				console.log(addressInfo, 'djfi');
				this.form.longitude = addressInfo.location.lng; // 经度
				this.form.latitude = addressInfo.location.lat; // 纬度
				this.form.visited_adress = addressInfo.address;
				this.form.visit_date = timeFormat(null, 'yyyy-mm-dd  hh:MM:ss');
			} catch (e) {
				console.log(e);
				//TODO handle the exception
				uni.showToast({
					title: '获取定位地址失败',
					icon: 'none'
				});
			}
		},
		submit() {
			let isOk = true;
			utils.validate(this.form, this.rules, (res, errors) => {
				if (!res) {
					isOk = false;
				}
			});
			if (!isOk) return;
			if (this.clearnTime) return;
			this.clearnTime = true;
			let data = this.validmyRequest();
			if (!data) return;
			uni.showLoading({
				title: '发布中...',
				mask: true
			});
			console.log(JSON.stringify(data));

			this.$myRequest({
				url: this.$myhttpUrl.twkanbanSave,
				data: data,
				success: res => {
					this.clearnTime = false;
					uni.showToast({
						title: '发布成功',
						duration: 1500
					});
					// 更新首页巡店计划数据
					this.getPatrol_storeData();
					setTimeout(function() {
						uni.hideToast();
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面
						uni.navigateBack({
							success: function() {
								beforePage.onLoad(); // 执行前一个页面的onLoad方法
							}
						});
					}, 1500);
				},
				fail: err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				},
				complete: () => {
					uni.hideLoading();
					this.clearnTime = false;
				}
			});
		},
		validmyRequest(reqData = {}) {
			try {
				let data = deepClone(this.form);
				reqData = { ...data };
				/*
				business_categorys:[{
				    super_store_name:上级店铺名称,
				    super_store_id:上级店铺名称,
				    list:[{
				       business_category_id:品牌品类id
				       business_category_name:品牌品类名称
				       supervisor_id:终端主管
					   supervisor_name:终端主管,
					   salesman_name:业务员name
					   salesman_id:业务员id
				    }]
				}] 
				 */

				// 抄送人
				if (this.members.length > 0) {
					reqData.members = this.members.map(v => {
						return {
							userid: v.id
						};
					});
				}
				// 上传附件
				/* 
				attachs:[{
					 file_url:图片地址,
					 file_name:图片名称,
				       file_type:1附件
					 },{
					 file_url:图片地址,
					 file_name:图片名称,
				         file_type:2
					 },{
					 file_url:图片地址,
					 file_name:图片名称,
				         file_type:1
					 }] 
				 */
				// 上传图片
				let attachs = deepClone(this.attachs);
				attachs = attachs.map(v => {
					return {
						file_url: v.file_url,
						file_name: v.file_name,
						file_type: v.file_type
					};
				});
				reqData.attachs = [...attachs, ...this.upPicture];
				return reqData;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				return false;
			}
		},

		/* 处理附件上传的文件图片显示格式 */

		formaImg(option) {
			let value = option.file_format;
			if (value == 'text') {
				return '/static/img/TXT.svg';
			} else if (value == 'ppt') {
				return '/static/img/ppt.svg';
			} else if (value == 'doc') {
				return '/static/img/DOCX.svg';
			} else if (value == 'xls') {
				return '/static/img/xls.svg';
			} else if (value == 'png') {
				return option.file_url;
			} else {
				return '';
			}
		},

		/* 添加抄送人 */
		goAddUserid() {
			let _this = this;
			this.$eventHub.$on('chechedUserid', res => {
				const { checkList = [] } = res;
				this.members = checkList;
				_this.$eventHub.$off('chechedUserid');
			});
			const slectListId = this.members.map(v => v.id);
			this.$myNavigateTo('/pages/add-userid/add-userid', { slectListId: slectListId });
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
				console.log('error:', error);
				console.log('success:', success);
				uploadFile = await uni.uploadFile({
					url: that.$myConfig.upUrl,
					filePath: success.tempFilePaths[0],
					name: 'file'
				});

				console.log('uploadFile:', uploadFile);
				if (uploadFile[0]) {
					throw new Error('上传图片失败');
				}
				let { message, file_info } = JSON.parse(uploadFile[1].data);
				if (message.type === 'success') {
					that.upPicture.push({
						file_type: 2,
						file_name: file_info.name,
						file_url: file_info.url
					});
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

		/* 上传附件 */
		async uploadFuJian(ins) {
			let { file_info, message, type } = await this.$upImage(ins);
			if (message.type == 'success') {
				let laseindex = file_info.url.lastIndexOf('.');
				if (laseindex > -1) {
					let fileTypeName = file_info.url.substring(laseindex).toLocaleLowerCase();
					let file_format = 'txt';
					if (/\.(gif|jpg|jpeg|png)$/.test(fileTypeName)) {
						file_format = 'png';
					}
					if (/\.(doc|docx)$/.test(fileTypeName)) {
						file_format = 'doc';
					}
					if (/\.(xlsx|xls)$/.test(fileTypeName)) {
						file_format = 'xls';
					}
					if (/\.(pptx|ppt)$/.test(fileTypeName)) {
						file_format = 'ppt';
					}

					this.attachs.push({
						file_url: file_info.url,
						file_name: file_info.name,
						file_type: 1,
						file_format: file_format
					});
				}
			}
		},

		/* 删除附件 */
		deletAttachs(index) {
			this.attachs.splice(index, 1);
		},
		/* 删除上传图片 */
		deletUpImage(index) {
			this.upPicture.splice(index, 1);
		},

		/* 选择我司门店触发事件 */
		goSelectCustomer() {
			let _this = this;
			this.$eventHub.$on('changSelect', async res => {
				try {
					let temp = {
						customer_apply_id: res.customer_apply_id,
						is_checked: res.is_checked
					};
					let resultData = await this.getauthList(temp);

					this.guideInfos = resultData.guideInfos || [];
					resultData = resultData.business_category_list.map(v => {
						return {
							super_store_name: v.super_store_name,
							super_store_id: v.super_store_id,
							list: v.list.map(s => {
								return {
									business_category_name: s.brand_name + s.category_name,
									supervisor_name: s.supervisor_name,
									salesman_name: s.salesman_name
								};
							})
						};
					});
					this.shopList = resultData;
					// 获取授权列表
					this.form.customer_apply_id = res.customer_apply_id;
					this.form.address = res.area_fullname;
					this.form.contacts = res.contacts;
					this.form.customer_name = res.customer_name;
					this.form.mobile = res.mobile;
				} catch (e) {
					console.log(e);
				}

				_this.$eventHub.$off('changSelect');
			});
			this.$myNavigateTo('/pages/see-customer/see-customer', {
				is_checked: this.form.is_checked
			});
		},

		// 店铺下的品牌品类
		stopChang(index, sindex) {
			this.shopList[index].business_category_list[sindex].checked = !this.shopList[index].business_category_list[sindex].checked;
		},

		/* 获取门店下的品牌 */
		getauthList(params) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.businessCategoryList,
					data: params,
					success: res => {
						console.log('sdkjfslj', res);
						resolve(res);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},

		/* 切换是否我司网点 */
		radioChange(e) {
			this.form.customer_name = '';
			this.form.mobile = '';
			this.form.contacts = '';
			this.form.customer_apply_id = null;
			this.form.is_checked = parseInt(e.detail.value);
		},

		/* 获取当前的地理位置 */
		getCurrentAdressInfo() {
			let _self = this;
			qqmapsdk = new QQMapWX({
				key: _self.$myConfig.tMapsKey
			});
			console.log(qqmapsdk, '获取定位');

			return new Promise((resolve, reject) => {
				qqmapsdk.reverseGeocoder({
					success: res => {
						console.log(res, '地址');
						resolve(res.result);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	background-color: #f5f5f5;
}

.currt-page {
	width: 100%;
	min-height: 100%;
}
.evan-form-show {
	width: 100%;
	height: 100%;

	.evan-form-item {
		background-color: #ffffff;
		.form-input {
			font-size: 28rpx;
			color: #666;
			text-align: right !important;
		}
		.value-content {
			font-size: 28rpx;
			color: #666;
			text-align: right;
		}
		.mynowarp {
			white-space: nowrap;
		}
		.reqired {
			font-size: 28rpx;
			color: #333333;
			&::before {
				content: '*';
				color: #dc1402;
			}
		}
	}
}

// 日记
.diary {
	background: #ffffff;
	margin-bottom: 20rpx;
	padding: 20rpx 16rpx 20rpx 36rpx;
	display: flex;
	flex-direction: column;
	height: auto;
	border-bottom: 1rpx solid #eeeeee;
	.diary-lable {
		flex-shrink: 0;
		color: #333333;
		padding-bottom: 10rpx;
	}
	.textarea {
		color: #666666;
		font-size: 26rpx;
		display: block;
		width: 100%;
		box-sizing: border-box;
		min-height: 200rpx;
	}
}
.upload_item {
	&_content {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		border: 1rpx dashed #666666;
		background-color: #fefefe;
		display: flex;
		align-items: center;
		justify-content: center;
		&_image {
			width: 130rpx;
			height: 130rpx;
			border-radius: 4px;
		}
		&_haost {
			font-size: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #666666;
		}
	}
	&_bottom_text {
		display: inline-block;
		position: relative;
		i {
			color: #ff0000;
			font-size: 28rpx;
			display: inline-block;
			width: 10rpx;
			height: 10rpx;
			margin-right: 5rpx;
		}
	}
}
.adress-info /deep/ .evan-form-item-container__main {
	padding-left: 0;
}
/* 是否为我司网点 */
.isShopkeeper {
	width: 750rpx;
	// height: 100rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 20rpx 20rpx 20rpx 40rpx;
	line-height: 1.4;
	border-bottom: 1rpx solid #eee;
	.text {
		font-size: 30rpx;
	}
	.isShopkeeperpro {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		.isShopkeeperlis {
			width: 150rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.label {
				padding: 10rpx;
			}
			/* #ifdef APP-PLUS || MP-WEIXIN */
			.checkbox {
				.wx-checkbox-input {
					border-radius: 50%;
					width: 34rpx;
					height: 34rpx;
					&.wx-checkbox-input-checked {
						color: #ffffff !important;
						background-color: #18b566;
						border: 1rpx solid #18b566;
					}
				}
			}
			/* #endif */
		}
	}
}

// 上传图片
.upload-img-model {
	background-color: #ffffff;
	padding: 20rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.imgage-item {
		width: 170rpx;
		height: 170rpx;
		margin: 0 20rpx 20rpx 0;
		margin-bottom: 10rpx;
		border-radius: 10rpx;
		border: 1rpx dashed #666666;
		background-color: #fefefe;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.image {
			width: 160rpx;
			height: 160rpx;
		}
		.delete-icon {
			width: 40rpx;
			height: 50rpx;
			background-color: rgba(100, 100, 100, 0.6);
			text-align: center;
			line-height: 50rpx;
			position: absolute;
			top: 5rpx;
			right: 5rpx;
			color: #eeeeee;
		}

		.upload_item_content_haost {
			font-size: 60rpx;
		}
	}
}
// 上传附件按钮
.attachs-btn {
	margin-left: auto;
	width: 145rpx;
	height: 54rpx;
	font-size: 26rpx;
	border-radius: 10rpx;
	text-align: center;
	line-height: 54rpx;
	background-color: #f0f0f0;
	color: #333333;
	box-shadow: 2rpx 0 2rpx #f5f5f5;
}

//上传附件
.up-other {
	display: flex;
	align-items: center;
	padding: 20rpx 16rpx 20rpx 36rpx;
	box-sizing: border-box;
	border-bottom: 1rpx solid #eeeeee;
	.f-img {
		flex-shrink: 0;
		width: 80rpx;
		height: 80rpx;
		padding: 10rpx;
		border-radius: 6rpx;
		box-sizing: border-box;
		background-color: #eeeeee;
		.image {
			width: 100%;
			height: 100%;
		}
	}
	.f-name {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.f-btn {
		width: 100rpx;
		height: 80%;
		flex-shrink: 0;
		font-size: 26rpx;
		color: #5555ff;
		padding-right: 10rpx;
		border-left: 1rpx solid #eeeeee;
		text-align: right;
	}
}
.bctj-btn {
	display: flex;
	margin: 50rpx 0;
	& .button {
		flex: 1;
		margin: 0 20rpx;
		font-size: 32upx;
		height: 80rpx;
		line-height: 80rpx;
		color: #ffffff;
		border-radius: 5upx;
		background-color: #fdc100;
		text-align: center;
	}
}
.authorization-class {
	height: 80rpx;
	display: flex;
	width: 750rpx;
	box-shadow: 3rpx 3rpx 3rpx #333333;
	font-size: 30rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	line-height: 80rpx;
	background-color: #ffffff;
	.iconfont {
		color: #40ccff;
	}
}
// 导购信息
.shoppers-info {
	background-color: #eeeeee;
	padding: 10rpx 30rpx 20rpx 30rpx;
	color: #333333;
	.text-title {
		width: 100%;
		display: flex;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: 1rpx solid #cccccc;
		.name {
			flex: 1;
			overflow: hidden;
			padding-right: 20rpx;
		}
		.delete {
			flex-shrink: 0;
			color: #007aff;
		}
		.header {
			align-self: center;
		}
	}
}
// 上级店铺
.shop-list {
	background-color: #eeeeee;
	.shop-card {
		box-sizing: border-box;
		padding: 20rpx 20rpx 0 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		color: #333;
		.text-title {
			width: 100%;
			display: flex;
			font-size: 30rpx;
			font-weight: bold;
			line-height: 1.8;
			align-items: flex-end;
		}

		.shop-brand {
			height: 80rpx;
			border-bottom: 1rpx solid #eeeeee;
			.header {
				align-self: center;
				height: 100%;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}
}
.mynowarp {
	white-space: nowrap;
}
.color333 {
	color: #333333;
}
</style>
