<template>
  <tk-container  class="index">
      <tkui-header center>
        <tkui-button  @click="goCityChose()" slot="left" class="icon">
          <tk-icon>Positioning</tk-icon>
        </tkui-button>
        <span slot="left" class="city">{{city}}</span>
        <tkui-search-input v-model="search" place-holder="输入搜索内容" class="fill"></tkui-search-input>
        <div slot="right">
          <tkui-button @click="scan" class="icon">
            <tk-icon>Scan</tk-icon>
          </tkui-button>
        </div>
      </tkui-header>

      <tk-slider loop autoPlay>
        <div class="slider-item" v-for="image, index in imgs" :key="index">
          <tk-image style="width: 100%;" :src="image.image" width="1200" height="600"></tk-image>
        </div>
      </tk-slider>

      <tk-image height="50" :src="speImg"></tk-image>

      <tkui-list>
        <tkui-list-item divider v-for="opt in shop" v-if="opt && opt.shopName.indexOf(search)>-1">
          <img slot="left" v-bind:src="opt.storePhoto" class="avatar" />
          <div class="content" v-on:click="goShopPage(opt)">
            <div class="title">{{opt.shopName}}
              <span class="pull-right">距离：{{opt.position}}km</span>
            </div>
            <div class="des">{{opt.txtLocation}}</div>
            <div class="btn-box">
              <span v-for="tagBrand in opt.user.mainBrand">
              <tkui-button raised rounded primary small disabled v-for="brand in brands" v-if="tagBrand == brand.objectId">{{brand.name}}</tkui-button>
            </span>
            </div>
          </div>
        </tkui-list-item>
      </tkui-list>
      <tk-scaner ref="scaner" :filter="checkResult" color="color"></tk-scaner>
      <tk-toast ref="toast"></tk-toast>
  </tk-container>
</template>

<script>
export default {
  name: 'home',
  layout: 'home',
  data: function() {
    return {
      imgs:[],
      shop:[],
      speImg:'http://moke-store.oss-cn-beijing.aliyuncs.com/b6813a52-5db9-4c65-a8af-60f41e9d15af.png',
      brands:[],
      mapShow:true,
      city:'加载中',
      position:{},
      location:[],
      search:'',
      column: true,
      wrap: false,
      left: false,
      center: true,
      right: false,
      top: false,
      middle: true,
      bottom: false,
      baseline: false,
      average: false,
      wrapGutter: false,
      between: false,
      around: false,
      stretch: true,
      gutter: '8'
    }
  },
  mounted:function(){
    this.getLocal().then(()=>{
      this.init();
    });
  },
  methods:{
    init:function(){
      let that = this;
      //这里拿到了所有数据然后在模板上进行匹配的，感觉可能是我这个查询用的有问题
      // 这里获取数据可以放在一个 async里进行，
      (async () => {
        let res = await this.$tkParse.get('/classes/slider', {});
        this.imgs = res.data.results;
      })();
      (async () => {
        let res = await this.$tkParse.get('/classes/brand', {
           params: {  // url参数
             include: 'user',
           }
        });
      })();
      (async () => {
        let res = await this.$tkParse.get('/classes/shop', {
          params: {
            include: 'user',
            where:{
             // objectId: this.$store.state.user.objectId
            }
          }
        })
        this.shop = res.data.results;
        //获取数据的时候算一下距离
        this.shop.forEach((n,i)=>{
          n['position'] = that.getPosition([n.location.latitude,n.location.longitude])
        })

        this.shop.sort(function(a,b){
          return a.position-b.position});
      })();
    },
    goShopPage:function(opt){
      this.$setFlash('flash',{
        shop:opt
      });
      this.$push('/shop-detail');
    },
    checkResult(result) {
      // 对result进行判断，当返回true时,扫码成功，扫描器关闭
      this.$refs.scaner.close();
      result?(async()=>{
        this.$push('/cart-detail');
        this.$setFlash('flash',{
          cart_objectId:result,
        });
      })():this.$refs.toast.add('扫码失败！请重试');


    },
    async scan() {
      // scanResult 为成功扫描后返回的数据
      let scanResult = await this.$refs.scaner.scan()
        .catch(e => {
          console.log(e.type) // 错误类型, cancel 代表用户主动取消扫码， error代表其他错误
          console.log(e.message) // 错误说明
        })
      /*this.$push('/cart-detail');
      this.$setFlash('flash',{
        cart_objectId:scanResult,
      });*/
    },
    async getLocal(){

      //不知道为啥定唐县了,这个api用法应该是这样的
        let position = await this.$tkGeolocation.getCurrentPosition({
          parse:true,
        })
        this.city = position.name;
        this.location = [position.latitude,position.longitude];
    },
    getPosition:function(posi1){
      var that = this;
      function distance( lat1,  lng1,  lat2,  lng2){
        var radLat1 = lat1*Math.PI / 180.0;
        var radLat2 = lat2*Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
          Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 100) / 100;
        return s;
      };

      return (function(){
        return distance(posi1[0],posi1[1],that.location[0],that.location[1])
      })();

    },
    goCityChose(){
      this.$push({
        path: 'city-chose',
          flash: {
          targetCity: this.city
        }
      })
    },
    showMap:function(){

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
        .btn-box {
          margin-top:0.3rem;
          .tkui-button.small {
            width: auto;
            min-width:auto;
            height: auto;
            background-color: rgba(1, 144, 255, 0.3) !important; /*原生上有这个important无法通过权重去除*/
            border-radius: 8px;
            font-size:0.5rem;
            margin-left:0;
            color: rgba(1, 144, 255, 1) !important;
          }
        }
      }
    }
  }

  .city {
    /*display: inline-flex;*/
    font-size:0.8rem;
    width:3rem;
    position:absolute;
    top:1rem;
    left:3rem;
  }

</style>
