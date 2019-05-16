<template>
  <tk-container>
    <tkui-header  slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
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
          <input id="tipinput" v-model="address"   placeHolder="请填写详细地址"/>
          <div class="tkui-input-body">
            <div v-if="mapShow" id="container" style="width:400px; height:300px;"></div>
          </div>
        </div>
      </div>
    </tkui-list>

    <tkui-button @click="save" primary raised big block border>保存</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'shopAddress',
  layout: '',
  data () {
    return {
      type: 'image',
      from: 'camera',
      file: {
        url: null
      },
      mapShow: true,
      shopName: '',
      address: '',
      location: {},
      shopId: ''
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    isImage () {
      return this.file && /image/.test(this.file.url)
    }
  },
  methods: {
    async init () {
      try {
        await this.getShop()
      } catch (e) {
        throw e
      }
      this.initMap()
    },
    async getShop () {
      let res = await this.$tkParse.getFirst('/classes/shop', {
        params: {
          where: {
            user: this.$store.state.user.objectId
          }
        }
      })
      this.shopName = res.shopName
      this.location = res.location
      this.address = res.txtLocation
      !this.file.url ? this.file['url'] = res.storePhoto : ''
      this.shopId = res.objectId
    },
    save () {
      let url, method
      this.shopId ? (url = '/classes/shop/' + this.shopId, method = 'put') : (url = '/classes/shop', method = 'post')
      !this.location || !this.location.latitude
        ? this.$tkGlobal.toast.add('请在地图上选择您的店铺位置！') : this.changeShop(method, url)
    },
    async changeShop (method, url) {
      let res = await this.$tkParse[method](url, {
        user: this.$store.state.user.objectId,
        location: this.location,
        shopName: this.shopName,
        storePhoto: this.file.url,
        txtLocation: this.address
      }).catch(e => {
        // err code
        throw e
      })
      this.$tkGlobal.toast.add('店铺修改成功！')
      this.shopId = res.data.objectId
    },
    initMap () {
      let that = this
      let map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 13
      })

      let mapMarker = () => {
        let markers = [{
          icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png',
          position: [this.location.longitude, this.location.latitude]
        }]
        markers.forEach(function (marker) {
          new AMap.Marker({
            map: map,
            icon: marker.icon,
            position: [marker.position[0], marker.position[1]],
            offset: new AMap.Pixel(-13, -30)
          })
        })
      }
      this.location.latitude ? mapMarker() : ''

      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      map.on('click', function (e) {
        that.location = {
          __type: 'GeoPoint',
          latitude: e.lnglat.lat,
          longitude: e.lnglat.lng
        }
        let markers = [{
          icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png',
          position: [e.lnglat.lng, e.lnglat.lat]
        }]
        map.clearMap()
        markers.forEach(function (marker) {
          // 这里记一下，直接进行new操作是不符合eslint规范的
          new AMap.Marker({
            map: map,
            icon: marker.icon,
            position: [marker.position[0], marker.position[1]],
            offset: new AMap.Pixel(-30, -60)
          })
        })
      })
    },
    pick () {
      this.$tkFile.pick({
        type: this.type,
        from: this.from
      }).then(file => {
        (async () => {
          let res1 = await this.$tkParse.post('/files', file.buffer)
          this.file = res1.data
        })()
      }).catch(e => {
        this.$tkGlobal.toast.add('图片上传失败！')
        throw e
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tkui-input-container {
    padding: 16px 16px 0 16px;
  }
  .tiny-img {
    height:80px;
  }
  #tipinput {
    margin-top:16px;
  }

</style>
