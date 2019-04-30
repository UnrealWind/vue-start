<template>
  <tk-container :status="status">
    <tkui-header center>购物车</tkui-header>
    <tkui-list v-for="(commoditys, shopId) in cart">
      <div class="list-header">
        <h2>{{commoditys[0].shop.shopName}}</h2>
      </div>
      <tkui-list-item disableHover divider v-for="commodity in commoditys">
        <img slot="left" v-bind:src="commodity.tagImg" class="avatar" />
        <div class="content" >
          <div class="title">{{commodity.modelName}}</div>
          <div class="des">{{commodity.configInfo}}</div>
          <div class="price">¥{{commodity.price}}
            <div class="right">
              <span v-on:click="calculation('-1',commodity)">-</span>
              <span>{{commodity.quantity}}</span>
              <span v-on:click="calculation('1',commodity)">+</span>
            </div>
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>
    <tkui-list v-if="JSON.stringify(cart)=='{}'">
      <tkui-list-item divider >
        <div class="content">
          <div class="title">请添加商品到购物车中！</div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <div class="fix-footer-addin">
      <div class="left">
        <h4>
          <span>合计：¥</span>{{totalPrice}}
        </h4>
      </div>
      <tkui-button raised primary v-on:click="chopHand()">立即购买</tkui-button>
    </div>
    <tk-toast ref="toast"></tk-toast>
  </tk-container>
</template>

<script>
export default {
  name: 'cart',
  layout: 'home',
  data: function() {
    return {
      cart:[],
      totalPrice:0,
      //waiting - 加载中  loading-  empty-
      status:'loading'
    }
  },
  activated:function(){
    (async () => {
      this.cart = JSON.parse(JSON.stringify(this.$store.state.cart));
      this.calculationPrice();
      Object.keys(this.cart).length > 0?this.status = false:this.status = 'empty';
    })();
  },
  mounted:function(){

  },
  methods:{
    chopHand:function(){
      if(JSON.stringify(this.cart)=='{}'){
        this.$refs.toast.add('请先添加商品到购物车内！');
        return false
      };
      (async () => {
        let detail = [];

        //做一下详情数据
        for(var i in this.cart){
          this.cart[i].forEach((n,i)=>{
            detail.push({
              shop:{
                shopName:n.shop.shopName,
                objectId:n.shop.objectId
              },
              price:n.price,
              tagimg:n.tagImg,
              modelName:n.modelName,
              configInfo:n.configInfo
            })
          })
        }
        let res = await this.$tkParse.post('/classes/order', {
          user:this.$store.state.user.objectId,
          detail:detail,
          status:'unpaid',
          totalFee:this.totalPrice
        })
        this.$push('/cart-detail');
        this.$setFlash('flash',{
          cart_objectId:res.data.objectId,
        });
        this.$store.commit('resetCart',{});
      })();
    },
    calculationPrice:function(){
      for(var i in this.cart){
        this.cart[i].forEach((n,i)=>{
          this.totalPrice += n.price*n.quantity;
        })
      }
    },
    calculation:function(num,commodity){
      if(commodity.quantity == 0 && Number(num)=='-1') return;
      commodity.quantity += Number(num);
      this.totalPrice += Number(num)*commodity.price;
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
      }
    }
  }

  .fix-footer-addin {
    background-color: #fff;
    width: 100%;
    height:3rem;
    margin-top:1rem;
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

