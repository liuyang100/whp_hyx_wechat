<template>
	<view class="currt-page">
		<view class="list">
			<view class="list-item">
				<view class="label">看板主题</view>
				<view class="value">{{ form.title }}</view>
			</view>
			<view class="list-item">
				<view class="label">是否为我司网点/门店</view>
				<view class="value">{{ form.is_checked ? '是' : '否' }}</view>
			</view>
			<view class="list-item">
				<view class="label">网点/门店名称</view>
				<view class="value">{{ form.customer_name }}</view>
			</view>
			<view class="list-item">
				<view class="label">网点/门店联系电话</view>
				<view class="value">{{ form.mobile }}</view>
			</view>
			<view class="list-item">
				<view class="label">联系人</view>
				<view class="value">{{ form.contacts }}</view>
			</view>
			<view class="list-item">
				<view class="label">网点/门店地址</view>
				<view class="value">{{ form.address }}</view>
			</view>
			
			<uni-section marginTop="0rpx" title="授权的品牌品类" type="square" bgColor="#40CCFF"></uni-section>
			<!-- 店铺下品牌品类 -->
			<view class="shop-list" v-for="item in shopList" :key="item.super_store_id">
				<view class="text-title d-flex">
					<view class="header" :style="{ flex: store_name_width }">{{ item.super_store_name }}</view>
					<view class="header" :style="{ flex: business_width }">业务员</view>
					<view class="header" :style="{ flex: supervisor_width }">终端主管</view>
				</view>
				<view class="d-flex" style="min-height: 60rpx; border-bottom: 1rpx solid #CCCCCC; " v-for="subitem in item.list" :key="subitem.business_category_id">
					<view class="header" :style="{ flex: store_name_width }">{{ subitem.brand_name }}{{subitem.category_name}}</view>
					<view class="header" :style="{ flex: business_width }">{{ subitem.salesman_name || ""  }}</view>
					<view class="header" :style="{ flex: supervisor_width }">{{ subitem.supervisor_name || ""  }}</view>
				</view>
			</view>
			<uni-section marginTop="0rpx" title="导购信息" type="square" bgColor="#40CCFF"></uni-section>
			<view class="shop-list" v-if="guideInfos.length">
				<view class="text-title d-flex">
					<view class="header" :style="{ flex: business_width }">导购员联系人</view>
					<view class="header" :style="{ flex: business_width }">兼职/专职</view>
					<view class="header" :style="{ flex: business_width }">联系电话</view>
				</view>
				
				<view class="d-flex"  style="min-height: 60rpx; border-bottom: 1rpx solid #CCCCCC; "
				 v-for="item in guideInfos" :key="item.guideMobile"
				 >
					<view class="header" :style="{ flex: business_width }">{{item.guideName}}</view>
					<view class="header" :style="{ flex: business_width }">{{item.workType}}</view>
					<view class="header" :style="{ flex: business_width }">{{item.guideMobile}}</view>
				</view>
			</view>
			<view class="diary">
				<view class="diary-lable ">拜访日记</view>
				<textarea class="textarea" disabled  :value="form.content " placeholder="请输写拜访日记" />
			</view>
			<view class="list-item mt-2">
				<view class="label">拜访时间</view>
				<view class="value">{{ form.visit_date }}</view>
			</view>
			<view class="list-item mt-2">
				<view class="label">定位地址</view>
				<view class="value">{{ form.visited_adress }}</view>
			</view>
			<view class="list-item">
				<view class="label">业务员</view>
				<view class="value">{{ form.salesman }}</view>
			</view>
			<view class="list-item mt-2">
				<view class="label">抄送人</view>
				<view class="value">{{ membersName }}</view>
			</view>
			<view class="mt-2">
				<uni-section marginTop="0rpx" title="附件" type="square" bgColor="#40CCFF"></uni-section>
				<view class="up-other" v-for="(item, index) in attachs" :key="item.file_url">
					<view class="f-img"><image class="image" :src="formaImg(item)"></image></view>
					<view class="f-name">{{ item.file_name }}</view>
				</view>
			</view>
			<view class="mt-2">
				<uni-section marginTop="0rpx" title="图片" type="square" bgColor="#40CCFF"></uni-section>
				<view class="upload-img-model">
					<view class="imgage-item " v-for="(item, index) in upPicture" :key="index"><image class="image" v-if="item.file_url" :src="item.file_url" @tap="previewImage(index)"></image></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniSection from '@/components/uni/uni-section/uni-section.vue';

