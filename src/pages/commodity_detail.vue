<template>
  <tk-container class="commodity">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      商品详情
    </tkui-header>
    <tk-image height="0" width="0" :src="commodity.tagImg"  style="width: 100%;height:375px;" ></tk-image>
    <div class="commodity-des">
      <h3>¥{{commodity.price}}</h3>
      <div class="des">{{commodity.modelName}}</div>
      <div class="des-min">最近上新</div>
    </div>
    <div class="buy">
      <div class="left">
        <h4>购买数量</h4>
      </div>
      <div class="right">
        <span v-on:click="calculation('-1')">-</span>
        <span>{{quantity}}</span>
        <span v-on:click="calculation('1')">+</span>
      </div>
    </div>
    <div class="buy">
      <div class="left">
        <h4>商品说明</h4>
      </div>
      <div class="middle">
        <p>{{commodity.configInfo}}</p>
      </div>
    </div>

    <div class="fix-footer-addin">
      <div class="left">
        <h4>
          <span>合计：¥</span>{{commodity.price*quantity}}
        </h4>
      </div>
      <tkui-button raised primary v-on:click="addin()">加入购物车</tkui-button>
    </div>
    <tk-toast ref="toast"></tk-toast>
  </tk-container>
</template>

<script>
export default {
  name: 'commodity_detail',
  layout: 'commodity_detail',
  data: function() {
    return {
      commodity:{},
      quantity:1,
      shop:{}
    }
  },
  mounted:function(){
    var that = this;
    this.commodity = this.$getFlash('flash').commodity;
    this.shop = this.$getFlash('flash').shop;
  },
  methods:{
    back:function(){
      this.$setFlash('flash',{
        commodity:this.commodity,
        shop:this.$getFlash('flash').shop
      });
      this.$back();
    },
    calculation:function(num){
      if(this.quantity == 0 && Number(num)=='-1') return;
      this.quantity += Number(num);
    },
    addin:function(){
      this.quantity>0?(async()=>{
        /*
          本来以为有购物车表的，后来发现没有，就存缓存吧
          这里想了一下是在加载这个页面的时候去回溯这份数据，但是觉得这样子过于频繁的操作store了，就改成在store合并这份数据了
        let res = await this.$tkParse.put('/classes/order/detail', [

        ]);
        res.status == '201'?this.$refs.toast.add('已经添加进购物车！'):this.$refs.toast.add('添加失败请重试！')

        */
        this.commodity['quantity'] = this.quantity;
        this.commodity['shop'] = this.shop;
        this.$store.commit('setCart',this.commodity);
        this.$refs.toast.add('已经添加进购物车！');

      })():this.$refs.toast.add('购买数量不能为0！');
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 80px;
    height: 80px;
    margin-right: 16px;
  }

  .content {
    padding: 16px 16px 16px 0;
    background: #ddd;
    .title {
      margin-bottom: 16px;
    }

  }
  .scroll-content >div {
    background-color: #fff;
  }
  .commodity-des {
    padding:1rem;
    h3,div {
      text-align:left;
    }
    h3 {
      color:red;
    }
    .des {
      font-weight:600;
      padding: 0.3rem 0 0 0;
    }
    .des-min {
      font-size:0.2rem;
      padding: 0.6rem 0 0 0;
      color:#aaa;
    }
  }
  
  .buy {
    padding:1rem;
    overflow: hidden;
    margin-top:0.6rem;
    .left {
      float:left;
      width:20%;
      h4 {
        font-size:0.6rem;
        color:#aaa;
        font-weight:300;
      }
    }
    .middle {
      float:left;
      padding:0 1rem;
      font-size:0.5rem;
      color:#aaa;
      width: 80%;
      p {
        word-wrap:break-word;
      }
    }
    .right{
      float:right;
      span {
        display: inline-block;
        width:1.5rem;
        height:1.5rem;
        background-color: #eee;
        padding: 0.1rem;
        text-align: center;
        font-size:1.2rem;
      }
      span:nth-child(2) {
        background: #fff;
        font-size:0.8rem;
      }
    }
  }
  .fix-footer-addin {
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height:3rem;
    margin-top:1rem;
    position:fixed;
    .left{
      padding:1rem;
      color:red;
      float:left;
      font-size:1.2rem;
      span {
        font-size:0.5rem;
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
