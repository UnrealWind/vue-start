<template>
  <div class="fix-footer-addin">
    <div class="left">
      <h4>
        <span>合计：¥</span>{{totalPrice}}
      </h4>
    </div>

    <!--这里测测这个参数能不能过去-->
    <tkui-button raised primary @click="$emit('chopHand','true')">立即购买</tkui-button>
  </div>
</template>

<script>
  export default {
    name:'footer-addin',
    data: function () {
      return {

      }
    },
    props:{
      totalPrice: Number,
      chopHand: Function
    },
  }
</script>

<style lang="scss" scoped>
  .fix-footer-addin {
    background-color: #fff;
    width: 100%;
    height:50px;
    margin-top:16px;
    .left{
      padding:16px;
      color:red;
      float:left;
      font-size:18px;
      span {
        font-size:12px;
      }
    }
    .tkui-button {
      float: right;
      margin:0;
      border-radius:0;
      height: 100%;
    }
  }
</style>
