<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>帮助反馈
    </tkui-header>
    <tkui-list>
      <tkui-list-item>
        <textarea v-model="msg"  placeHolder="请输入反馈"></textarea>
      </tkui-list-item>
    </tkui-list>
    <tk-toast ref="toast"></tk-toast>
    <tkui-button primary raised big block v-on:click="commit()">提交</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'help-feedback',
  layout: 'help-feedback',
  data: function() {
    return {
     msg:''
    }
  },
  activated:function(){

  },
  mounted:function(){

  },
  methods:{
    back:function(){
      this.$back();
    },
    commit:function(){
      (async()=>{
        let res = await this.$tkParse.post('/classes/feedBack', {
          feed:'',
          user:this.$store.state.user.objectId,
          feedBack:this.msg
        });
        res.status == '200' || res.status == '201'?this.$refs.toast.add('反馈成功！'):this.$refs.toast.add('反馈失败git commit -m "first commit"！')
      })()
    }
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    width:890%;
    margin:3rem auto;
    border:1px solid #ccc;
    padding: 0.5rem;
    height:8rem;
  }
</style>

