import xxRequest from './index'
// 获取支出分类
export function getExpendCategoryListRequest() {
    return xxRequest.get(`/expend/category/list`)
}
// 获取收入分类
export function getIncomeCategoryListRequest() {
    return xxRequest.get(`/income/category/list`)
}
