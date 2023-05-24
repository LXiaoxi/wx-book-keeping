// pages/book-detail/detail-item/index.js
import {
    getAmountDetailRequest
} from '../../../service/api-amount'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        item: null,
        isEdit: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const id = options.id
        this.setData({
            id
        })
        this.getPageData()
    },
    getPageData() {
        getAmountDetailRequest({
            id: this.data.id
        }).then(res => {
            if (res.code === 200) {
                this.setData({
                    item: res.data
                })
            }
        })
    },

    handleEdit() {
        wx.reLaunch({
            url: `/pages/book-keeping/index?item=${JSON.stringify(this.data.item)}`,
        })
    },
    handleDelete() {

    }
})