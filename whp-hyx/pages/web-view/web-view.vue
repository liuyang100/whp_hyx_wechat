<template>
	<view class="currentPage ">
		<view v-if="url !== null && url !== ''"><web-view :webview-styles="webviewStyles" :src="url" @message="getMessage"></web-view></view>
		<view class="flex-1" v-else><not-thing></not-thing></view>
	</view>
</template>

<script>
import notThing from '@/components/common/nothing/nothing.vue';
export default {
	components: {
		notThing
	},
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			},
			url: ''
		};
	},
	onLoad(option) {
		option && (option = this.$formateOption(option));
		this.url = option.url;
		if (!this.url) {
			uni.setNavigationBarTitle({
				title: '没有维护链接'
			});
		}
	},

	methods: {
		getMessage(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	min-height: 100%;
	background-color:#f5f5f5;
}
.currentPage {
	display: flex;
}
</style>
