<template>
  <el-row justify="center">
    <el-col :xs="24" :sm="10" :md="10" :lg="10">
      <HeaderView />
      <el-card :body-style="{ padding: '10px' }">
        <template v-if="$store.state.todos.todos.length !== 0">
          <ListView />
          <el-divider style="margin: 10px 0" />
          <FooterView />
        </template>
        <el-empty v-else>
          <template #description />
          <el-button
            type="primary"
            :loading="isReset"
            @click="handleResetAndRefresh"
            >重置刷新</el-button
          >
        </el-empty>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { ref, onBeforeMount, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import HeaderView from './components/HeaderView.vue';
import ListView from './components/ListView.vue';
import FooterView from './components/FooterView.vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'App',
  components: {
    HeaderView,
    ListView,
    FooterView,
  },
  setup() {
    const store = useStore();
    const isReset = ref(false);
    const isShow = ref(false);
    // 重置
    // TDOO: 2022-07-15 数据同步问题
    const handleResetAndRefresh = async () => {
      isReset.value = true;
      (await store.dispatch('todos/getAllTodo'))
        ? ElMessage('重置数据成功！')
        : ElMessage('重置数据失败！');
      (await store.dispatch('todos/syncData'))
        ? ElMessage('同步数据成功！')
        : ElMessage('同步数据失败！');
      isReset.value = false;
    };

    // 挂时数据初始化
    onBeforeMount(async () => {
      // TODO: 2022-07-15 bug: 页面切出后定时器被删除问题
      await store.dispatch('todos/getAllTodo');
      // TODO: 2022-07-15 feature: 整点数据同步问题
    });

    onUnmounted(() => {});
    return {
      isReset,
      handleResetAndRefresh,
      isShow,
    };
  },
};
</script>

<style lang="less">
/* 这里引入样式 */
/* @import "./assets/base.less"; */
/* 这里引入自定义样式 */
@import './assets/base.css';

body {
  box-sizing: border-box;
  min-width: 340px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

// .dialog-footer button:first-child {
//   margin-right: 10px;
// }
.el-message-box {
  width: 350px !important;
  background-color: rgb(200, 200, 200) !important;
}
</style>
