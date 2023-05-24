import xxRequest from './index'

// 获取金额明细
export function getAmountDetailListRequest(data) {
    return xxRequest.get('/amount/detail/list', data)
}

// 添加金额明细
export function createAmountDetailRequest(data) {
    return xxRequest.post(`/amount/detail/add`, data)
}

// 获取单个金额明细
export function getAmountDetailRequest(data) {
    return xxRequest.get(`/amount/detail`, data)
}

// 金额统计
export function getAmountStatisticalRequest(data) {
    return xxRequest.get(`/amount/statistical`, data)
}