<template>
  <div>
    <BreadCrumb :pathList="['商品管理', '商品分类']"></BreadCrumb>
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
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
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>