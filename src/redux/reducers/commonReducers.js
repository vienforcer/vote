import Utility from "../../common/Utility";

// import types from '../typeConst';

const __Base = 'XIAOTUNI/REDUX/Common';
const __GLOBAL_STATE = `${__Base}/global/state`; //        所有状态数据
const __UPDATE_CONTENT = `${__Base}/UPDATE_CONTENT`; //    更新内容
const __ARRAY_PUSH = `${__Base}/ARRAY_PUSH`;    //         push数据到数组里去
const __ARRAY_POP = `${__Base}/ARRAY_POP`;    //           从数据里pop元素出来
const __ARRAY_DELETE = `${__Base}/ARRAY_DELETE`; //        从数组中删除元素
const __TOAST_ADD = `${__Base}/TOAST_ADD`; //              添加消息
const __TOAST_DELETE = `${__Base}/TOAST_DELETE`; //        删除消息

const __API = `${__Base}/API`;
const __LOADING = `${__API}/LOADING`;                   // Loading
const __LOAD_SUCCESS = `${__API}/LOAD_SUCCESS`;         // Load SUCCESS
const __LOAD_FAIL = `${__API}/LOAD_FAIL`;               // Load FAIL
const __POST = `${__API}/POST`;                         // POST
const __GET = `${__API}/GET`;                           // get
const __DELETE = `${__API}/DELETE`;                     // delete
const __PUT = `${__API}/PUT`;                           // put
const __UPLOAD = `${__API}/UPLOAD`;                     // upload

const TypeMap = {
  LOADING: __LOADING,
  LOAD_SUCCESS: __LOAD_SUCCESS,
  LOAD_FAIL: __LOAD_FAIL,
  POST: __POST,
  GET: __GET,
  PUT: __PUT,
  DELETE: __DELETE,
  UPDATE_CONTENT: __UPDATE_CONTENT,
  ARRAY_PUSH: __ARRAY_PUSH,
  ARRAY_POP: __ARRAY_POP,
  ARRAY_DELETE: __ARRAY_DELETE,
  TOAST_ADD: __TOAST_ADD,
  TOAST_DELETE: __TOAST_DELETE,
  GLOBAL_STATE: __GLOBAL_STATE,
  UPLOAD: __UPLOAD,
}

Utility.SetContent(Utility.ConstItem.KeyReduxTypeMap, TypeMap);


class StoreHelper {

  /**
   * 请示返回来的数据进行处理。
   *
   * @static
   * @param {*} state
   * @param {*} action
   * @returns
   * @memberof StoreHelper
   */
  static DealRequest(state, action) {
    // console.log(action);
    const { stateName, payload, options, } = action;
    const { args } = options;
    const { params = {}, data = {} } = args || {};
    const { _serviceTime, list } = payload;

    if (_serviceTime > 0) {
      state.ServiceTime = _serviceTime;                 // 服务器时间
    }

    if (!Utility.IsArray(list)) {
      state[stateName || 'result'] = payload;
      return state;
    }

    // 判断是否完成。
    const { page, size } = payload;
    const Condition = { ...data, ...params, isComplete: false, page };
    if (list.length < size) {
      Condition.isComplete = true;
    }
    // if (!state[stateName] || page <= 1) {
    payload.Condition = Condition;
    state[stateName] = payload;
    state[stateName].Condition = Condition;
    //   return state;
    // }
    // 数据拼接 移动端才会这样拼接。
    // const { list: oldList } = state[stateName];
    // const newList = oldList.concat(list)
    // state[stateName].list = newList;
    // state[stateName].list = list;
    // state[stateName].Condition = Condition;
    return state;
  }

  /**
   * 更新内容
   *
   * @static
   * @param {*} state
   * @param {*} action
   * @returns
   * @memberof StoreHelper
   */
  static UpdateContent(state, action) {
    const { stateName, value } = action;
    state[stateName] = value;
    return state;
  }

