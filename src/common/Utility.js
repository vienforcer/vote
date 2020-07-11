import UrlMap from '../rotuer/RouteMap';
import { MD5 } from 'crypto-js';
import cfg from '../config';


Array.prototype.FindIndex = function (item) {
  const items = this;
  for (let i = 0; i < items.length; i += 1) {
    if (items[i] == item) {
      return i;
    }
  }
  return -1;
}


export default class Utility {

  static __Instance;

  constructor() {
    this._TempSaveContent = {};
    this.__ConstPrefix = 'WeiXinXTN';
  }

  /**
   * 实例
   * @returns {*}
   */
  static instance() {
    if (this.__Instance === null || typeof this.__Instance === 'undefined') {
      this.__Instance = new this();
    }
    return this.__Instance;
  }

  static Cfg = cfg;

  /**
   * 常量
   * @type {{SaveUrlPath: string}}
   */
  static ConstItem = {
    PageSize: 15, //                                                  每页大小数据
    CaptchaTimeout: 60,
    KeyDispatch: 'XTN_KeyDispatch',//                                 用于 dispatch 用的。
    KeyGlobalState: 'XTN_KeyGlobalState',//                           用于 全局的状态 State 用的。
    KeyHistory: 'XTN_KeyHistory',//                                   用于 history 用的。
    KeyReduxTypeMap: 'XTN_KeyReduxTypeMap',//                         用于 dispatch 用的。
    /**
     * 当前的上下文
     */
    Context: 'XTNContext',                                             // 当前页面的Context

    /**
     * 事件
     */
    Event: 'onXTNEvent',                                               // 事件。
    Events: {
      HttpStatus: {
        1: 'onHttpStatus_XTN_1',
        200: 'onHttpStatus_XTN_200',                  // 处理成功
        400: 'onHttpStatus_XTN_400',                  // 请求无效
        401: 'onHttpStatus_XTN_401',                  // 未授权访问
        402: 'onHttpStatus_XTN_402',
        403: 'onHttpStatus_XTN_403',                  // 禁止访问
        404: 'onHttpStatus_XTN_404',                  // 资源未找到
        405: 'onHttpStatus_XTN_405',
        406: 'onHttpStatus_XTN_406',
        407: 'onHttpStatus_XTN_407',
        408: 'onHttpStatus_XTN_408',
        409: 'onHttpStatus_XTN_409',
        411: 'onHttpStatus_XTN_411',                   // 登陆超时
        500: 'onHttpStatus_XTN_500',                   // 服务器错误
        501: 'onHttpStatus_XTN_501',
        502: 'onHttpStatus_XTN_502',
        503: 'onHttpStatus_XTN_503',
      },

      OnGoBack: 'onXTNEvent_GoBack',                                             // 页面退回事件
      OnEditPageSliderInfo: 'onXTNEvent_EditPageSliderInfo',                     // 页面切换
      OnSetTitle: 'onXTNEvent_OnSetTitle',                                       // 修改导航条的标题
    },
    KeyUserInfo: 'XTN_USERINFO',                                                    // 用户信息
    KeyToken: 'XTN_TOKEN',                                                          // 根据token返回的用户信息
  }

  static UrlItem = UrlMap;


