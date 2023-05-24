import xxRequest from './index'
export function login(data) {
    return xxRequest.post('/user/login', data)
}
// 获取用户总记账笔数
export function total() {
    return xxRequest.get('/user/book-keeping/total')
}
export function test() {
    return xxRequest.get('/test')
}