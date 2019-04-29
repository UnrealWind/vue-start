<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
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
              <div class="md-subheading" v-if="!file">拍照上传</div>
              <img v-else class="tiny-img" :src="file.url"  />
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
      file: null,
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
    this.init();

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
      console.log(res)
      res.status == '200'?(async()=>{
        this.shopName = res.data.results[0].shopName;
        this.location = res.data.results[0].location;
        this.address = res.data.results[0].txtLocation;
        !this.file?(this.file = {},this.file['url'] = res.data.results[0].storePhoto):'';
        this.shopId = res.data.results[0].objectId;
      })():''

    })();
  },
  computed: {
    isImage() {
     // return this.file && /image/.test(this.file.url)
    }
  },
  methods:{
    save:function(){
      !this.location || !this.location.latitude ?
        this.$refs.toast.add('请选择更详细的的地址！'):
        (async()=>{
          let res = await this.$tkParse.put('/classes/shop/'+this.shopId,{
            location:this.location,
            shopName:this.shopName,
            storePhoto:this.file.url|| null,
            txtLocation:this.address,
          })
          res.status == '200' ||  res.status == '201'?this.$refs.toast.add('店铺修改成功！'):'';
       })();
    },
    init:function(){
      var that = this;
      var map = new AMap.Map("container", {
        resizeEnable: true
      });

      AMap.plugin(["AMap.Geolocation","AMap.CitySearch","AMap.Autocomplete","AMap.PlaceSearch"], function() {
        // 实例化Autocomplete
        var autoOptions = {
          city: '全国',
          input: "tipinput"
        }

        var autoComplete = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          map: map
        });  //构造地点查询类
        AMap.event.addListener(autoComplete, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询+
          !e.poi.location?that.$refs.toast.add('请选择更详细的的地址！'):that.$refs.toast.add('定位成功');
          that.location = {
            __type: "GeoPoint",
            latitude:e.poi.location.lat,
            longitude:e.poi.location.lng
          };
          that.address = e.poi.name;

        }
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
          this.file = file
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
    width:80px;
    height:80px;
  }
  #tipinput {
    margin-top:1rem;
  }

</style>
