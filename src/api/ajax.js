import axios from 'axios'
import qs from 'qs'


axios.interceptors.request.use(config => {

  const { data, method } = config
  if (method.toLowerCase() == 'post' && data instanceof Object) {
    config.data = qs.stringify(data)
  }
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

export default axios