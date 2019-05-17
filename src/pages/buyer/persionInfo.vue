<template>
  <tk-container>
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>个人主页
    </tkui-header>
    <tkui-list >
      <tkui-list-item  @click.native="pick">
        <tk-avatar slot="right" size="64">
          <tk-image v-if="!file || !file.url" src="http://moke-store.oss-cn-beijing.aliyuncs.com/5166583b-0ee1-4808-84a4-280abdfa9c2f.png" width="100" height="100"></tk-image>
          <tk-image v-else :src="file.url" width="100" height="100"></tk-image>
        </tk-avatar>
        <div class="content">
          <div class="title">头像</div>
        </div>
      </tkui-list-item>

      <tkui-list-item @click.native="changeModel">
        <div class="content">
          <div class="title">昵称</div>
        </div>
        <span slot="right">{{userInfo.username}}</span>
      </tkui-list-item>
    </tkui-list>
    <tkui-button @click="logout" class="special" raised big block border>退出登录</tkui-button>

    <tkui-dialog :show.sync="show" center>
      <div class="subhead">
        <tkui-input v-model="userInfo.username" label="用户名"></tkui-input>
      </div>
      <template slot="action">
        <button class="tkui-dialog-button" @click="changeModel">取消</button>
        <button class="tkui-dialog-button primary" @click="save">确定</button>
      </template>
    </tkui-dialog>

  </tk-container>
</template>

<script>
export default {
  name: 'persionInfo',
  layout: '',
  data () {
    return {
      userInfo: {},
      type: 'image',
      from: 'file',
      file: null,
      show: false
    }
  },
  mounted () {
    this.userInfo = this.$store.state.user
    if (this.userInfo.avatar) {
      this.file = {
        url: this.userInfo.avatar
      }
    }
  },
  computed: {
    isImage () {
      return this.file && /image/.test(this.file.file.type)
    }
  },
  methods: {
    logout () {
      this.$replace('/login')
      this.$store.commit('setSessionToken', null)
    },
    pick () {
      this.$tkFile.pick({
        type: this.type,
        from: this.from
      }).then(file => {
        this.change(file)
      }).catch(e => {
        throw e
      })
    },
    async change (file) {
      let res = await this.$tkParse.post('/files', file.buffer)
      this.file = res.data
      await this.$tkParse.put('/classes/_User/' + this.$store.state.user.objectId, {
        avatar: this.file.url
      }, {}).catch(e => {
        this.$tkGlobal.toast.add('修改失败，请重试！')
        throw e
      })
      this.$tkGlobal.toast.add('修改成功！')
      this.$store.commit('add', { key: 'avatar', value: this.file.url })
    },
    changeModel () {
      this.show = !this.show
    },
    async save () {
      await this.$tkParse.put('/classes/_User/' + this.$store.state.user.objectId, {
        username: this.userInfo.username
      }, {}).catch(e => {
        this.$tkGlobal.toast.add('修改失败，请重试！')
        throw e
      })
      this.show = false
      this.$tkGlobal.toast.add('修改成功！')
      this.$store.commit('add', { key: 'username', value: this.userInfo.username })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tkui-list {
    .tkui-list-item {
      padding: 16px;
      border-bottom:1px solid #eee;
    }
  }
  .tkui-button.special {
    margin-top:50px;
    background-color: #fff;
    color:red;
  }

  .subhead {
    width:100%;
  }

</style>
