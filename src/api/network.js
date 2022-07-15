import utilData from '../api/utils';

// 测试数据
const TODOS = [
  {
    id: '1638256190206',
    name: '敲代码',
    startTime: '1638256191770',
    status: utilData.TASKSTATUS.DONE,
  },
  {
    id: '1638256191770',
    name: '整理笔记',
    startTime: '1638256192770',
    status: utilData.TASKSTATUS.DONE,
  },
  {
    id: '1638256192770',
    name: '吃饭',
    startTime: '1638256193770',
    status: utilData.TASKSTATUS.UNDONE,
  },
];

const DONETODOS = ['1638256190206'];

export default {
  async getTodos() {
    try {
      let res = await reqFromDB(1000);
      return res;
    } catch (error) {
      // for testing
      let localTodos = localStorage.getItem('todos');
      let localDoneTodos = localStorage.getItem('doneTodos');
      if (
        localTodos !== null &&
        localTodos !== undefined &&
        localDoneTodos !== null &&
        localDoneTodos !== undefined
      ) {
        return {
          todos: JSON.parse(localTodos),
          doneTodos: JSON.parse(localDoneTodos),
        };
      } else {
        console.log(error);
        return { todos: TODOS, doneTodos: DONETODOS };
      }
    }
  },
};

function reqFromDB(ms) {
  return new Promise((resolve, reject) => {
    // TODO: 2022-07-15 axios通信向数据库请求数据
    setTimeout(resolve, ms);
    console.log('pretend to get data from db');
    // throw new Error("Test error!");
    reject(
      'Ooops...some error happened when requesting data from cloud, please check your network.'
    );
    // resolve(true);
  });
}