  /**
   * 数组操作。
   *
   * @static
   * @param {*} state
   * @param {*} action
   * @returns
   * @memberof StoreHelper
   */
  static ArrayOperator(state, action) {
    const { type, stateName, value } = action;
    if (!state[stateName]) {
      state[stateName] = [];
    }
    const list = state[stateName];
    const size = list.length;
    switch (type) {
      case TypeMap.ARRAY_PUSH:
        list.push(value);
        break;
      case TypeMap.ARRAY_DELETE:
        for (let i = 0; i < size; i += 1) {
          if (list[i] === value) {
            list.splice(i, 1);
          }
        }
        break;
      case TypeMap.ARRAY_POP:
        list.pop();
        break;
    }
    return state;
  }

  static ToastOperator(state, action) {
    if (!state.ToastMap) {
      state.ToastMap = {};
      state.ToastList = [];
    }
    const size = state.ToastList.length;
    const { value, index, type } = action;
    if (type === TypeMap.TOAST_DELETE) {
      delete state.ToastMap[index];
    } else if (type === TypeMap.TOAST_ADD) {
      const key = `${size}_${Date.now()}`;
      state.ToastMap[key] = { ...value, index: key };
    }
    state.ToastList = Object.values(state.ToastMap);
    return state;
  }
}

export default function reduces(state = { loading: false, _ts: new Date() }, action = {}) {
  let result = { ...state };
  switch (action.type) {
    case TypeMap.LOADING:
      result.loading = true;
      break;
    case TypeMap.LOAD_SUCCESS:
      result.loading = false;
      result.success = true;
      break;
    case TypeMap.LOAD_FAIL:
      result.loading = false;
      break;
    case TypeMap.POST:
    case TypeMap.GET:
      result = StoreHelper.DealRequest(result, action);
      break;
    case TypeMap.PUT:
    case TypeMap.DELETE:
      result[action.stateName || 'resultData'] = action.data;
      break;
    case TypeMap.UPDATE_CONTENT:
      result = StoreHelper.UpdateContent(result, action);
      break;
    case TypeMap.ARRAY_DELETE:
    case TypeMap.ARRAY_PUSH:
    case TypeMap.ARRAY_POP:
      result = StoreHelper.ArrayOperator(result, action);
      break;
    case TypeMap.TOAST_ADD:
    case TypeMap.TOAST_DELETE:
      result = StoreHelper.ToastOperator(result, action);
      break;
    case TypeMap.GLOBAL_STATE:
      break;
    default:
      console.log('action.type:', action.type);
  }

  return result;
}

export const onApiDelete = ({ apiInfo, stateName, args: { params } }) => {
  return {
    types: [TypeMap.LOADING, TypeMap.DELETE, TypeMap.LOAD_SUCCESS, TypeMap.LOAD_FAIL],
    promise: (client) => client.onDelete({ apiInfo, params }),
    options: { apiInfo, params },
    stateName
  }
}

export const onApiGet = ({ apiInfo, stateName, args: { params } }) => {
  return {
    types: [TypeMap.LOADING, TypeMap.GET, TypeMap.LOAD_SUCCESS, TypeMap.LOAD_FAIL],
    promise: (client) => client.onGet({ apiInfo, params }),
    condition: { ...params },
    stateName
  }
}

export const onApiPost = ({ apiInfo, stateName, args: { data, params } }) => {
  return {
    types: [TypeMap.LOADING, TypeMap.POST, TypeMap.LOAD_SUCCESS, TypeMap.LOAD_FAIL],
    promise: (client) => client.onPost({ apiInfo, data, params }),
    condition: { params, data },
    stateName
  }
}

export const onApiPut = ({ apiInfo, stateName, args: { data, params } }) => {
  return {
    types: [TypeMap.LOADING, TypeMap.PUT, TypeMap.LOAD_SUCCESS, TypeMap.LOAD_FAIL],
    promise: (client) => client.onPut({ apiInfo, data, params }),
    condition: { params, data },
    stateName
  }
}