<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="./images/heima.png" alt="">
        电商管理后台系统
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleAside" @click="toggleAside">|||</div>
        <!-- 左侧菜单栏 -->
        <el-menu background-color="#333744" text-color="#fff" class="el-menu-vertical-demo" active-text-color="#409eff"
          unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>

      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接低战
      activePath: ''
    }
  },
  created () {

    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath') || '/users'
  },
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
      }
    },
    // 切换左侧边栏的折叠与展开
    toggleAside () {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState (activePath) {
      sessionStorage.setItem('activePath', "/" + activePath)
      this.activePath = "/" + activePath
    }
  }

}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      margin-right: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.toggleAside {
  font-size: 10px;
  line-height: 24px;
  background-color: #4a5064;
  color: #fff;
  width: 100%;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>
