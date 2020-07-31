<template>
  <div>
    <BreadCrumb :pathList="['商品管理', '商品分类']"></BreadCrumb>
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 展示分类数据 -->
      <tree-table :data="categorysList" :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border class="tree-table">

        <!-- 是否有效的摸板 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: lightgreen;"></i>
        </template>

        <!-- 排序摸板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作摸板 -->
        <template slot="opt">
          <el-button type="primary" class="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name" placeholder="请输入新增的分类名称"></el-input>
        </el-form-item>

        <el-form-item label="父级分类: ">
          <!-- 级联选择器, options=级联数据, props=配置选项, change-on-select 允许选择任何级别, clearable 清除选择项 -->
          <el-cascader v-model="selected_keys" :options="parentCateList" :props="cascaderProps"
            @change="parentCateChange" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总条数
      total: 0,

      // 添加分类对话框显示隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 要添加的分类名称
        cat_name: '',
        // 分类的 父类id
        cat_pid: 0,
        // 分类等级, 默认是1级分类
        cat_level: 0

      },
      // 父级分类列表, 添加分类时使用
      parentCateList: [],

      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 选中的父级分类的id数组
      selected_keys: [],

      // 添加分类的表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '分类不能为空' }
        ]
      },

      // 商品列表
      categorysList: [],
      // table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 引用的摸板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 引用的摸板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 引用的摸板名称
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCategorysList()
  },
  methods: {
    // 获取category list
    async getCategorysList () {
      // 获取商品分类数据
      const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
      this.categorysList = res.data.result
      this.total = res.data.total
    },

    // 监听pagesize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategorysList()
    },

    // 监听pagenum 的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategorysList()
    },
    // 展示添加分类对话框
    showAddCateDialog () {
      // 获取父级列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      this.parentCateList = res.data
    },

    // 级联选择器, 选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selected_keys);
      // selected_keys 长度大于0, 则证明选中了父级分分类
      // 反之, 没有选中
      if (this.selected_keys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid = this.selected_keys[this.selected_keys.length - 1]
        // level
        this.addCateForm.cat_level = this.selected_keys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 点击按钮, 添加新的分类
    addCate () {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('/categories', this.addCateForm)

          this.$message.success(res.meta.msg)
          this.getCategorysList()
          this.addCateDialogVisible = false
        }
      })
    },

    // 监听对话框的关闭事件, 重置表单数据
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()

      // 级联选择器重置
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0

      // 清空级联选择器的 已选择keys列表
      this.selected_keys = []
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>