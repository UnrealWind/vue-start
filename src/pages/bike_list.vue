<template>
  <tk-container class="shop">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon>me1</tk-icon>
      </tkui-button>
      库存列表
    </tkui-header>

    <tkui-list v-if=" shop && shop.objectId && commodity && commodity.length>0">
      <tkui-list-item divider v-if="opt.active" v-for="(opt,index) in brands">
        <img slot="left" v-bind:src="opt.logo" class="avatar" />
        <div class="content"  v-on:click="goBikeBrand(opt)">
          <div class="title">{{opt.name}}</div>
          <div class="des"><span v-for="(info,index) in opt.options"><span v-if="index != 0">、</span>{{info.modelName}}</span></div>
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

    <div @click="newBike()" class="circle-btn">+</div>

  </tk-container>
</template>

<script>
  export default {
    name: 'bike_list',
    layout: 'bike_list',
    data: function() {
      return {
        shop:{},
        commodity:[],
        brands:[]
      }
    },
    mounted:function(){
      var that = this;
      this.shop = this.$store.state.user;

      let re = (arr1,arr2)=>{
        arr1.forEach((ni,ii)=>{
          ni['active'] = false;
          ni['options'] = [];
          arr2.forEach((n,i)=>{
            n.brand.indexOf(ni.name)>-1?(ni.options.push(n),ni.active = true):'';
          })
        })
      };

      //fydebug@20190430这里业务逻辑和我自己想的不一样
      //this.brands = JSON.parse(JSON.stringify(this.$getFlash('flash').brands))
      (async () => {
        let res1 = await this.$tkParse.get('/classes/brand', {
          params: {  // url参数

          },
        });
        this.brands = res1.data.results

        //昂，这一页和之前商品列表是差不多的，再次验证了一下查询逻辑，之前的就先不改了
        let res2 = await this.$tkParse.get('/classes/model',{
          params: {  // url参数
            where:{
              user:this.shop.objectId
            }
          }
        });
        this.commodity = res2.data.results;
        re(this.brands,this.commodity)
      })();
    },
    methods:{
      back:function(){
        this.$push('/merchant-index');
      },
      goBikeBrand:function(opt){
        this.$setFlash('flash',{
          shop:this.userInfo,
          brands:this.brands
        });
        this.$push('/bike-brand');
      },
      newBike:function(opt){
        this.$push({
          path:'/new-bike',
          flash:{
            flash:{
              shop:this.userInfo,
              brands:this.brands
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
