<template>
  <el-checkbox-group
    :model-value="$store.state.todos.doneTodos"
    @change="handleCheckedChange"
  >
    <ItemView
      v-for="todo in $store.state.todos.todos"
      :key="todo.id"
      :todo="todo"
    />
  </el-checkbox-group>
</template>

<script>
import ItemView from './ItemView.vue';
import { useStore } from 'vuex';

export default {
  name: 'ListView',
  components: {
    ItemView,
  },
  props: {},
  // emits: ['update:checkAll', 'update:isIndeterminate'],
  setup() {
    const store = useStore();

    const handleCheckedChange = (doneTodos) => {
      store.commit('todos/updateTodo', { doneTodos });
      store.commit('todos/saveLocal');
    };
    return {
      handleCheckedChange,
    };
  },
};
</script>

<style scoped>
.el-checkbox-group {
  display: grid;
}

/* :deep(.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  border-color: rgb(200, 200, 200) !important;
  background-color: rgb(200, 200, 200) !important;
  color: rgb(200, 200, 200) !important;
  text-shadow: 10;
}
:deep(.el-checkbox__inner:hover) {
  border-color: rgb(200, 200, 200) !important;
  color: rgb(200, 200, 200) !important;
}
:deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  border-color: rgb(200, 200, 200) !important;
  color: rgb(200, 200, 200) !important;
} */
</style>
