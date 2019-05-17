<template>
  <tk-container>
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>帮助反馈
    </tkui-header>
    <tkui-list>
      <tkui-list-item>
        <textarea v-model="msg"  placeHolder="请输入反馈"></textarea>
      </tkui-list-item>
    </tkui-list>
    <tkui-button primary raised big block @click="commit">提交</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'helpFeedback',
  layout: '',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    async commit () {
      await this.$tkParse.post('/classes/feedBack', {
        feed: '',
        user: this.$store.state.user.objectId,
        feedBack: this.msg
      }).catch(err => {
        this.$tkGlobal.toast.add('反馈失败！')
        throw err
      })
      this.$tkGlobal.toast.add('反馈成功！')
    }
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    width:890%;
    margin:30px auto;
    border:1px solid #ccc;
    padding: 8px;
    height:100px;
  }
</style>
