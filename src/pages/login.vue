<template>
  <tk-container class="login">
    <tkui-header background="white" color="#333" center>
      登录
    </tkui-header>
    <div class="tab-bar">
      <tkui-button-group :items="tabs" v-model="targetTab"></tkui-button-group>
    </div>

    <tkui-form ref="form_all">
      <tkui-list v-if="targetTab == 'tabs1'">
        <tkui-list-item>
          <tk-icon slot="left" material>phone_iphone</tk-icon>
          <tkui-form ref="form_phone">
            <tkui-input v-model="phone" label=""  rulers="required" noborder placeHolder="请输入手机号"></tkui-input>
          </tkui-form>
          <p slot="right" @click="getCode()">获取验证码</p>
        </tkui-list-item>
        <tkui-list-item>
          <tk-icon slot="left" material>lock_outline</tk-icon>
          <tkui-input v-model="code" label=""  rulers="required" noborder placeHolder="请输入验证码"></tkui-input>
        </tkui-list-item>
      </tkui-list>

      <tkui-list v-if="targetTab == 'tabs2'">
        <tkui-list-item>
          <tk-icon slot="left" material>phone_iphone</tk-icon>
          <tkui-input v-model="username" label=""  rulers="required" noborder placeHolder="请输入账号"></tkui-input>
        </tkui-list-item>
        <tkui-list-item>
          <tk-icon slot="left" material>lock_outline</tk-icon>
          <tkui-input v-model="password" type="password" label=""  rulers="required" noborder placeHolder="请输入密码"></tkui-input>
        </tkui-list-item>
      </tkui-list>
    </tkui-form>
    <tkui-button primary raised big block @click="setUser()">登录</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'login-page',
  layout: '',
  data: function() {
    return {
      tabs: {
        tabs1: '手机号登录',
        tabs2: '账号登录'
      },
      targetTab:'tabs1',
      phone:'18515889438', //电话号码
      username:'',  //用户名
      password:'',  //密码
      code:'',  //短信验证码
      customRuler: [
        'required',
        function(value) {

        }
      ],
    }
  },
  methods:{
    //用户登录
    async userLogin(){
      let res = await this.$tkParse.post('/login', {
        username: this.username,
        password: this.password
      }).catch(e => {
        this.$tkGlobal.toast.add('登录失败！请重试！')
      });
      return res;
    },

    //手机号登录
    async phoneLogin(){
      let res = await this.$tkParse.post('/loginByPhone', {
        phone: this.phone,
        code: this.code
      }).catch(e => {
        this.$tkGlobal.toast.add('登录失败！请重试！')
      });;
      return res;
    },
    setUser () {
      let jud = this.$refs.form_all.validate();
      jud.length == 0?
      this.targetTab == 'tabs1'?
        this.phoneLogin().then(res=>{
          this.jump(res);
          this.$push('/')
        }):this.userLogin().then(res=>{
          this.jump(res);

          //这里业务逻辑让跳转这个页面为第一个页面
          this.$push('/bike-list')
        }):'';
    },

    //这里校验一下非空进行不同的store存储 this.$store.commit('setSessionToken',this.username)
    jump (res){
        this.$store.commit('setSessionToken',res.data.sessionToken);
        this.$store.commit('setUser',res.data);
        this.$tkParse.setSessionToken(res.data.sessionToken);
    },

    //发送验证码
    async getCode(){
      let jud = this.$refs.form_phone.validate();
      jud.length == 0?await this.$tkParse.post('/sms/sendCode',{
          phone:this.phone,
          templateId: 'ISxi11'
        }).catch(e => {

          //短信发送失败
          this.$tkGlobal.toast.add('短信发送失败！请重试');
          throw e;
        }):'';
        this.$tkGlobal.toast.add('短信发送成功！');
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-bar {
    text-align: center;
    margin-top:16px;
  }
  .width100 {
    width: 90%;
  }
  .tkui-list {
    margin:16px 0;
  }
  .list-item-content {
    width: 100%;
    >form,.tkui-input-container{
      width: 100%;
    }
  }
</style>
