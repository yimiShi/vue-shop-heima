<template>
  <div>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" stripe>
        <el-table-column type="index" label="No."></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template width="180px" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserinfo(scope.row.id)">
            </el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

      <!--  内容主题区域 -->
      <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!--  内容主题区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {

    /* 自定义校验规则 */
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,

      // 添加user的表单 验证规则
      addFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ]
      },

      // 添加user的表单数据
      addForm: {
        username: '123',
        password: '',
        email: '',
        mobile: ''
      },

      // 修改用户对话框
      editDialogVisible: false,
      // 查询得到的用户信息
      editForm: {},
      // 修改的用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    console.log('created>..', this.addForm);
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    async userStateChanged (userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 未成功, 改变页面
        userInfo.mg_state != userInfo.mg_state
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success('更新用户状态成功')
      }
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.addForm);
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success('添加用户成功')
          this.addDialogVisible = false

          // 重新获取用户列表
          this.getUserList()
        }
      })
    },

    // 展示修改用户信息对话框
    async showEditDialog (userId) {
      // console.log(userId);
      const { data: res } = await this.$http.get('/users/' + userId)

      if (res.meta.status !== 200) {
        this.$message.error('获取用户信息失败')
      } else {
        this.editForm = res.data
      }

      this.editDialogVisible = true
    },

    // 修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          console.log(this.editForm);
          const { data: res } = await this.$http.put('/users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })

          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            // 提示成功
            this.$message.success('更新用户信息成功')
            // 关闭dialog
            this.editDialogVisible = false
            // 更新用户列表
            this.getUserList()
          }
        }
      })
    },

    // 根据id删除用户信息
    async removeUserinfo (userId) {
      // 弹框询问是否删除
      const result = await this.$confirm('是否删除当前用户信息?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // result ?  confirm : cancel
      if (result !== 'confirm') {
        this.$message.info('已经取消了删除')
      } else {
        const { data: res } = await this.$http.delete('/users/' + userId)
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('删除用户失败')
        } else {
          this.$message.success('删除用户成功')
          this.getUserList()
        }
      }

    }
  },

}
</script>

<style lang="less" scoped>
</style>