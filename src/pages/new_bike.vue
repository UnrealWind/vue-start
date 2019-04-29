<template>
  <tk-container class="shop">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      添加车型
    </tkui-header>

    <tkui-list>
      <tkui-input v-model="bikeName" label="车型名称" wrapLabel placeHolder="请填写车型名称"></tkui-input>
    </tkui-list>

    <tkui-list>

      <span @click="goBrandDetail()">
        <tkui-list-item>
        品牌
        <span slot="right">
            <span>{{brand}}</span>
        </span>
        <tk-icon color="#666" slot="right">return1</tk-icon>
      </tkui-list-item>
      </span>
      <tkui-input v-model="price" label="价格" wrapLabel placeHolder="请填写车型价格"></tkui-input>
      <tkui-input v-model="des" label="买卖亮点" wrapLabel placeHolder="请填写车型亮点"></tkui-input>

      <div class="tkui-input-container">
        <div class="tkui-input-body-warp wrap-label">
          <label class="tkui-label">产品图片</label>
          <div class="tkui-input-body">

            <tk-flex class="img-wrap" middle center @click.native="pick">
              <div class="md-subheading" v-if="!file">选择一个文件</div>
              <img class="tiny-img" :src="file.url" v-else-if="isImage" />
              <div class="md-subheading" v-else></div>
            </tk-flex>
          </div>
        </div>
      </div>
    </tkui-list>
    <tkui-button primary raised big block @click="commit()">提交</tkui-button>
    <tk-toast ref="toast"></tk-toast>
  </tk-container>
</template>

<script>
  export default {
    name: 'new_bike',
    layout: 'new_bike',
    data: function() {
      return {
        bikeName:'',
        type: 'image',
        from: 'file',
        file: null,
        mainBrand:[],
        userInfo:{},
        price:0,
        des:'',
        brand:''
      }
    },
    computed:{
      isImage() {
        return this.file && /image/.test(this.file.file.type)
      }
    },
    mounted:function(){
      this.mainBrand = this.$getFlash('flash').brands;
      this.userInfo = this.$store.state.user;

      this.mainBrand.forEach((n,i)=>{
        n['active']?this.brand = n.name:n['active'] = false;
      });

      console.log(this.mainBrand,this.userInfo)
    },
    methods:{
      back:function(){
        this.$back();
        this.$setFlash('flash',{
          brands:this.$getFlash('flash').brands
        });
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
      },
      goBrandDetail(){
        this.$push({
          path:'/brand-detail',
          flash:{
            flash:{
              brands:this.$getFlash('flash').brands,
              type:'single'
            }
          }
        });
      },
      commit(){
        (async()=>{
          let res = await this.$tkParse.post('/classes/model', {
            user:this.userInfo.objectId,
            price:Number(this.price),
            tagImg:this.file.url,
            modelName:this.bikeName,
            configInfo:this.des,
            brand:this.brand
          })
          res.status =='200'|| res.status =='201'?this.$refs.toast.add('新增车型成功！'):this.$refs.toast.add('新增车型失败！')
        })();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tkui-list {
    padding:1rem 1rem 0 1rem;
  }
  .tkui-list-item {
    padding:0;
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
  .tiny-img {
    width:80px;
    height:80px;
  }
</style>
