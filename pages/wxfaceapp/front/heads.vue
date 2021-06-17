<template>
	<view class="header">
        <span class="title">收银台</span>
	</view>
</template>

<script>
	export default {
		components: { 
		},
		data() {
			return {
                order:{
                }
			}
		},
		created() {
		},
		methods: {
            empty(){
                console.log(123456);
            }
		},
		destroyed() {
		}
	}
</script>

<style lang="scss" scoped>
    .header{
        width: 100vw;
        height: 5vh;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid #ebeef5;
        background-color: hsl(220, 13%, 18%); 
        .title{
            color: #ffffff;
            font-size: 5vw;
            font-weight: 900;
            margin-left: 3vw;
            line-height:200%;
        }
        .center{
        }
    }
</style>