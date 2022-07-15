<template>
  <el-card :body-style="{ padding: '5px' }">
    <div class="card-header">
      <el-alert
        center
        :closable="false"
        effect="dark"
        :title="dateTitle"
        type="error"
      >
        <!-- href="https://github.com/xiaochunrilihe/vue3-todo-list" -->
        <el-link :underline="false" href="" @click="() => lightBtn()">
          <svg viewBox="0 0 16 16" color="#fff">
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27c.68 0 1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              fill="currentColor"
            />
          </svg>
        </el-link>
      </el-alert>
      <el-input
        v-model="todo"
        :disabled="$store.getters['todos/todosLen'] >= 10"
        maxlength="20"
        placeholder="做点什么呢?"
        @keydown.enter="updateTodo(todo)"
        style="margin-bottom: 10px"
      >
        <template #prepend>
          <el-time-picker
            v-model="endTime"
            placeholder="截至时间"
            format="HH:mm"
            style="width: 100px; !important"
          />
        </template>
        <template #append>
          <el-button @click="() => updateTodo(todo)" size="small"
            >新增</el-button
          >
        </template>
      </el-input>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="$store.getters['todos/completePercent']"
        :color="customColors"
      >
        <span
          >已完成 {{ $store.getters['todos/doneTodosLen'] }} /
          {{ $store.getters['todos/todosLen'] }}</span
        >
      </el-progress>
    </div>
  </el-card>
  <!-- 注意音频文件路径 -->
  <audio
    id="noticeTag"
    src="../../src/assets/newTaskPleaseHandle.mp3"
    preload="auto"
    type="audio/mpeg"
  ></audio>
</template>

<script>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { Plus } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
import utilData from '../api/utils';
import { ElMessage } from 'element-plus';

export default {
  name: 'HeaderView',
  props: {},
  // 可以省略不写，只是申明方面后续维护
  // emits: ['update:checkAll', 'update:isIndeterminate'],
  setup() {
    const store = useStore();
    // 输入框变量
    const todo = ref('');
    // 标题
    const dateTitle = ref('');
    // 进度条颜色
    const customColors = utilData.CUSTOMCOLORS;
    // 时间选择器
    const endTime = ref(new Date());
    const lastEndTime = ref(new Date());
    let noticeTag = null;
    // 点击添加
    const updateTodo = async (key) => {
      if (store.getters['todos/todosLen'] >= 10) {
        ElMessage.warning('贪多嚼不烂');
        todo.value = '';
        return;
      }
      if (endTime.value === null || endTime.value === undefined) {
        ElMessage.warning('忘了设置截止时间？');
        return;
      }
      let todoObj = {
        id: String(new Date().valueOf()),
        name: key,
        startTime: endTime.value.getTime(),
        status: utilData.TASKSTATUS.CREATED,
      };
      if (todoObj.startTime - todoObj.id <= 300000) {
        ElMessage.warning('任务时间太短了');
        return;
      }
      if (key.trim() === '') {
        ElMessage.warning('总得写点啥吧');
        return;
      }
      let isRename = await store.dispatch('todos/checkName', key);
      if (isRename) {
        ElMessage.warning('已经有相同的任务了');
        return;
      }

      if (lastEndTime.value.getTime() === endTime.value.getTime()) {
        ElMessage.warning('截止时间修改下吧');
        return;
      }
      let isConflict = await store.dispatch(
        'todos/checkNewTaskTime',
        todoObj.startTime
      );
      if (isConflict) {
        ElMessage.warning('任务时间冲突了');
        return;
      }
      ElMessage.closeAll();
      // 更新列表
      store.commit({ type: 'todos/addTodo', todoObj });
      store.commit('todos/saveLocal');
      todo.value = '';
      lastEndTime.value = endTime.value;
      // 异步创建定时器
      await store.dispatch('todos/createTimer', { todoObj, noticeTag });
    };

    // 写法1：直接使用props属性传递（推荐）
    const lightBtn = () => {
      // props.togDark();
      // 暗黑主题
      const isDark = useDark();
      const toggleDark = useToggle(isDark);
      toggleDark();
    };
    // // 写法2：使用 计算属性，如果有复杂计算，可以使用此种方式
    // const btnMsg = computed(() => {
    //     console.log("isBgDark.value = " + props.isBgDark);
    //     return props.isBgDark ? "深色" : "亮色";
    // });
    onBeforeMount(() => {});
    onMounted(() => {
      // 设定日期标题
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      dateTitle.value =
        month +
        1 +
        '月' +
        date.getDate() +
        '日 ' +
        utilData.WEEKCHINESE[date.getDay()];
      noticeTag = document.getElementById('noticeTag');
      // 自动开启暗黑模式，夏季7月8月为20:00, 其他时间为19:00
      let setTimeStr = year + '-' + (month + 1) + '-' + day;
      if (month === 6 || month === 7) {
        setTimeStr += ' 20:00:00';
      } else {
        setTimeStr += ' 19:00:00';
      }
      let setTime = new Date(setTimeStr);
      let darkTimer = setTimeout(() => {
        const isDark = useDark();
        const toggleDark = useToggle(isDark);
        toggleDark();
        clearTimeout(darkTimer);
      }, setTime.getTime() - date.getTime());
    });

    return {
      Plus,
      todo,
      updateTodo,
      lightBtn,
      dateTitle,
      customColors,
      endTime,
      noticeTag,
    };
  },
};
</script>

<style scoped>
.el-card {
  margin: 10px 0;
}

.el-alert {
  margin-bottom: 10px;
}

:deep(.el-alert .el-alert__content) {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-alert .el-alert__content .el-alert__title) {
  font-size: 18px;
  margin-left: 50%;
  transform: translateX(-50%);
}

:deep(.el-alert .el-alert__content .el-alert__description) {
  margin: 0 -10px 0 auto;
  padding: 0;
}

.el-alert .el-alert__content svg {
  width: 2em;
  height: 2em;
  vertical-align: bottom;
}

.card-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-items: center; */
}

:deep(.el-input-group__prepend, .el-input-group__append, .el-input__wrapper) {
  padding: 0px 1px 0px 0px;
}

:deep(.el-time-panel, .el-time-panel__btn, .el-time-panel__btn.confirm) {
  color: black;
}
</style>
