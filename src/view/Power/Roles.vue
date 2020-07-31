<template>
  <div>
    <BreadCrumb :pathList="['权限管理', '角色列表']" />

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色管理区域 -->
      <el-table :data="rolesList" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(oneLevel, index1) in scope.row.children" :key="oneLevel.id" class="bd-bottom vcenter"
              :class="{'bd-top': index1 === 0 }">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, oneLevel.id)" closable>{{oneLevel.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级, -->
              <el-col :span="19">
                <el-row v-for="(twoLevel, index2) in oneLevel.children" :key="twoLevel.id"
                  :class="{'bd-top': index2 !== 0}" class="vcenter">
                  <!-- 渲染二级 -->
                  <el-col :span="5">
                    <el-tag type="success" @close="removeRightById(scope.row, twoLevel.id)" closable>
                      {{twoLevel.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="19">
                    <el-tag type="warning" v-for="threeLevel in twoLevel.children" :key="threeLevel.id" closable
                      @close="removeRightById(scope.row, threeLevel.id)">
                      {{threeLevel.authName}}</el-tag>
                  </el-col>

                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引 -->
        <el-table-column type="index" label="No."></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDilogClose">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" node-key="id" default-expand-all show-checkbox
        :default-checked-keys="defKeys" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { reqAllRights } from '@/api/index'
export default {
  data () {
    return {
      rolesList: [],

      // 分配权限对话框的显示隐藏
      setRightDialogVisible: false,
      // 所有的权限
      rightsList: [],

      // 树形结构默认选中的key
      defKeys: [],
      // 树型结构的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },

      // 当前分配权限的role immediate
      roleId: '',

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')

      this.rolesList = res.data
    },

    // 根据id删除权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('是否删除该权限?', '删除权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'cancel') {
        return this.$message.info('取消了删除操做')
      }

      // 删除权限, 后台删除
      const { data: res } = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`)
      // this.$message.success(res.meta.msg)

      // 再次获取角色列表
      // this.getRolesList()
      role.children = res.data
    },

    // 分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限列表
      const { data: res } = await reqAllRights('tree')
      // const result = await this.$http.get('rights/tree')
      this.rightsList = res.data

      // 获取所有的3级节点id保存到data中, 使默认勾选
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },

    // 递归方式, 获取所有3级权限的id
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性, 则为3级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      // 递归
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },

    // 关闭树形控件时, 默认的defkeys list清空
    setRightDilogClose () {
      this.defKeys = []
      this.setRightDialogVisible = false
    },
    // 分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      console.log(keys);
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`/roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>