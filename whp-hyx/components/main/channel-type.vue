<template>
	<view class="">
		<uni-list>
			<uni-list-item title="大渠道" @tap="toggleTab('selector', 'dachudao')" :rightText="channelClass.bigChannelValue" rightTextFont="22" rightTextColor="#999999" />
			<uni-list-item title="小渠道" @tap="toggleTab('selector', 'xiaochudao')" :rightText="channelClass.smallChannelValue" rightTextFont="22" rightTextColor="#999999" />
			<uni-list-item title="网点类型" @tap="toggleTab('selector', 'wangtype')" :rightText="channelClass.kHChannelValue" rightTextFont="22" rightTextColor="#999999" />
			<uni-list-item title="所属区域" :rightText="keHuClass.quyu" rightTextFont="22" rightTextColor="#999999" />
			<uni-list-item title="网点/门店等级" :rightText="keHuClass.quyu" rightTextFont="22" rightTextColor="#999999" @tap="actionSheetTap" />
			<uni-list-item title="行政区划" :rightText="keHuClass.quyu" rightTextFont="22" rightTextColor="#999999" />
		</uni-list>
	</view>
</template>

<script>
	import uniSection from '@/components/uni/uni-section/uni-section.vue';
	import uniList from '@/components/uni/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni/uni-list-item/uni-list-item.vue';
	// import uniCard from '@/components/uni/uni-card/uni-card.vue';
	export default{
			
		components:{
			uniSection,
			uniList,
			uniListItem
		}
	}
</script>

<style>
</style>
