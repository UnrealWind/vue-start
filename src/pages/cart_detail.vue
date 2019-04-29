<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>订单详情
    </tkui-header>
    <tkui-header class="status" style="">
      <tkui-button slot="left" class="icon">
        <tk-icon color="#fff">Paid1</tk-icon>
      </tkui-button>
      {{paidStatus}}
    </tkui-header>
    <tkui-list v-for="(commoditys, shopId) in cart">
      <div class="list-header">
        <h2>{{commoditys[0].shop.shopName}}</h2>
      </div>
      <tkui-list-item disableHover divider v-for="commodity in commoditys">
        <img slot="left" v-bind:src="commodity.tagimg" class="avatar" />
        <div class="content" >
          <div class="title">{{commodity.modelName}}</div>
          <div class="des">{{commodity.configInfo}}</div>
          <div class="price gray">共{{commodity.quantity}}件商品，实付款：¥{{commodity.price}}
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>
    <tk-flex wrap class="qrcode">
      <div class="item tk-grid-3"><h4>订单码</h4></div>
      <div class="item tk-grid-9"><tk-qrcode value="宝宝贝~~~"></tk-qrcode></div>
      <div class="item tk-grid-3"><h4>合计实付款：</h4></div>
      <div class="item tk-grid-9 red">¥{{totalPrice}}</div>
    </tk-flex>
  </tk-container>
</template>

<script>
export default {
  name: 'cart-detail',
  layout: 'cart-detail',
  data: function() {
    return {
      cart:{},
      totalPrice:0,
      paidStatus:''
    }
  },
  activated:function(){

  },
  mounted:function(){
    var that = this;
    (async () => {
      let res = await this.$tkParse.get('/classes/order',{
        params: {  // url参数
          where:{
            objectId:this.$getFlash('flash').cart_objectId
          }
        }
      });

      //适配器
      res.data.results.forEach((n,i)=>{
        n.detail.forEach((ni,yi)=>{
          !that.cart[ni.shop.objectId]?that.cart[ni.shop.objectId] = [ni]:that.cart[ni.shop.objectId].push(ni);
        })
      });

      switch (res.data.results[0].status){
        case 'unpaid':this.paidStatus = '未付款';break;
        case 'complete':this.paidStatus = '已完成';break;
        case 'close':this.paidStatus = '已关闭';break;
      }

      this.totalPrice = res.data.results[0].totalFee;
    })();
  },
  methods:{
    calculationPrice:function(){
      for(var i in this.cart){
        this.cart[i].forEach((n,i)=>{
          this.totalPrice += n.price*n.quantity;
        })
      }
    },
    back:function(){
      this.$replace('/');
    },
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
    .title {
      margin-bottom: 16px;
    }
  }

  .list-header {
    padding: 0 1rem;
    font-size: 0.8rem;
    margin-top:1rem;
    h2 {
      padding: 0.5rem 0;
    }
  }

  .tkui-list-item {
    padding:0.3rem 1rem;
    .list-item-content {
      .content {
        padding: 0.3rem;
        text-align:left;
        width:100%;
        .title {
          margin-bottom:0.3rem;
          .pull-right {
            float:right;
            display: block;
            font-size:0.5rem;
            font-weight:300;
          }
        }
        .des {
          font-size:0.75rem;
          color:#aaa;
        }
        .price {
          color:red;
          margin-top:0.3rem;
          .right{
            float:right;
            border:0;
            span {
              display: inline-block;
              width:1.5rem;
              height:1.5rem;
              background-color: #eee;
              padding: 0.1rem;
              text-align: center;
              font-size:1.2rem;
              color:#666;
            }
            span:nth-child(2) {
              background: #fff;
              font-size:0.8rem;
            }
          }
        }
        .gray {
          font-size:0.8rem !important;
          color:#666;
          margin-top:0.3rem;
        }
      }
    }
  }
  .qrcode {
    padding: 1rem;
    background: #fff;
    margin-top:1rem;
    h4  {
      padding-top:0.5rem;
      font-size:0.9rem;
      font-weight:300;
      color:#666;
    }
    .red {
      padding-top:0.5rem;
      color:red;
      font-size:1.2rem;
    }
  }

  .status {
    background-image: url(http://moke-store.oss-cn-beijing.aliyuncs.com/64df0cb9-a4fd-458a-a486-91a7aaebd105.png);
    height:60px;
    color:#fff;
  }
</style>

