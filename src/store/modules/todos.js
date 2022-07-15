import network from '../../api/network';
import utilData from '../../api/utils';

// 异步加载
const state = () => ({
  todos: [],
  doneTodos: [],
});

// getters
const getters = {
  todosLen: (state) => {
    return state.todos.length;
  },
  doneTodosLen: (state) => {
    return state.doneTodos.length;
  },
  completePercent: (state) => {
    if (state.todos.length === 0) {
      return 0;
    } else {
      return (state.doneTodos.length / state.todos.length) * 100;
    }
  },
  // 选中 todo 按钮删除状态
  isDone: (state) =>
    state.todos.some((todo) => todo.status === utilData.TASKSTATUS.DONE),
  // 全选状态
  isCheckedAll: (state) => {
    return state.todos.length === state.doneTodos.length;
  },
};

// mutations: 同步更改状态
const mutations = {
  // 更新 doneTodos
  updateDoneTodos(state) {
    state.doneTodos = state.todos.reduce((result, todo) => {
      todo.status === utilData.TASKSTATUS.DONE && result.push(todo.id);
      return result;
    }, []);
  },
  // 添加 todo
  addTodo(state, { todoObj = {} }) {
    state.todos.unshift(todoObj);
  },
  // 更新 todo
  updateTodo(state, { doneTodos = [] }) {
    state.doneTodos = doneTodos;
    state.todos = Array.from(state.todos, (todo) => ({
      ...todo,
      status: doneTodos.includes(todo.id)
        ? utilData.TASKSTATUS.DONE
        : todo.status,
    }));
  },
  // 删除 todo
  deleteTodo(state, { id }) {
    state.todos = state.todos.filter((todo) => todo.id !== id);
  },
  // 全选
  checkAllTodo(state) {
    state.todos = Array.from(state.todos, (todo) => ({
      ...todo,
      status: utilData.TASKSTATUS.DONE,
    }));
  },
  // 清除已完成
  clearAllDoneTodo(state) {
    state.todos = state.todos.filter(
      (todo) => todo.status === utilData.TASKSTATUS.CREATED
    );
    // TODO: 2022-07-15 数据同步
  },
  // 初始化任务
  setTodo(state, task) {
    state.todos = task.todos;
    state.doneTodos = task.doneTodos;
  },
  // 保存至本地缓存中
  saveLocal(state) {
    localStorage.setItem('todos', JSON.stringify(state.todos));
    localStorage.setItem('doneTodos', JSON.stringify(state.doneTodos));
  },
};

// actions
const actions = {
  // 名称重复校验
  checkName({ state }, name) {
    return new Promise((reslove) => {
      reslove(state.todos.some((todo) => todo.name === name));
    });
  },
  // 新任务有效性检测
  checkNewTaskTime({ state }, startTime) {
    return new Promise((reslove) => {
      let tmpList = state.todos.filter(
        (item) => item.status === utilData.TASKSTATUS.CREATED
      );
      // 新任务开始时间必须大于最后一个任务的开始时间5分钟，新任务持续时间必须大于5分钟
      let res = tmpList.some((it) => {
        return startTime - it.startTime < 300000;
      });
      reslove(res);
    });
  },
  // 数据同步
  syncData() {
    return new Promise((reslove) => {
      setTimeout(() => {
        reslove(true);
        // reject('Failed to sync data!');
      }, 1000);
    });
  },
  // 清除已完成
  async clearAllDone({ commit }) {
    commit('clearAllDoneTodo');
    commit('updateDoneTodos');
    commit('saveLocal');
  },

  // 异步访问数据库
  async getAllTodo({ commit }) {
    const todos = await network.getTodos();
    commit('setTodo', todos);
    commit('saveLocal');
  },

  // 异步创建定时器
  createTimer({ state }, obj) {
    return new Promise((reslove) => {
      let num = utilData.NOTIFYFREQ;
      let timer = null;
      // 重复提醒
      function repeatNotice() {
        // 设定时间前检查当前任务状态是否为已完成
        if (state.doneTodos.indexOf(obj.todoObj.id) >= 0) {
          clearTimeout(timer); // 清除定时器
          timer = null;
          return;
        } else if (
          state.todos.filter((item) => item.id === obj.todoObj.id).length <= 0
        ) {
          clearTimeout(timer); // 清除定时器
          timer = null;
          return;
        }
        if (num == 0) {
          clearTimeout(timer); // 清除定时器
          timer = null;
          // 如果该任务状态为 创建，则重置为 未完成
          for (let i = 0; i < state.todos.length; i++) {
            if (
              state.todos[i].id === obj.todoObj.id &&
              state.todos[i].status === utilData.TASKSTATUS.CREATED
            ) {
              state.todos[i].status = utilData.TASKSTATUS.UNDONE;
              return;
            }
          }
          return;
        } else {
          // 播放音效
          obj.noticeTag.play();
          // 震动
          if (window.navigator.vibrate) {
            window.navigator.vibrate([200, 100, 200]);
          }
          timer = setTimeout(repeatNotice, 120000); // 每隔两分钟，递归调用一次
        }
        num--;
      }
      // 创建延迟定时器，默认提前5分钟
      timer = setTimeout(
        repeatNotice,
        obj.todoObj.startTime - obj.todoObj.id - 300000
      );
      reslove(true);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
