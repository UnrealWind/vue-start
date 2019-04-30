<template>
  <tk-container class="shop">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      {{shop.shopName}}
    </tkui-header>

    <tkui-list v-if="shop.user && shop.user.objectId &&commodity && commodity.length>0">
      <tkui-list-item divider v-for="opt in commodity" >
        <img slot="left" v-bind:src="opt.tagImg" class="avatar" />
        <div class="content"  v-on:click="goCommodityPage(opt)">
          <div class="title">{{opt.modelName}}</div>
          <div class="des">{{opt.configInfo}}</div>
          <div class="price">¥{{opt.price}}</div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <tkui-list v-else>
      <tkui-list-item divider >
        <div class="content">
          <div class="title">没有查询到数据！请重试！</div>
        </div>
      </tkui-list-item>
    </tkui-list>

  </tk-container>
</template>

<script>
export default {
  name: 'shop_detail',
  layout: 'shop_detail',
  data: function() {
    return {
      shop:{},
      commodity:[],
    }
  },
  mounted:function(){
    var that = this;
    this.shop = this.$getFlash('flash').shop;
    console.log(this.shop);
    (async () => {
      let res = await this.$tkParse.get('/classes/model',{
        params: {  // url参数
          //include: 'user',
          where:{
            user:this.shop.user.objectId
          }
        }
      });
      this.commodity = res.data.results;
      console.log(this.commodity,this.shop )
    })();
  },
  methods:{
    back:function(){
      this.$back();
    },
    goCommodityPage:function(opt){
      this.$setFlash('flash',{
        commodity:opt,
        shop:this.shop
      });
      this.$push('/commodity-detail');
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
    .title {
      margin-bottom: 16px;
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
        }
      }
    }
  }

</style>
