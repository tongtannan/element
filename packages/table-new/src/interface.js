// test
// test
// test
// import Router from 'vue-router'
import Axios from 'ts-axios-ttn'
// import { getToken, clearToken } from './auth'
export default class MyInterface {
  static fetch = (url, method = 'get', data = {}, isMessage, callback) => {
    const toMethod = method.toLocaleLowerCase()
    const onUploadProgress = {
      onUploadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          callback(progressEvent)
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          // var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
          // console.log(complete)
        }
      }
    }
    const baseConfig = {
      baseURL: window.$apiUrl + '/',
      headers:
        toMethod === 'formPost'
          ? {
              'Content-Type': 'multipart/form-data'
              // Authorization: getToken()
              //   ? getToken()
              //   : ''
            }
          : {
              'Content-Type': 'application/json'
              // Authorization: getToken()
              //   ? getToken()
              //   : ''
            }
    }
    const config = callback
      ? Object.assign({}, baseConfig, onUploadProgress)
      : baseConfig
    let instance = Axios.create(config)
    instance =
      toMethod === 'get'
        ? instance.get(url, { params: data })
        : toMethod === 'formPost'
        ? instance.post(url, data)
        : instance[toMethod](url, data)
    return new Promise((resolve, reject) => {
      return instance
        .then(res => {
          resolve(res.data)
          isMessage &&
            this.$message({
              message: res.message,
              type: 'success'
            })
        })
        .catch(err => {
          // if (err.response.status === 401) {
          //   clearToken()
          //   Router.replace({
          //     path: '/login'
          //   })
          // }
          isMessage &&
            this.$message({
              message: err.message,
              type: 'error'
            })
          reject(err)
        })
    })
  }
  constructor(isMessage, callback) {
    this.isMessage = isMessage
    this.callback = callback
  }
  get(url, data = {}) {
    return MyInterface.fetch(url, 'get', data, this.isMessage, this.callback)
  }
  post(url, data = {}) {
    return MyInterface.fetch(url, 'post', data, this.isMessage, this.callback)
  }
  formPost(url, data = {}) {
    return MyInterface.fetch(
      url,
      'formPost',
      data,
      this.isMessage,
      this.callback
    )
  }
  put(url, data = {}) {
    return MyInterface.fetch(url, 'put', data, this.isMessage, this.callback)
  }
  delete(url, data = {}) {
    return MyInterface.fetch(url, 'delete', data, this.isMessage, this.callback)
  }
}
