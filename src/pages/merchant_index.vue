<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>商家主页
    </tkui-header>

    <tkui-list>
      <span @click="goBrandDetail()">
        <tkui-list-item>
        主营品牌
        <span slot="right">
          <span v-for="(brand,index) in userInfo.mainBrand"><span v-if="index !== 0">、</span>
            <span v-for="(opt,index) in mainBrand" v-if="opt.objectId == brand">{{opt.name}}</span>
          </span>
        </span>
        <tk-icon color="#666" slot="right">return1</tk-icon>
      </tkui-list-item>
      </span>
      <span @click="goChangePassword()">
        <tkui-list-item>
          修改密码
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-list>
      <!--<span @click="gobikeList()">
        <tkui-list-item>
          库存品牌
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>-->
      <span @click="goShopAddress()">
        <tkui-list-item>
          我的店铺
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-button @click="logout()" class="special" raised big block border>退出登录</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'merchant-index',
  layout: 'merchant-index',
  data: function() {
    return {
      userInfo:{},
      mainBrand:[]
    }
  },
  activated:function(){

  },
  mounted:function(){
    this.userInfo = this.$store.state.user;
    (async () => {
      let res = await this.$tkParse.get('/classes/brand', {
        params: {  // url参数

        },
      });
      this.mainBrand = res.data.results
    })();
  },
  methods:{
    logout:function(){
      this.$replace('/login');
    },
    goBrandDetail:function(n,i){
      let brand = this.getBrands();
      console.log(this.mainBrand,this.userInfo.mainBrand)
      this.$push({
        path:'/brand-detail',
        flash:{
          flash:{
            brands:brand
          }
        }
      });
    },
    goChangePassword:function (){
      this.$push({
        path:'/change-password',
        flash:{

        }
      });
    },
    goShopAddress:function(){
      this.$push({
        path:'/shop-address',
        flash:{

        }
      });
    },
    gobikeList:function(){
      this.$push({
        path:'/bike-list',
        flash:{
          flash:{
            shop:this.userInfo,
            brands:this.mainBrand
          }
        }
      });
    },
    getBrands:function(){
      let brand = JSON.parse(JSON.stringify(this.mainBrand));
      brand.forEach((n,i)=>{
        this.userInfo.mainBrand.forEach((ni,ii)=>{
          !n['active']?n['active'] = false:'';
          ni == n.objectId ? n['active'] = true:'';
        })
      })
      return brand;
    },
    back:function(){
      this.$back();
    }
  }
}
</script>

<style lang="scss" scoped>
  .tkui-button.special {
    margin-top:3rem;
    background-color: #fff;
    color:red;
  }

  .tkui-list-item {
    .right>span {
      max-width:200px;
      display:inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>
