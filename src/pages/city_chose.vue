<template>
  <tk-container hideStatusBar infiniteScroll @loadingMore="loadingMore">
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>定位
    </tkui-header>
    <tkui-list big>
      <tkui-list-item border>
        <div class="content">
          <div class="des">当前定位城市</div>
          <div class="title">
            <tk-icon>Positioning1</tk-icon>
            {{targetCity}}
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <tkui-list small>
      <span  v-for="opt in targetList"  @click="setCity(opt)">
        <tkui-list-item>
        <tk-icon slot="left">list</tk-icon>
        {{opt.name}}
      </tkui-list-item>
      </span>
    </tkui-list>

  </tk-container>
</template>

<script>
export default {
  name: 'city-chose',
  layout: 'city-chose',
  data: function() {
    return {
      targetCity:'加载中',
      cityList:[],
      perPage: 20,
      targetList:[]
    }
  },
  mounted:function(){

    //这页原型那种方法感觉蛮奇怪的，还需要根据首字母进行匹配重新生成数据，也没有导航，个人感觉还是使用城市选择器，使用城市选择器的话，这一页完全可以省略
    //直接在上一页按钮上使用即可，这一页默认作为展示无限加载的页面吧。
    this.targetCity = this.$getFlash('targetCity');
    (async () => {
      this.cityList = this.$tkRegions.getCityList();

      /*  貌似包里没有这个方法，未更新

      let position = await this.$tkGeolocation.getCurrentPosition()
      console.log(position)*/
    })();


  },
  methods:{
    back:function(){
      this.$back();
    },
    loadingMore: function(page, next) {
      let that = this;
      setTimeout(() => {
        //this.num = (page + 1) * this.perPage
        that.targetList = that.targetList.concat(that.cityList.slice((page) * that.perPage,(page+1) * that.perPage));
        if (false) {
          next('complete')
        } else {
          next('+1')
        }
      }, 1000)
    },
    setCity:function(opt){
      this.$back();
      this.$setFlash('city',opt);
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-item-content {
    .content {
      .des {
        font-size:0.8rem;
        color:#aaa;
        padding-left:0.5rem;
      }
      .title {
        padding: 0.5rem;
      }

    }
  }

</style>
