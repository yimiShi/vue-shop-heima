<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(pathName, index) in pathList" :key="index">{{pathName}}</el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    pathList: Array
  }

}
</script>

<style>
</style>