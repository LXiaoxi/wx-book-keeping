// pages/book-detail/index.js
import {
    getAmountDetailListRequest
} from '../../service/api-amount'
let App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getAmountDetailCondition: {
            page: 0,
            pageSize: 10,
            date: ""
        },
        weekList: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dateArr: [],
        amountDetailList: [],
        year: "",
        month: "",
        expendTotal: 0.00,
        incomeTotal: 0.00,
        haxPageNext: false,
        isHide: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const date = new Date()
        const year = (date.getFullYear()).toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        this.setData({
            year,
            month,
            'getAmountDetailCondition.date': year + "-" + month
        })
        if (!App.globalData.isBookDetailPageRefresh) {
            this.getPageData()
        }

    },
    onShow() {
        if (App.globalData.isBookDetailPageRefresh) {
            this.setData({
                dateArr: [],
                'getAmountDetailCondition.page': 0
            })
            this.getPageData()
            App.globalData.isBookDetailPageRefresh = false
        }

    },
    getPageData() {
        getAmountDetailListRequest(this.data.getAmountDetailCondition).then(res => {
            if (res.code === 200) {
                const newData = res.data.map(item => {
                    const time = new Date(item.date)
                    const month = (time.getMonth() + 1).toString().padStart(2, "0")
                    const day = time.getDate().toString().padStart(2, "0")
                    const week = this.data.weekList[time.getDay()]
                    item.date = month + "月" + day + "日" + week
                    return item
                })
                let map = new Map()
                this.data.dateArr.forEach(item => {
                    map.set(item.date, item.list)
                })
                newData.forEach(item => {
                    if (map.has(item.date)) {
                        map.get(item.date).push(item)
                    } else {
                        map.set(item.date, [item])
                    }
                })
                let monthData = []
                for (let [key, val] of map.entries()) {
                    monthData.push({
                        date: key,
                        list: val,
                    })
                }
                this.setData({
                    amountDetailList: this.data.amountDetailList ? [...this.data.amountDetailList, ...res.data] : res.data,
                    expendTotal: res.expendTotal,
                    incomeTotal: res.incomeTotal,
                    haxPageNext: res.haxPageNext,
                    dateArr: monthData
                })
            }
        })
    },
    handleScroll() {
        if (this.data.haxPageNext) {
            this.setData({
                'getAmountDetailCondition.page': this.data.getAmountDetailCondition.page + 1,
            })
            this.getPageData()
        }
    },
    handleChangeDate(e) {
        const date = e.detail.value
        const year = date.split("-")[0]
        const month = date.split("-")[1]
        this.setData({
            'getAmountDetailCondition.date': e.detail.value,
            'getAmountDetailCondition.page': 0,
            year,
            month,
            dateArr: []
        })
        this.getPageData()
    },
    handleItemClick(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `./detail-item/index?id=${id}`,
        })
    }

})