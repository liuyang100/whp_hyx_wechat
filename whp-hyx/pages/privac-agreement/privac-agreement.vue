<template>
	<view class="w-100 h-100  d-flex ">
		<web-view :webview-styles="webviewStyles" :src="url" @message="getMessage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				url:""
			};
		},
		onLoad() {
			this.url=this.$myConfig.businessDomain+this.$myhttpUrl.xieyi_member
		},
	}
</script>


