<template>
  <div class="footer-wrapper">
    <!-- Q：为什么不能使用v-model?
        A: v-model为双向绑定，但点击触发事件时会同步修改此选项框的值，但是vuex的getters属性没有对应的setter方法，所以报错 -->
    <!-- <el-checkbox border :model-value="$store.getters['todos/isCheckedAll']" :indeterminate="false" @change="checkAllTodo">全选
        </el-checkbox> -->
    <!-- <el-checkbox border :model-value="$store.getters['todos/isInvertChecked']" @change="reverseCheck">反选</el-checkbox> -->
    <!-- <el-alert :title="`已完成 ${$store.getters['todos/doneTodosLen']} / ${$store.getters['todos/todosLen']}`"
             type="info" :closable="false" /> -->
    <el-button
      v-if="$store.getters['todos/isDone']"
      class="todo-del-icon"
      type="danger"
      :icon="Delete"
      circle
      @click="clearAllDone"
    />
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { markRaw } from 'vue';

export default {
  name: 'FooterView',
  props: {},
  setup() {
    const store = useStore();
    // 一键清除已完成和未完成
    const clearAllDone = () => {
      ElMessageBox.confirm('清空已完成和未完成任务?', 'Warning', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        icon: markRaw(Delete),
        draggable: true,
      })
        .then(() => {
          store.dispatch('todos/clearAllDone');
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        })
        .catch(() => {});
    };
    return {
      Delete,
      // checkAllTodo,
      // reverseCheck,
      clearAllDone,
    };
  },
};
</script>
<style scoped>
.footer-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.el-checkbox {
  margin-right: 10px;
}

.el-alert {
  max-width: 120px;
  white-space: nowrap;
  justify-content: center;
  margin-left: auto;
  padding: 8px;
}

/* :deep(.el-alert .el-alert__content) {
    padding: 0 !important;
    text-align: center;
} */

.el-button {
  margin: 0 10px;
}

:deep(.el-checkbox__inner) {
  z-index: 0 !important;
}
</style>
