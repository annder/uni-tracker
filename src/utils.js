import { isFunction } from 'lodash';

/**
 * @description 过滤页面的事件函数
 * @param {Object} pageInfo
 * @return {Array<string>}
 * */
export const fitlerMethod = pageInfo =>
  Object.keys(pageInfo).filter(
    el => !el.match(/^on/) && isFunction(pageInfo[el])
  );

/**
 * @description 获取当前页面的数据
 * @return {Object}
 * */

export const getCurrentActivePage = () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  return page;
};

/**
 * @description 获取上一个页面的数据
 * @return {Object}
 * */
export const getPrevPage = () => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  return prevPage;
};

/**
 * @description 当前时间戳
 * @return {Number}
 * */

export const getTimeStap = () => new Date().getTime();

/**
 * @description 计算页面停留的时间
 * @param {Number} oldTime
 * @param {Number} newTime
 * @return {Number}
 * */
export const calcLeaveTime = (oldTime, newTime) => newTime - oldTime;
