<template>
  <div>
    <BreadCrumb :pathList="['商品管理', '分类参数' ]"></BreadCrumb>

    <!-- 卡片试图区 -->
    <el-card>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col :span="8">
          <span>选择商品分类: </span>

          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selected_keys" :options="categorysList" :props="cateProps" @change="handleChange">
          </el-cascader>
        </el-col>

        <!-- 头部警告 区 -->
        <el-col :span="8">
          <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon>
          </el-alert>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数
          </el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>
                  {{item}}
                </el-tag>

                <!-- 新增tag -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(cope.row)">+ New Tag</el-button>
              </template>

            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primamry" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性
          </el-button>

          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primamry" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>

                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <!-- 添加表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      categorysList: [],

      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      // 级联选择框双向绑定到的keys数组
      selected_keys: [],

      // tab 页面标签被选择中的标签名称
      activeName: 'many',

      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],

      // 添加参数对话框的显示和隐藏
      addDialogVisible: false,

      // 添加参数的对象
      addForm: {},

      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },

      // 修改参数的对象
      editDialogVisible: false,
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取 category list
    async getCateList () {
      const { data: res } = await this.$http.get('/categories')
      this.categorysList = res.data
    },

    // 级联选择框变化时触发的事件
    handleChange () {
      this.getParamsData()
    },

    // tab 页面标签点击事件的处理函数 
    handleClick () {
      this.getParamsData()
    },

    // 获取参数的列表数据, 方法封装
    async getParamsData () {
      // 只能选择第3级的商品, 进行参数设置
      if (this.selected_keys.length != 3) {
        this.selected_keys = []
      } else {
        // 发送请求, 获取当前cate id对应的参数
        const { data: res } = await this.$http.get(`/categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })

        // 参数的选项变为列表
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : ''
          // 为每个cate增加属性.新增tag时使用
          item.inputVisible = false
          item.inputValue = ''
        })

        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },

    // 监听添加对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮, 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        this.$message.success(`添加${this.titleText}成功`)
        this.getParamsData()
        this.addDialogVisible = false

      })
    },

    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },

    async showEditDialog (attr_id) {

      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`/categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } })

      this.editForm = res.data

      this.editDialogVisible = true
    },

    // 点击按钮, 修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })

        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },

    // 根据id删除对应的参数
    async removeParams (attr_id) {
      const confirmResult = await this.$confirm('是否删除该参数?', '删除参数',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('取消了删除')
      } else {

        // 请求后台, 删除cateid下面的参数
        await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

        this.getParamsData()
      }
    },

    // 新增tag, 按下enter或失去焦点触发
    handleInputConfirm () {

    },
    // 新增tag, 按下button, 展示文本输入框
    showInput () {
      this.inputVisible = true
    }


  },
  computed: {
    // 添加属性 的按钮是否可用, 不可用 return true
    isBtnDisabled () {
      return this.selected_keys.length !== 3
    },

    // 当前选中的3级分类的id
    cateId () {
      if (this.selected_keys.length === 3) {
        return this.selected_keys[2]
      }
      return null
    },
    // 添加参数的标题文本
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },

}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>