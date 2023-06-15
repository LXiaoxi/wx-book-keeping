// pages/book-keeping/index.js
import {
    getExpendCategoryListRequest,
    getIncomeCategoryListRequest
} from '../../service/api-expend'
import {
    showMessage
} from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        menu: ["支出", "收入"],
        categoryList: [],
        currentIndex: -1,
        menuIndex: 0,
        item: {
            amount: "0"
        },
        editItem: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const editItem = JSON.parse(options.item ?? null)
        const menuIndex = editItem?.isExpend ? 0 : 1
        if (editItem) {
            this.setData({
                editItem,
                menuIndex
            })
        }
        if (this.data.menuIndex === 0) {
            this.getExpendData()
        } else {
            this.getIncomeData()
        }


    },

    getExpendData() {
        getExpendCategoryListRequest().then(res => {
            if (res.code === 200) {
                this.setData({
                    [`categoryList[${this.data.menuIndex}]`]: res.data
                })
                if (this.data.editItem != null) {
                    const index = res.data.findIndex(item =>
                        item.icon == this.data.editItem.icon
                    )
                    this.setData({
                        currentIndex: index,
                        item: this.data.editItem

                    })
                }
            }
        })


    },
    getIncomeData() {
        getIncomeCategoryListRequest().then(res => {
            if (res.code === 200) {
                this.setData({
                    [`categoryList[${this.data.menuIndex}]`]: res.data
                })
                if (this.data.editItem != null) {
                    const index = res.data.findIndex(item =>
                        item.icon == this.data.editItem.icon
                    )
                    this.setData({
                        currentIndex: index,
                        item: this.data.editItem
                    })
                }
            }
        })
    },
    handleMenuItem(e) {
        const menuIndex = e.detail
        const categoryList = this.data.categoryList
        if (categoryList[menuIndex] === undefined) {
            if (menuIndex === 0) {
                this.getExpendData()
            } else {
                this.getIncomeData()
            }
        }
        this.setData({
            menuIndex,
            currentIndex: -1
        })

    },
    handleItemClick(e) {
        let currentIndex = e.currentTarget.dataset.index
        let categoryList = this.data.categoryList[this.data.menuIndex]
        if (currentIndex === categoryList.length - 1) {
            showMessage("点击设置")
            return
        }
        if (currentIndex === this.data.currentIndex) {
            // currentIndex = -1
            this.setData({
                currentIndex: -1,
                item: null,
                editItem: null
            })
            return
        }
        let item = null
        if (this.data.editItem != null) {
            item = this.data.editItem
        } else {
            item = {
                amount: "0"
            }
        }
        item.name = categoryList[currentIndex].name
        item.icon = categoryList[currentIndex].icon
        this.setData({
            currentIndex,
            item: item
        })
    },
    handelRefresh(e) {
        this.setData({
            editItem: null,
            currentIndex: -1
        })
    },

})