/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const API = axios.create({
  baseURL: '',
});
let CancelToken = axios.CancelToken;
window.cancel = null
class HttpHelper {
  static async get(url, params) {
      if(params?.params?.use_count){
          window.cancel && window.cancel('cancel request')
      }
      const data = await API.get(url,params,{cancelToken:new CancelToken((c) => {
              if(params?.params?.use_count){
                  window.cancel = c
              }
          })});
    if (data && data.status === 200) {
      return data.data;
    }
    console.error('request from server failed:', data);
    return null;
  }

  static async post(url, payload) {
    const data = await API.post(url, payload);
    if (data && data.status === 200) {
      return data.data;
    }
    console.error('request from server failed:', data);
    return null;
  }
}

export { HttpHelper };
