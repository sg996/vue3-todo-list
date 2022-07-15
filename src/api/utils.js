const TASKSTATUS = {
  CREATED: 0,
  UNDONE: 1,
  DONE: 2,
};

const NOTIFYFREQ = 3;

const WEEKCHINESE = [
  '星期天',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

const str2Time = (str) => {
  let date = new Date(str);
  return date.toTimeString().substring(0, 5);
};

const CUSTOMCOLORS = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];

export default { TASKSTATUS, NOTIFYFREQ, WEEKCHINESE, str2Time, CUSTOMCOLORS };
