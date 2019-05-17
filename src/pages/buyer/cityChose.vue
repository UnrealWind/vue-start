<template>
  <!-- hideStatusBar infiniteScroll @loadingMore="loadingMore"-->
  <tk-container>
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>定位
    </tkui-header>
    <tkui-list big>
      <tkui-list-item border>
        <div class="content">
          <div class="des">当前定位城市</div>
          <div class="title">
            <tk-icon>Positioning1</tk-icon>
            {{cityName}}
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <tkui-list small>
      <span  v-for="(opts,key) in targetList" :key="key">
        <h3>{{key}}</h3>
          <span v-for="(opt,index) in opts"  @click="setCity(opt)" :key="index">
            <tkui-list-item>
              <h4>{{opt.name}}</h4>
            </tkui-list-item>
          </span>
      </span>
    </tkui-list>

  </tk-container>
</template>

<script>
export default {
  name: 'cityChose',
  layout: '',
  data () {
    return {
      perPage: 20,
      targetList: {}
    }
  },
  computed: {
    cityList () {
      return this.$tkRegions.getCityList()
    },
    cityName () {
      return this.$getFlash('cityName') || '请选择城市位置'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let city = {}
      this.cityList.forEach((n, i) => {
        !city[n.pinyin[0]] ? city[n.pinyin[0]] = [n] : city[n.pinyin[0]].push(n)
      })
      this.targetList = this.sortKey(city)
    },
    sortKey (obj) {
      let newkey = Object.keys(obj).sort()
      // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      let newObj = {}// 创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) { // 遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]]// 向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj// 返回排好序的新对象
    },
    setCity (opt) {
      // 这里想了一下，这个应该是作为筛选条件出现的，把这个传回去，然后作为筛选条件
      this.$back({
        path: '/',
        query: {
          cityId: opt.code
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-item-content {
    .content {
      .des {
        font-size:13px;
        color:#aaa;
        padding-left:8px;
      }
      .title {
        padding: 8px;
      }

    }
  }
   h3 {
     padding: 10px 30px 5px 30px;
   }
  h4 {
    font-weight:300;
    padding: 0 20px;
  }
</style>
