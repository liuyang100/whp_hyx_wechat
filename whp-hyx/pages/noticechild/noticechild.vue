<template>
	<view class="container">
		<view class="title">{{ title != null ? title : '' }}</view>
		<view class="date">日期：{{ time != null ? time : '' }} 点击数：{{ hits != null ? hits : '' }}</view>
		<view class="main"><jyf-parser :html="data | formatRichText" @linkpress="golink" ref="article"></jyf-parser></view>
	</view>
</template>

<script>
import jyfParser from '@/components/jyf-parser/jyf-parser';
export default {
	components: {
		jyfParser
	},
	data() {
		return {
			data: null, //内容
			title: null, //标题
			time: null, //时间
			hits: null, //点击数
			id: null
		};
	},
	mounted(option) {
		uni.showLoading();
		let pages = getCurrentPages();
		let child = pages[pages.length - 2].$vm.onchild;
		this.title = child.title;
		this.time = child.time;
		this.id = child.article_id;
		uni.setNavigationBarTitle({
			title: this.title
		});
		this.getNotice();
	},
	filters: {
		/**
		 * 处理富文本里的图片宽度自适应
		 * 1.去掉img标签里的style、width、height属性
		 * 2.img标签添加style属性：max-width:100%;height:auto
		 * 3.修改所有style里的width属性为max-width:100%
		 * 4.去掉<br/>标签
		 * @param html
		 * @returns {void|string|*}
		 */
		formatRichText(html) {
			//控制小程序中图片大小
			if (html == null) return;

			let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
				match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
				match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
				match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
				return match;
			});

			newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
				match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
				return match;
			});
			newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
			return newContent;
		}
	},
	methods: {
		golink(tartget) {
			console.log('点击率', tartget);
			let { href, ignore } = tartget;
		},
		getNotice() {
			this.$myRequest({
				url: this.$myhttpUrl.articleSelect,
				data: {
					article_id: this.id
				},
				success: res => {
					this.data = res.content;
					this.hits = res.hits;
					uni.hideLoading();
				},
				fail: err => {
					uni.showToast({
						title: err,
						message,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.title {
	width: 650rpx;
	height: 90rpx;
	line-height: 90rpx;
	background-color: #f3f4f5;
	color: #333;
	border-left: 8rpx solid #ef4e4e;
	margin: 50rpx;
	margin-bottom: 0rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: 600;
	overflow: hidden; 
	display: -webkit-box; 
	text-overflow: ellipsis; 
	-webkit-line-clamp: 1; 
	-webkit-box-orient: vertical; 
	vertical-align: bottom;

}

.date {
	width: 650rpx;
	margin: 0 50rpx;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	border-bottom: 2rpx solid #f3f4f5;
	color: #888;
}

.main {
	width: 700rpx;
	margin: 25rpx;
	overflow: hidden;
}
</style>
