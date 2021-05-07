<template>
<view>
	<view>
		<view class="content">
			<view class="text-area-branch">
				<text class="title">测试</text>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import {  mapGetters } from 'vuex'
	export default {
		components: { 
		},	
		computed: {
		...mapGetters([
			'roles',
			]),
		},
		data() {
			return {
			}
		},
		mounted() {
		},
		methods:{
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.text-area-branch {
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
