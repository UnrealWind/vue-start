<template>
  <tk-container class="shop">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      车型列表
    </tkui-header>

    <tkui-list v-if="shop && shop.objectId && commodity && commodity.length>0">
      <span @click="goNewBike(opt)" v-for="opt in commodity">
        <tkui-list-item  divider >
        <img slot="left" v-bind:src="opt.tagImg" class="avatar" />
        <div class="content" >
          <div class="title">{{opt.modelName}}</div>
          <div class="des">{{opt.configInfo}}</div>
          <div class="price">¥{{opt.price}}</div>
        </div>
      </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-list v-else>
      <tkui-list-item divider >
        <div class="content">
          <div class="title">没有查询到数据！请重试！</div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <div @click="newBike()" class="circle-btn">+</div>

  </tk-container>
</template>

<script>
  export default {
    name: 'bike-brand',
    layout: 'bike-brand',
    data: function() {
      return {
        shop:{},
        commodity:[],
        brand:null
      }
    },
    mounted:function(){
      var that = this;
      this.shop = this.$store.state.user;
      this.brand = this.$getFlash('flash').brand;
      console.log(this.brand);
      //昂，这一页和之前商品列表是差不多的，再次验证了一下查询逻辑，之前的就先不改了
      (async () => {
        let res = await this.$tkParse.get('/classes/model',{
          params: {  // url参数
           where:{
              user:this.shop.objectId,
              brand:this.brand.objectId,
            }
          }
        });
        this.commodity = res.data.results;
        console.log(this.commodity)
      })();
    },
    methods:{
      back:function(){
        this.$setFlash('flash',{
          shop:this.userInfo,
          brands:this.$getFlash('flash').brands
        });
        this.$back();
      },
      newBike:function(opt){
        this.$push({
          path:'/new-bike',
          flash:{
            flash:{
              shop:this.userInfo,
              brands:this.$getFlash('flash').brands
            }
          }
        });
      },
      goNewBike:function(opt){
        this.$push({
          path:'/new-bike',
          flash:{
            flash:{
              bike:opt,
              brands:this.$getFlash('flash').brands
            }
          }
        });
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

  .circle-btn {
    height:60px;
    width:60px;
    border-radius:30px;
    position:fixed;
    bottom:1rem;
    right:1rem;
    font-size:3rem;
    border:1px solid #ccc;
    text-align:center;
    background:rgba(0, 145, 255, 1);
    color:#fff;
    z-index:999;
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
