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
      <tkui-list-picker v-if="brands" v-model="brand" :items="brands" label="品牌" placeholder="请选择品牌"></tkui-list-picker>

      <tkui-input v-model="price" label="价格" wrapLabel placeHolder="请填写车型价格"></tkui-input>
      <tkui-input v-model="des" label="买卖亮点" wrapLabel placeHolder="请填写车型亮点"></tkui-input>

      <div class="tkui-input-container">
        <div class="tkui-input-body-warp wrap-label">
          <label class="tkui-label">产品图片</label>
          <div class="tkui-input-body">

            <tk-flex style="flex-direction: column;" class="img-wrap" middle center @click.native="pick">
              <div class="md-subheading">选择一个文件</div>
              <img class="tiny-img" :src="file.url"/>
            </tk-flex>
          </div>
        </div>
      </div>
    </tkui-list>
    <span>
      <tkui-button v-if='btnType' primary raised big block @click="commit()">提交</tkui-button>
      <tkui-button v-else primary raised big block disabled>图片上传中……</tkui-button>
    </span>
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
        file: {},
        mainBrand:[],
        userInfo:{},
        price:0,
        des:'',
        brand:'',
        brands:null,
        btnType:true,
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
      this.brands = {};
      this.mainBrand.forEach((n,i)=>{
        this.brands[n.objectId] = n.name;
      });

      console.log(this.$getFlash('flash').bike)
      this.$getFlash('flash').bike?(()=>{
        this.bikeName = this.$getFlash('flash').bike.modelName;
        this.brand = this.$getFlash('flash').bike.brand;
        this.price =this.$getFlash('flash').bike.price;
        this.des = this.$getFlash('flash').bike.configInfo;
        this.file['url'] = this.$getFlash('flash').bike.tagImg;
        })():'';

      console.log(this.mainBrand,this.userInfo,this.brands)
    },
    methods:{
      back:function(){
        this.$back();
        this.$setFlash('flash',{
          brands:this.$getFlash('flash').brands,
          brand: {
            objectId:this.brand
          }
        });
      },
      pick() {
        this.$tkFile.pick({
          type: this.type,
          from: this.from
        })
          .then(file => {
            (async()=>{
              this.btnType = false;
              let res1 = await this.$tkParse.post('/files',file.buffer);
              this.file = res1.data;
              this.btnType = true;
            })();
          })
          .catch(e => {
            window.alert(e.message)
          })
      },
      commit(){
          !this.$getFlash('flash').bike?(async ()=>{
              let res = await this.$tkParse.post('/classes/model', {
                user:this.userInfo.objectId,
                price:Number(this.price),
                tagImg:this.file.url || null,
                modelName:this.bikeName,
                configInfo:this.des,
                brand:this.brand
              })
            res.status =='200'|| res.status =='201'?(this.$refs.toast.add('新增车型成功！'),this.back()):this.$refs.toast.add('新增车型失败！')
          })():(async ()=>{
            let res = await this.$tkParse.put('/classes/model/'+this.$getFlash('flash').bike.objectId, {
              user:this.userInfo.objectId,
              price:Number(this.price),
              tagImg:this.file.url || null,
              modelName:this.bikeName,
              configInfo:this.des,
              brand:this.brand
            })
            res.status =='200'|| res.status =='201'?(this.$refs.toast.add('新增车型成功！'),this.back()):this.$refs.toast.add('新增车型失败！')
          })()
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
    .right>span {
      max-width:200px;
      display:inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .left {
      .tkui-list-picker-label {
        font-size:0.8rem;
      }
    }
  }
  .tiny-img {
    height:80px;
    margin-top:1rem;
  }

</style>
