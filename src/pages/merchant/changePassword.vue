<template>
  <tk-container>
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      更改密码
    </tkui-header>

    <tkui-form ref="form_all">
      <tkui-list>
        <tkui-list-item>
          <tkui-input v-model="usedPassword" type="password" label="原密码"  rulers="required" noborder placeHolder="请输入原密码"></tkui-input>
        </tkui-list-item>
        <tkui-list-item>
          <tkui-input v-model="newPassWord" type="password" label="新密码"  rulers="required" noborder placeHolder="请输入新密码"></tkui-input>
        </tkui-list-item>
        <tkui-list-item>
          <tkui-input v-model="reNewPassWord" type="password" label="新密码"  rulers="required" noborder placeHolder="请再次输入新密码"></tkui-input>
        </tkui-list-item>
      </tkui-list>
    </tkui-form>
    <tkui-button @click="changePassword()" primary raised big block border>提交</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'changePassword',
  layout: '',
  data: function () {
    return {
      usedPassword: '',
      newPassWord: '',
      reNewPassWord: ''
    }
  },
  methods: {
    changePassword: function () {
      let jud = this.$refs.form_all.validate()
      jud.length == 0 && this.newPassWord == this.reNewPassWord ? this.putUser() : this.$tkGlobal.toast.add('请正确填写密码！')
    },
    async putUser () {
      let res = await this.$tkParse.put('/classes/_User/' + this.$store.state.user.objectId, {
        password: this.newPassWord
      }, {}).catch(e => {
        this.$tkGlobal.toast.add('修改失败，请重试！')
        throw err
      })
      this.$tkGlobal.toast.add('修改成功！')
      this.$store.commit('setSessionToken', res.data.sessionToken)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-item-content {
    width: 100%;
    >form,.tkui-input-container{
      width: 100%;
    }
  }
</style>