  /**
   * 设置内容,这里主要是用来存放临时数据的。
   * @method _SetContent
   * @param key  键值，用于下次的时候获取内容用的。其实就是 _TempSaveContent的属性名称。
   * @param content 要存储的内容
   * @param isSaveLocalStorage 是否保存到本地存储里面
   * @param IsUser 根据用户uid 来获取缓存里的数据。
   * @private
   */
  static SetContent(key, content, isSaveLocalStorage, IsUser) {
    try {
      const self = this.instance();
      if (isSaveLocalStorage) {
        let __Content = content;
        if (IsUser) {
          const __UserInfo = self._TempSaveContent[this.ConstItem.API.UserInfo];
          if (typeof __UserInfo !== 'undefined' && __UserInfo !== null) {
            __Content = {};
            __Content[__UserInfo.member_id] = content;
          }
        }
        __Content = JSON.stringify(__Content);
        // __content = CryptoJS.AES.encrypt(__Content, __key);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, __Content);
        }
      }
      self._TempSaveContent[key] = content;
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 删除指定字段值。
   * @method __RemoveContent
   * @param key
   * @return {null}
   * @private
   */
  static RemoveContent(key, IsRemoveLocalStorage) {
    try {
      const __self = this.instance();
      if (key === null || typeof key === 'undefined') {
        return;
      }
      if (__self._TempSaveContent.hasOwnProperty(key)) {
        delete __self._TempSaveContent[key];
      }

      if (IsRemoveLocalStorage && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (ex) {
      this.printLog(ex.toString());
    }
  }

  /**
   * 获取内容，
   * @method _GetContent
   * @param key 健名称。其实就是 _TempSaveContent的属性名称。
   * @return {*} 返回内容
   * @private
   */
  static GetContent(key, IsUser) {
    try {
      let __Content = null;
      const __self = this.instance();
      if (__self._TempSaveContent.hasOwnProperty(key)) {
        __Content = __self._TempSaveContent[key];
        return __Content;
      }
      if (typeof window === 'undefined') {
        return null;
      }
      if (__Content === null || typeof __Content === 'undefined') {
        const _value = window.localStorage.getItem(key);
        if (_value !== null && _value !== '' && typeof _value !== 'undefined') {
          const __JSONValue = JSON.parse(_value);
          __self._TempSaveContent[key] = JSON.parse(_value);
          if (IsUser) {
            if (__self._TempSaveContent.hasOwnProperty(this.ConstItem.API.UserInfo)) {
              const __UserInfo = __self._TempSaveContent[this.ConstItem.API.UserInfo];
              if (__JSONValue.hasOwnProperty(__UserInfo.member_id)) {
                __self._TempSaveContent[key] = __JSONValue[__UserInfo.member_id];
              } else {
                __self._TempSaveContent[key] = null;
              }
            } else {
              __self._TempSaveContent[key] = null;
            }
          }
          __Content = __self._TempSaveContent[key];
        }
      }

      return __Content;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /**
   * 是否是数组
   * @param obj
   * @returns {boolean}
   */
  static IsArray(obj) {
    if (!obj || !obj.length || obj.length < 1) {
      return false;
    }
    return Array.isArray(obj);
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * @method __FormatDate
   * @param fmt
   * @param date
   * @return {*}
   * @example
   *  Utility.FormatDate('yyyy-MM-dd hh:mm:ss.S',new Date());
   * @constructor
   */
  static FormatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!date) {
      return '';
    }
    let __this = new Date();
    let _fmt = fmt || 'yyyy-MM-dd HH:mm:ss.S';
    if (date !== null) {
      if (Date.parse(date)) {
        __this = new Date(date);
      } else {
        try {
          __this = new Date(date);
        } catch (ex) {
          __this = new Date();
        }
      }
    }
    const oo = {
      'M+': __this.getMonth() + 1, //                               月份
      'd+': __this.getDate(), //                                    日
      'D+': __this.getDate(), //                                    日
      'H+': __this.getHours(), //                                   小时
      'h+': __this.getHours(), //                                   小时
      'm+': __this.getMinutes(), //                                 分
      's+': __this.getSeconds(), //                                 秒
      'q+': Math.floor((__this.getMonth() + 3) / 3), //             季度
      'S': __this.getMilliseconds() //                              毫秒
    };
    if (/(y+)/.test(_fmt)) {
      const fmt1 = _fmt.replace(RegExp.$1, (__this.getFullYear() + '').substr(4 - RegExp.$1.length));
      _fmt = fmt1;
    }
    for (const kk in oo) {
      if (new RegExp('(' + kk + ')').test(fmt)) {
        _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (oo[kk]) : (('00' + oo[kk]).substr(('' + oo[kk]).length)));
      }
    }
    return _fmt;
  }

  static ParseUrl(url) {
    if (!url) {
      return {};
    }
    if (url.indexOf('?') < 0) {
      return {};
    }
    const val = url.split('?')[1];
    const pMap = {};
    val.split('&').forEach((row) => {
      const [key, value] = row.split('=');
      pMap[key] = encodeURIComponent(value);
    })
    return pMap;
  }

  /**
   * 页面跳转
   * @param url 要跳转的页面。
   * @param params 参数
   */
  static ToPage(urlInfo, params, search) {
    try {
      const history = this.GetContent(this.ConstItem.KeyHistory);
      if (!history) {
        return;
      }
      if (typeof urlInfo === 'object' && urlInfo.path === 'goback') {
        history.goBack();
        return;
      }
      const oParams = Object.assign({}, params, { _ts: new Date().getTime() });
      const opt = { pathname: typeof urlInfo === 'object' ? urlInfo.path : urlInfo, params: oParams, query: oParams, state: oParams, search };
      history.push(opt);

    } catch (ex) {
      console.log(ex.toString());
    }
  }

  /**
   * 后退操作
   *
   * @static
   *
   * @memberOf Utility
   */
  static GoBack(times) {
    this.ToPage({ path: 'goback' }, { times: times });
  }

  /**
   * 事件处理
   * @param eventName 事件名称
   * @param args      参数名称1 
   */
  static $emit(eventName, args) {
    if (this.IsUndefined(eventName)) {
      return;
    }
    const event = this.GetContent(this.ConstItem.Event);
    if (this.IsUndefined(event) || event === null) {
      return;
    }
    if (!this.isFunction(event.emit)) {
      return;
    }
    event.emit(eventName, args);
  }

  /**
   * 添加事件
   * @param eventName  {string}  事件名称
   * @param callBack  {function} 回调的方法名称
   */
  static $on(eventName, callBack) {
    if (this.IsUndefined(eventName)) {
      return;
    }
    const event = this.GetContent(this.ConstItem.Event);
    if (this.IsUndefined(event) || event === null) {
      return;
    }
    if (!this.isFunction(event.on)) {
      return;
    }
    event.on(eventName, callBack);
  }

  /**
   * 打开加载动画
   */
  static Loading() {
    this.SeGlobalState('IsLoading', true);
  }

  /**
   * 关闭加载动画
   */
  static LoadingHide() {
    setTimeout(() => {
      this.SeGlobalState('IsLoading', false);
    }, 200);
  }


  /**
   * 判断是否是函数
   * @param func 判断函数对象
   * @returns {boolean} true:成功，false:失败。
   */
  static isFunction(func) {
    if (func !== null && typeof func !== 'undefined' && func.constructor.name === 'Function') {
      return true;
    }
    return false;
  }

  /**
   * 克隆数据
   *
   * @static
   * @param {*} obj
   * @returns
   * @memberof Utility
   */
  static Clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 加密
   *
   * @static
   * @param {*} val
   * @returns
   * @memberof Utility
   */
  static Md5(val) {
    if (!val) {
      return '';
    }
    return MD5(val).toString();
  }

  static async SeGlobalState(stateName, value) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    return dispatch({ type: typeMap.UPDATE_CONTENT, stateName, value });
  }

  static async PushGlobalStateArray(stateName, value) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    return dispatch({ type: typeMap.ARRAY_PUSH, stateName, value });
  }

  static async DeleteGlobalStateArray(stateName, value) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    return dispatch({ type: typeMap.ARRAY_DELETE, stateName, value });
  }

