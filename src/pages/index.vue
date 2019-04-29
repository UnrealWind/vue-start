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
      <tkui-list-item divider v-for="opt in shop" v-if="opt.shopName.indexOf(search)>-1">
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
    <div v-if="mapShow" id="container" style="width:500px; height:300px;display:none;"></div>
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
      center:[],
      search:''
    }
  },
  mounted:function(){
    this.getLocal();
    this.init();
  },
  methods:{
    init:function(){
      let that = this;
      //这里拿到了所有数据然后在模板上进行匹配的，感觉可能是我这个查询用的有问题
      (async () => {
        let res = await this.$tkParse.get('/classes/slider', {});
        this.imgs = res.data.results;
      })();
      (async () => {
        let res = await this.$tkParse.get('/classes/brand', {
          /* params: {  // url参数
             include: 'user',
           }*/
        });
        this.brands = res.data.results;
      })();
      (async () => {
        let res = await this.$tkParse.get('/classes/shop', {
          params: {  // url参数
            include: 'user', // 如果有多个关联都需要查询，用英文逗号分隔,例如：'pointer1,pointer2'
          }
        })
        this.shop = res.data.results;

        //获取数据的时候算一下距离
        this.shop.forEach((n,i)=>{
          n['position'] = that.getPosition([n.location.latitude,n.location.longitude])
        })
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
    },
    async scan() {
      // scanResult 为成功扫描后返回的数据
      let scanResult = await this.$refs.scaner.scan()
        .catch(e => {
          console.log(e.type) // 错误类型, cancel 代表用户主动取消扫码， error代表其他错误
          console.log(e.message) // 错误说明
        })
    },
    getLocal:function(){
      let that = this;
      var map = new AMap.Map('container', {
        resizeEnable: true
      });

      var options = {
        'showButton': true,//是否显示定位按钮
        'buttonPosition': 'LB',//定位按钮的位置
        /* LT LB RT RB */
        'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
        'showMarker': true,//是否显示定位点
        'markerOptions':{//自定义定位点样式，同Marker的Options
          'offset': new AMap.Pixel(-18, -36),
          'content':'<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
        },
        'showCircle': true,//是否显示定位精度圈
        'circleOptions': {//定位精度圈的样式
          'strokeColor': '#0093FF',
          'noSelect': true,
          'strokeOpacity': 0.5,
          'strokeWeight': 1,
          'fillColor': '#02B0FF',
          'fillOpacity': 0.25
        }
      }

      AMap.plugin(["AMap.Geolocation","AMap.CitySearch"], function() {
        var geolocation = new AMap.Geolocation(options);
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){

          //精确定位炸了，昨天还能用   fydebug@20190426
          if(status=='complete'){
            //onComplete(result)
          }else{
            //onError(result)
          }
        });
      });

      (function showCityInfo() {

        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
              var cityinfo = result.city;
              var citybounds = result.bounds;

              //用的城市定位，这里的话 如果是城市选择页过来的就带上城市选择页面的数据,
              that.$getFlash('city')? this.city = this.$getFlash('city').cityName:(()=>{
                that.city = cityinfo;
                that.center[0] = (result.bounds.Kb.lat+result.bounds.Rb.lat)/2;
                that.center[1] = (result.bounds.Kb.lng+result.bounds.Rb.lng)/2
              })();
              //地图显示当前城市
              map.setBounds(citybounds);
            }
          } else {
            //code
          }
        });
      })();
    },
    getPosition:function(posi1){
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
        return distance(posi1[0],posi1[1],(37.86302147+38.22308595)/2,(114.2195964+114.7912716)/2)
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
    font-size:0.5rem;
    width:3rem;
    position:absolute;
    top:1rem;
    left:3rem;
  }

</style>
