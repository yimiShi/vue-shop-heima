<template>
  <div>
    <BreadCrumb :pathList="['商品管理', '添加商品']"></BreadCrumb>
    <el-card>
      <!-- 提示区 -->
      <el-alert type="info" title="添加商品信息" center show-icon>
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-tabs @tab-click="handleClick" tab-position="left" style="height: 200px;" v-model="activeIndex">
        <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0'
    }
  }
}
</script>

<style lang="less" scoped>
</style>