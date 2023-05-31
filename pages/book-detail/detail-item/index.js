// pages/book-detail/detail-item/index.js
import {
    getAmountDetailRequest,
    deleteAmountDetailRequest
} from '../../../service/api-amount'
import {
    showMessage
} from '../../../utils/util'
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
        wx.showModal({
            content: '确定删除?',
            success: res => {
                if (res.confirm) {
                    deleteAmountDetailRequest(this.data.id).then(res => {
                        if (res.code == 200) {
                            showMessage("删除成功")
                            const pages = getCurrentPages()
                            const prePage = pages[pages.length - 2]
                            prePage.getPageData(true)
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            }
        })
    }
})