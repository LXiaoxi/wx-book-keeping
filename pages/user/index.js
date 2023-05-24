import {
    total
} from '../../service/api-user'
Page({
    data: {
        userInfo: null,
        totalDay: 0,
        totalCount: 0,
        isFirst: true
    },
    onLoad(options) {
        const userInfo = wx.getStorageSync('userInfo')
        const time = new Date().getTime()
        const createTime = new Date(userInfo.createTime).getTime()
        const dateDiff = time - createTime
        const totalDay = Math.floor(dateDiff / (24 * 3600 * 1000));
        this.setData({
            totalDay,
            userInfo
        })
        if (this.data.isFirst) {
            this.getUserCountNumber()
        }

    },
    onShow() {
        if (!this.data.isFirst) {
            this.getUserCountNumber()
        }

    },
    onHide() {
        if (this.data.isFirst) {
            this.setData({
                isFirst: false
            })
        }
    },
    getUserCountNumber() {
        total().then(res => {
            this.setData({
                totalCount: res.data
            })
        })
    }
})