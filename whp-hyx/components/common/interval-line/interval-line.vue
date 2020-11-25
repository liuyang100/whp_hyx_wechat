<template>
	<view :style="styles"></view>
</template>

<script>
export default {
	props: {
		bgColor: {
			type: String,
			default() {
				return '#D8D8D8';
			}
		},
		height: {
			type: String,
			default() {
				return '20rpx';
			}
		}
	},
	data() {
		return {
			width: '750rpx'
		};
	},
	computed: {
		styles() {
			return `background-color:${this.bgColor};height:${this.height};width:${this.width}`;
		}
	}
};
</script>

<style></style>
