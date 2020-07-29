import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from "element-ui"

// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message