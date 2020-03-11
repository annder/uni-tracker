import { has, isString, isFunction, isUndefined } from 'lodash';
/**
 * @description 封装错误提示的函数
 * @param {String} errorInfo 错误信息
 * @param {String} tips 错误的提示信息
 * @return {undefined}
 * */
const error = (errorInfo, tips) => {
  const error_ = console.error;
  const TrackererrorInfo = `[Tracker error] ${errorInfo}`;
  if (tips) {
    error_(`
        ${TrackererrorInfo}
        [$Tips$]，${tips}
        `);
    return;
  }
  error_(TrackererrorInfo);
  return;
};

export const errorHandler = {
  validateTrackerOptions(trackerOpt) {
    /**
     * @description 是否有其属性和是否是数组或对象类型
     * @param {String} prop tacker的属性
     */
    const hasProp_isStrOrArray = prop =>
      !has(trackerOpt, prop) &&
      (!isString(trackerOpt[prop]) || !isArray(trackerOpt[prop]));
    if (hasProp_isStrOrArray('fns')) error('请传入fns类型为字符新或数组');
    if (isUndefined(trackerOpt.reportFn) && !isFunction(trackerOpt.reportFn))
      error('请传入一个函数，以供接收参数');
  }
};
