<template>
<view>
	<view class="content">
        back
		<item/>
        <foots/>
	</view>
</view>
</template>

<script>
	import item from '@/pages/wxfaceapp/front/item.vue'
	import foots from '@/pages/wxfaceapp/front/foots.vue'
	export default {
		components: { 
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
			this.$store.dispatch('wxfaceapp/listenCodePayment', this.$u.api)
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