export default {
	name: 'branch-pulish',
	components: {
		uniSection
	},
	data() {
		return {
			store_name_width: 2,
			business_width: 1,
			supervisor_width: 1,
			form: {
				title: '', // 看板主题  string
				is_checked: 1, //拜访是否为我司网点 init 1:是  0:否
				customer_name: '', // 门店名称
				content: '', // 拜访日记
				mobile: '',
				contacts: '',
				address: '', // 定位地址
				visit_date: '', // 拜访日期
				visited_adress: '',
				kanban_id: null,
				customer_apply_id: null,
				salesman: ''
			},
			guideInfos:[], // 导购信息
			shopList: [], // 品牌品类信息
			file_info: [], // 上传图片
			members: [], //抄送人
			attachs: [], // 附件
			upPicture: [] // 附件上传图片
		};
	},

	onLoad(option) {
		if (option) {
			option && (option = this.$formateOption(option));
			option.kanban_id && this.getdetail(option.kanban_id);
		}
	},
	computed: {
		membersName() {
			// 选择抄送人的name值
			return this.members.map(v => v.name).join('; ');
		}
	},
	methods: {
		// 图片预览
		previewImage(index){
			const urls = this.upPicture.map(v => v.file_url);
			uni.previewImage({
				current:index,
				urls:urls,
				indicator:"number",
				loop:true,
				success(){
					console.log("打开成功");
				},
				fail(){
					uni.showToast({
						title:"打开预览失败,请再试试看",
						icon:'none'
					})
				}
				
			})
		},
		getdetail(kanban_id) {
			this.$myRequest({
				url: this.$myhttpUrl.twkanbanDetail,
				data: {
					kanban_id: parseInt(kanban_id)
				},
				success: res => {
					console.log(JSON.stringify(res, null, 4));
					try{
						let result = res;
						this.form = {
							salesman: result.name,
							title: result.title,
							is_checked: result.is_checked,
							customer_name: result.customer_name,
							address: result.address,
							mobile: result.mobile,
							contacts: result.contacts,
							content: result.content,
							visit_date: result.visit_date,
							kanban_id: result.kanban_id,
							customer_apply_id: result.customer_id,
							visited_adress: result.visited_adress
						};
						/* 抄送人 */
						this.guideInfos  = result.guideInfos;
						this.members = result.members;
						/* 上级店铺 */
					
						this.shopList = result.business_category_list;
						/* 附件 */
						const tempAttachs = result.attachs.filter(v => v.file_type == 1);
						this.renderAttachs(tempAttachs);
						/* 图片 */
						const tempUpPicture = result.attachs.filter(v => v.file_type == 2);
						this.renderUpPicture(tempUpPicture);
					}catch(e){
						//TODO handle the exception
						uni.showToast({
							title:"加载失败",
							icon:"none"
						})
					}
					
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},

		/* 附件 */
		renderAttachs(optionArr) {
			optionArr.forEach(v => {
				let laseindex = v.file_url.lastIndexOf('.');
				if (laseindex > -1) {
					let fileTypeName = v.file_url.substring(laseindex).toLocaleLowerCase();
					let file_format = 'text';
					if (/\.(gif|jpg|jpeg|png)$/.test(fileTypeName)) {
						v.file_format = 'png';
					}
					if (/\.(doc|docx)$/.test(fileTypeName)) {
						v.file_format = 'doc';
					}
					if (/\.(xlsx|xls)$/.test(fileTypeName)) {
						v.file_format = 'xls';
					}
					if (/\.(pptx|ppt)$/.test(fileTypeName)) {
						v.file_format = 'ppt';
					}
				}
			});
			this.attachs = optionArr;
		},
		/* 处理图片 */
		renderUpPicture(optionArr) {
			this.upPicture = optionArr;
		},
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
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
}

.currt-page {
	width: 100%;
	min-height: 100%;
	background-color: #f5f5f5;
}

.list {
	width: 100%;
	.list-item {
		background-color: #ffffff;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 16rpx 20rpx 36rpx;
		display: flex;
		border-bottom: 1rpx solid #eeeeee;
		.label {
			min-width: 280rpx;
			flex-shrink: 0;
			font-size: 30rpx;
			color: #222;
		}
		.value {
			text-align: right;
			flex: 1;
			font-size: 28rpx;
			color: #666;
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

// 上级店铺
.shop-list {
	background-color: #eeeeee;
	padding: 10rpx 30rpx 20rpx 30rpx;
	color: #333333;
	.text-title {
		width: 100%;
		display: flex;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: 1rpx solid #CCCCCC;
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
	.redio-list {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		.rlabel {
			display: flex;
			align-items: center;
			padding-right: 0;
			font-size: 28rpx;
			width: 33.33%;
			height: 50rpx;
			margin: 10rpx 0 0 0;

			text {
				height: 50rpx;
				white-space: nowrap;
				line-height: 50rpx;
			}
		}
	}
}
.mynowarp {
	white-space: nowrap;
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

.upload-img-model {
	padding: 20rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.imgage-item {
		width: 170rpx;
		height: 170rpx;
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
	}
}
</style>
