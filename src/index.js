import Vue from 'vue';
import { errorHandler } from './error';
import { fitlerMethod, getTimeStap, calcLeaveTime, getPrevPage } from './utils';
import { isUndefined, isString, intersection } from 'lodash';
import {
  handleDatakeysFormat,
  handleTrackerFnDataFormat,
  handleTrackerPageDateFormat
} from './handleFormat';

export default class Tracker {
  constructor(trackerOptions) {
    if (isUndefined(trackerOptions)) error('请传入参数，确保程序能正常运行。');
    errorHandler.validateTrackerOptions(trackerOptions);
    this.pages = []; // 需要埋点的页面
    this.fns = []; // 需要埋点观察函数
    this.dataKeys = []; // 需要埋点的
    this.leaveTime = 0; // 页面停留时间
    this.reportFn = trackerOptions.reportFn; // 发送埋点的函数
    this.initParam(trackerOptions);

    Vue.mixin(this.injectMixin()); // 注入到所有页面中
  }

  /**
   * @description 初始化埋点选项
   * @param {Object} trackerOptions
   * @return {void}
   */
  initParam(trackerOptions) {
    const initParams = ['fns', 'pages', 'dataKeys'];
    const isUndefinedElement = param => {
      if (isUndefined(trackerOptions[param])) {
        this[param] = [];
      }
    };
    const toArrayFormat = param =>
      isString(trackerOptions[param])
        ? this[param].push(trackerOptions[param])
        : (this[param] = trackerOptions[param]);

    initParams.forEach(el => isUndefinedElement(el));
    initParams.forEach(el => toArrayFormat(el));
  }
  // 注入Vue.mixin中
  injectMixin() {
    const { fns, pages, dataKeys, reportFn } = this;
    return {
      onLoad() {
        this.pageStayTime = 0;
        if (getPrevPage()) {
          const { data } = getPrevPage();
          const getPrevDep = data.trackerDep;
          const stayTime = calcLeaveTime(data.leaveTime, new Date().getTime());
          reportFn.call(null, [...getPrevDep, stayTime]);
        }
      },
      onShow() {
        this.initTracker();
      },
      onHide() {
        this.updateLeaveTime();
      },
      onUnload() {
        this.updateLeaveTime();
      },
      data() {
        return {
          trackerDep: [], // 埋点的依赖，全部写入
          leaveTime: getTimeStap(), // 页面停留时间
          fnRunTime: getTimeStap(), // 函数运行时间
          pageStayTime: 0 // 页面停留时间
        };
      },
      methods: {
        /**
         * @description 初始化埋点
         */
        initTracker() {
          const findIdentialFnName = intersection(fitlerMethod(this), fns); // 找到当前相同的的函数名
          findIdentialFnName.forEach(el => {
            let __delegateEventFn = this[el]; // 委托页面的事件函数
            this[el] = event => {
              let oldRunTime = new Date().getTime();
              __delegateEventFn(event); // 触发事件
              this.fnFormatData = new Date().getTime();
              const fnRunMs = calcLeaveTime(oldRunTime, this.fnFormatData);

              let fnFormatData = handleTrackerFnDataFormat(event);
              let pageFormatData = handleTrackerPageDateFormat(pages);
              const dataKeysFormatData = handleDatakeysFormat(dataKeys);

              this.trackerDep = [
                [...fnFormatData, { runMs: fnRunMs }],
                ...pageFormatData,
                ...dataKeysFormatData
              ];

              reportFn.call(null, [...this.trackerDep]);
            };
          });
        },
        // 在onUnLoad和onHide内自动更新停留时间
        updateLeaveTime() {
          this.leaveTime = new Date().getTime();
        }
      }
    };
  }
}
