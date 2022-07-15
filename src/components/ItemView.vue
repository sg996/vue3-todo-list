<template>
  <transition name="el-fade-in-linear">
    <el-checkbox :label="todo.id" :disabled="isDisabled">
      <div>
        {{ todo.name }}
      </div>
      <div class="todo-del-icon">
        <el-button
          v-if="!isDisabled"
          type="danger"
          :icon="Delete"
          circle
          @click="() => deleteTodo(todo.id)"
        />
        <div>
          {{ timeFormatter(todo.startTime) }}
        </div>
      </div>
    </el-checkbox>
  </transition>
</template>

<script>
import { useStore } from 'vuex';
import { Delete } from '@element-plus/icons-vue';
import utilData from '../api/utils';
import { computed } from 'vue';

export default {
  name: 'ItemView',
  props: {
    todo: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = useStore();
    const deleteTodo = (id) => {
      store.commit({ type: 'todos/deleteTodo', id });
      store.commit('todos/saveLocal');
    };
    const timeFormatter = utilData.str2Time;
    const isDisabled = computed(() => {
      for (let i = 0; i < store.getters['todos/todosLen']; i++) {
        if (store.state.todos.todos[i].id === props.todo.id) {
          return !(
            store.state.todos.todos[i].status === utilData.TASKSTATUS.CREATED
          );
        }
      }
      return true;
    });
    return {
      deleteTodo,
      Delete,
      timeFormatter,
      isDisabled,
    };
  },
};
</script>

<style scoped>
.el-checkbox {
  margin-right: 0;
  padding: 5px 10px;
  font-size: 16px !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

/* 修改选择label字体颜色 */
/* :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: rgb(200, 200, 200) !important;
} */

.el-checkbox:hover {
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}

.todo-del-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.el-checkbox__input {
  flex: 1;
}

:deep(.el-checkbox__label) {
  display: flex;
  flex-direction: row;
  flex: 5;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-checkbox__inner) {
  z-index: 0 !important;
}
</style>
