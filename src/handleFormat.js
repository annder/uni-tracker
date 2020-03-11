import { getCurrentActivePage } from './utils';
import { isUndefined, flattenDeep, remove, intersection, chunk } from 'lodash';

/**
 * @description 处理页面埋点的格式化
 * @param {Array} pages 需要埋点的页面
 * @return {Array}
 * */

export const handleTrackerPageDateFormat = pages => {
  let pageFormat = [];
  const { route, __displayReporter } = getCurrentActivePage();
  const findCurrentPage = pages.find(el => el === route);
  if (isUndefined(findCurrentPage)) return pageFormat;
  pageFormat.push(__displayReporter);
  return pageFormat;
};

/**
 * @description 处理需要埋点的函数格式化
 * @param {Object} event 页面中冒泡的事件
 * @return {Array}
 * */

export const handleTrackerFnDataFormat = event => {
  const { eventOpts } = event.currentTarget.dataset; // 相同冒泡的元素
  const { changedTouches: getTouch } = event; // 获取点击的坐标
  const flattenEvent = remove(
    flattenDeep(eventOpts),
    element => element !== '$event'
  );
  let flattenShallow = chunk(flattenEvent).map(element => {
    element.push(...getTouch);
    return element;
  });
  return flattenShallow;
};

/**
 * @description 处理需要埋点的数据格式化
 * @param {Array} dataKey 页面中的数据
 * @return {Array}
 * */

export const handleDatakeysFormat = dataKeys => {
  const { data } = getCurrentActivePage();
  const currentDataKeys = Object.keys(data);
  const findMatchPageData = intersection(currentDataKeys, dataKeys);
  return findMatchPageData.map(el => ({ [el]: data[el] }));
};
