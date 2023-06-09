import xxRequest from './index'

// 获取金额明细
export function getAmountDetailListRequest(data) {
    return xxRequest.get('/amount/detail/list', data)
}

// 添加金额明细
export function createAmountDetailRequest(data) {
    return xxRequest.post(`/amount/detail/add`, data)
}
// 编辑金额明细
export function updateAmountDetailRequest(amountId, data) {
    return xxRequest.put(`/amount/detail/update/${amountId}`, data)
}
// 删除金额明细
export function deleteAmountDetailRequest(amountId) {
    return xxRequest.delete(`/amount/detail/delete/${amountId}`)
}

// 获取单个金额明细
export function getAmountDetailRequest(data) {
    return xxRequest.get(`/amount/detail`, data)
}

// 金额统计
export function getAmountStatisticalRequest(data) {
    return xxRequest.get(`/amount/statistical`, data)
}