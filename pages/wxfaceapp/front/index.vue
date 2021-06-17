<template>
<view>
	<view class="content">
		<heads/>
		<item/>
        <foots/>
	</view>
</view>
</template>

<script>
	import heads from './heads.vue'
	import item from './item.vue'
	import foots from './foots.vue'
	export default {
		components: { 
			heads,
			item,
			foots,
		},
		computed: {
		},
		data() {
			return {
				x:"300",
				y:"1800",
			}
		},
		mounted() {
			this.$store.dispatch('data/load') // 数据加载
			this.$store.dispatch('wxfaceapp/listenCodePayment') // 扫码枪监听
			
		},
		methods:{
		}
	}
</script>

<style lang="scss" scoped>
	body {
        background-color: hsl(220, 13%, 18%); 
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}
</style>
