import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

axios.interceptors.request.use(config => {

  const { data, method } = config
  if (method.toLowerCase() == 'post' && data instanceof Object) {
    config.data = qs.stringify(data)
  }
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(response => {
  const { status, msg } = response.data.meta
  if (200 <= status < 300) {
    return response
  }
  Message.error(msg)
  return new Promise(() => { })

}, error => {
  Message.error(error.message)
  return new Promise(() => { })
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

export default axios