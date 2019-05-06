<template>
  <tk-container class="commodity">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      商品详情
    </tkui-header>
    <tk-image height="0" width="0" :src="commodity.tagImg"  style="height:375px;" ></tk-image>
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
        <span @click="calculation('-1')">-</span>
        <span>{{quantity}}</span>
        <span @click="calculation('1')">+</span>
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
      <tkui-button raised primary @click="addin()">加入购物车</tkui-button>
    </div>
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
        this.$tkGlobal.toast.add('已经添加进购物车！');

      })():this.$tkGlobal.toast.add('购买数量不能为0！');
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
      padding: 5px 0 0 0;
    }
    .des-min {
      font-size:4px;
      padding: 8px 0 0 0;
      color:#aaa;
    }
  }
  
  .buy {
    padding:16px;
    overflow: hidden;
    margin-top:9px;
    .left {
      float:left;
      width:20%;
      h4 {
        font-size:9px;
        color:#aaa;
        font-weight:300;
      }
    }
    .middle {
      float:left;
      padding:0 16px;
      font-size:8px;
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
        width:24px;
        height:24px;
        background-color: #eee;
        padding: 2px;
        text-align: center;
        font-size:18px;
      }
      span:nth-child(2) {
        background: #fff;
        font-size:13px;
      }
    }
  }
  .fix-footer-addin {
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height:50px;
    margin-top:16px;
    position:fixed;
    .left{
      padding:16px;
      color:red;
      float:left;
      font-size:18px;
      span {
        font-size:8px;
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
