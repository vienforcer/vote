import axios from 'axios';
import cfg from '../config';
import Utility from './Utility';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {

    const { response, message } = error || {};
    const { status, data } = response || {};
    // console.log('-------data---------------');

    switch (status) {
      case 400:
        const { errcode: code, msg: error } = data;
        Utility.Toast(data.msg);
        return Promise.reject({ status, code: code || status, error });
      case 401:
        return Promise.reject({ status, code: 401, data: data || '请选登录' });
      case 403:
      case 404:
        Utility.Toast(data.msg);
        return Promise.reject({ status, code, error: error || data });
      case 500:
        const { msg } = data || {};
        return Promise.reject({ status, code: 500, data: { msg: msg || 'An error occurred' } });
    }

    return Promise.reject({ message: data || message })   // 返回接口返回的错误信息
  }
);


/**
 * API接口请求类
 *
 * @class Httphelper
 */
class Httphelper {

  async __request({ method = 'get', url, headers = {}, params, data }) {
    try {

      if (!url) {
        Utility.Toast('url不存在');
        return Promise.reject('url不存在');
      }
      const _url = `${cfg.ApiService}${url}`;

      const opt = { method, url: _url, headers, params, data };
      const response = await axios(opt);
      const { data: result } = response;
      return result.data || result;
    } catch (ex) {
      const { code, error } = ex;
      switch (code) {
        case 300:
          Utility.PushGlobalStateArray('AlertMsgList', { Title: '参数错误', Content: Utility.IsArray(error) ? error.join(',') : error });
          break;
        case 400:
          Utility.Toast(error, 1500);
          break;
        case 401:
          Utility.Token = '';
          Utility.UserInfo = '';
          Utility.SeGlobalState('UserInfo', null);
          setTimeout(() => {
            Utility.ToPage(Utility.UrlItem.Login, { goBack: 1 })
          }, 200);
          break;
        case 403:
        case 404:
          break;
        default:
          const a = ex;
          console.log(a);
          break;
      }
      Utility.LoadingHide();
      return Promise.reject(error || ex);
    }
  }

  /**
   * 提交
   *
   * @param {*} { url, headers, params, data }
   * @returns
   * @memberof Httphelper
   */
  async onPost({ url, headers, params, data }) {
    return this.__request({ method: 'post', url, headers, params, data });
  }

  /**
   * 修改
   *
   * @param {*} { url, headers, params, data }
   * @returns
   * @memberof Httphelper
   */
  async onPut({ url, headers, params, data }) {
    return this.__request({ method: 'put', url, headers, params, data });
  }

  /**
   * 删除
   *
   * @param {*} { url, headers, params, data }
   * @returns
   * @memberof Httphelper
   */
  async onDelete({ url, headers, params, data, }) {
    return this.__request({ method: 'delete', url, headers, params, data, });
  }

  /**
   * 获取
   *
   * @param {*} { url, headers, params }
   * @returns
   * @memberof Httphelper
   */
  async onGet({ url, headers, params }) {
    return this.__request({ method: 'get', url, headers, params });
  }


}

export default new Httphelper();