  static Toast(msg, times) {
    return this.ToastAdd(msg, times);
  }
  static ToastAdd(msg, times = 1500) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    return dispatch({ type: typeMap.TOAST_ADD, value: { msg, times } });
  }

  static ToastDelete(index) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    return dispatch({ type: typeMap.TOAST_DELETE, index });
  }


  /**
   * 数据请求。
   *
   * @static
   * @param {*} { method, url, stateName, args }
   * @returns
   * @memberof Utility
   */
  static async __HttpRequest({ method, url, stateName, args }) {
    const dispatch = Utility.GetContent(Utility.ConstItem.KeyDispatch);
    if (!dispatch) {
      return;
    }
    const { params = {}, data = {}, headers } = args || {};
    const typeMap = Utility.GetContent(Utility.ConstItem.KeyReduxTypeMap);
    const action = {
      types: [typeMap.LOADING, typeMap[(method || 'GET').toUpperCase()], typeMap.LOAD_SUCCESS, typeMap.LOAD_FAIL],
      promise: (client) => client[`on${method}`]({ url, params, data, headers }),
      options: { url, args },
      stateName
    };
    return dispatch({ ...action });
  }

  /**
   * 获取数据
   *
   * @static
   * @param {*} { url, stateName, options }
   * @returns
   * @memberof Utility
   */
  static async onApiGet({ url, stateName, options }) {
    return this.__HttpRequest({ method: 'Get', url, stateName, args: options || {} });
  }

  /**
   * 修改
   *
   * @static
   * @param {*} { url, stateName, options: { params, data } }
   * @returns
   * @memberof Utility
   */
  static async onApiPut({ url, stateName, options: { params = {}, data } }) {
    return this.__HttpRequest({ method: 'Put', url, stateName, args: { params, data } });
  }

  /**
   * 提交
   *
   * @static
   * @param {*} { url, stateName, options: { params, data } }
   * @returns
   * @memberof Utility
   */
  static async onApiPost({ url, stateName, options: { params = {}, data } }) {
    return this.__HttpRequest({ method: 'Post', url, stateName, args: { params, data } });
  }
  /**
   * 删除
   *
   * @static
   * @param {*} { url, stateName, options: { params } }
   * @returns
   * @memberof Utility
   */
  static async onApiDelete({ url, stateName, options: { params = {}, data = {} } }) {
    return this.__HttpRequest({ method: 'Delete', url, stateName, args: { params, data } });
  }

  static get Token() {
    return Utility.GetContent(Utility.ConstItem.KeyToken);
  }

  static set Token(val) {
    Utility.SetContent(Utility.ConstItem.KeyToken, val, true);
  }
  static get UserInfo() {
    return Utility.GetContent(Utility.ConstItem.KeyUserInfo);
  }

  static set UserInfo(val) {
    Utility.SetContent(Utility.ConstItem.KeyUserInfo, val, true);
  }

}
