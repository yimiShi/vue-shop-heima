import ajax from './ajax'


// 获取所有权限列表
export const reqAllRights = type => ajax.get('/rights/' + type)
