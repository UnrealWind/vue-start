<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      我的店铺
    </tkui-header>

    <tkui-list>
      <tkui-input v-model="shopName" label="店铺名称" wrapLabel placeHolder="请填写店铺名称"></tkui-input>
    </tkui-list>
    <tkui-list>
      <div class="tkui-input-container">
        <div class="tkui-input-body-warp wrap-label">
          <label class="tkui-label">店铺照片</label>
          <div class="tkui-input-body">

           <tk-flex class="img-wrap" middle center @click.native="pick">
              <div class="md-subheading" v-if="!file || !file.url">拍照上传</div>
              <img v-else class="tiny-img" :src="file.url" />
            </tk-flex>
          </div>
        </div>
      </div>
    </tkui-list>

    <tkui-list>
      <div class="tkui-input-container">
        <div class="tkui-input-body-warp wrap-label">
          <label class="tkui-label">详细地址</label>
          <input id="tipinput" v-model="address"   placeHolder="请填写详细地址"></input>
          <div class="tkui-input-body">
            <div v-if="mapShow" id="container" style="width:400px; height:300px;"></div>
          </div>
        </div>
      </div>
    </tkui-list>

    <tk-toast ref="toast"></tk-toast>
    <tkui-button @click="save()" primary raised big block border>保存</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'shop-address',
  layout: 'shop-address',
  data: function() {
    return {
      type: 'image',
      from: 'camera',
      file: {
        url:null
      },
      mapShow:true,
      shopName:'',
      address:'',
      location:{},
      shopId:''
    }
  },
  activated:function(){

  },
  mounted:function(){

    //我记得当初我这样查询过并没能查到单条数据，所以之前的页面使用objectid自己匹配的，这次试了一下居然直接能查出来，有点迷
    //前面的就不改了，
    (async()=>{
      let res = await this.$tkParse.get('/classes/shop',{
        params:{
          where:{
            user:this.$store.state.user.objectId
          }
        }
      })
      res.status == '200' && res.data.results.length>0?(async()=>{
        this.shopName = res.data.results[0].shopName;
        this.location = res.data.results[0].location;
        this.address = res.data.results[0].txtLocation;
        !this.file.url?this.file['url'] = res.data.results[0].storePhoto:'';
        this.shopId = res.data.results[0].objectId;
      })():''
      this.init();
    })();

  },
  computed: {
    isImage() {
     // return this.file && /image/.test(this.file.url)
    }
  },
  methods:{
    save:function(){
      let url,method;
      this.shopId? (url= '/classes/shop/'+this.shopId,method = 'put'):(url = '/classes/shop',method='post');
      !this.location || !this.location.latitude ?
        this.$refs.toast.add('请在地图上选择您的店铺位置！'):
        (async()=>{
          let res = await this.$tkParse[method](url,{
            user:this.$store.state.user.objectId,
            location:this.location,
            shopName:this.shopName,
            storePhoto:this.file.url,
            txtLocation:this.address,
          })
          res.status == '200' ||  res.status == '201'?(this.$refs.toast.add('店铺修改成功！'),this.shopId = res.data.objectId):'';
       })();
    },
    init:function(){
      var that = this;

      var map = new AMap.Map("container", {
        resizeEnable: true,
        zoom:13
      });
      this.location.latitude?(()=>{
          var markers = [{
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png',
            position: [this.location.longitude,this.location.latitude]
          }];
          markers.forEach(function(marker) {
            new AMap.Marker({
              map: map,
              icon: marker.icon,
              position: [marker.position[0], marker.position[1]],
              offset: new AMap.Pixel(-13, -30)
            });
          });
        })():'';

      //为地图注册click事件获取鼠标点击出的经纬度坐标
      map.on('click', function(e) {
        //!e.lnglat?that.$refs.toast.add('请选择更详细的的地址！'):that.$refs.toast.add('定位成功');
        that.location = {
          __type: "GeoPoint",
          latitude:e.lnglat.lat,
          longitude:e.lnglat.lng
        };

        var markers = [{
          icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png',
          position: [ e.lnglat.lng,e.lnglat.lat]
        }];
        map.clearMap();
        markers.forEach(function(marker) {
          new AMap.Marker({
            map: map,
            icon: marker.icon,
            position: [marker.position[0], marker.position[1]],
            offset: new AMap.Pixel(-13, -30)
          });
        });

      });
    },
    back:function(){
      this.$back();
    },
    pick() {
      this.$tkFile.pick({
        type: this.type,
        from: this.from
      })
        .then(file => {
          (async()=>{
            let res1 = await this.$tkParse.post('/files',file.buffer);
            this.file = res1.data;
          })();

        })
        .catch(e => {
          window.alert(e.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tkui-input-container {
    padding: 1rem 1rem 0 1rem;
  }
  .tiny-img {
    height:80px;
  }
  #tipinput {
    margin-top:1rem;
  }

</style>
