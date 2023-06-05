// components/keyboard/index.js
import {
    createAmountDetailRequest,
    updateAmountDetailRequest
} from '../../service/api-amount'
import {
    calcExpression
} from '../../utils/calc'
import {
    showMessage
} from '../../utils/util'
let App = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        currentIndex: {
            type: Number,
            value: null
        },
        item: {
            type: Object,
            value: {}
        },
        isExpend: {
            type: Boolean,
            value: true
        },
        isCreate: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        operation: "完成",
        keyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', '0', 'X'],
        isRefresh: false,
    },

    /**
     * 组件的方法列表
     */
    pageLifetimes: {
        hide() {
            if (this.data.isRefresh) {
                App.globalData.isBookDetailPageRefresh = true
            }
        },
        show() {
            this.setData({
                isRefresh: false
            })
            App.globalData.isBookDetailPageRefresh = false
        }
    },
    methods: {
        handleKeyBoardItem(e) {
            const item = e.currentTarget.dataset.item
            if (this.data.item.amount === '0') {
                this.data.item.amount = ''
            }

            let newExpression = this.data.item.amount.toString().concat(item)
            let operation = '完成'
            // 删除最后一个元素
            if (item === 'X') {
                newExpression = newExpression.slice(0, newExpression.length - 2)
            }
            // 操作按钮的切换 完成/=
            if (newExpression.includes('+') && !newExpression.endsWith('+') && !newExpression.startsWith("+")) {
                operation = '='
            }
            if (newExpression.includes('-') && !newExpression.endsWith('-') && !newExpression.startsWith("-")) {
                operation = '='
            }
            if (newExpression.includes('*') && !newExpression.endsWith('*') && !newExpression.startsWith("*")) {
                operation = '='
            }
            if (newExpression.includes('/') && !newExpression.endsWith('/') && !newExpression.startsWith("/")) {
                operation = '='
            }

            this.setData({
                'item.amount': newExpression,
                operation
            })
        },
        handleSymbol(e) {
            console.log("23");
            const isAdd = e.currentTarget.dataset.isAdd
            const isMultiply = e.currentTarget.dataset.isMultiply
            let symbol = ''
            if (isAdd != undefined) {
                symbol = isAdd ? '+' : '-'
            }
            if (isMultiply != undefined) {
                symbol = isMultiply ? '*' : '/'
            }
            if (this.data.item.amount === '0') {
                this.data.item.amount = ''
            }
            this.setData({
                'item.amount': this.data.item.amount.concat(symbol)
            })
        },
        handleDateChange(e) {
            this.setData({
                'item.date': e.detail.value
            })
        },
        handleRemark(e) {
            const remark = e.detail.value
            this.setData({
                'item.remark': remark
            })
        },
        // 计算结果/创建
        async handleOperation() {
            if (this.data.operation === '=') {
                // 计算
                const amount = calcExpression(this.data.item.amount)
                this.setData({
                    'item.amount': amount.toFixed(3) + "",
                    operation: "完成"
                })

            } else {
                if (this.data.item.amount == '0') {
                    showMessage("请输入金额")
                    return
                }
                // 发送请求
                const item = this.data.item
                // 获取当前时间
                let date = this.data.item.date
                if (this.data.item.date === null) {
                    const time = new Date()
                    const year = time.getFullYear()
                    const month = (time.getMonth() + 1).toString().padStart(2, "0")
                    const day = (time.getDate()).toString().padStart(2, "0")
                    date = year + '-' + month + '-' + day
                }
                const createDetailDto = {
                    icon: item.icon,
                    name: item.name,
                    amount: Number(this.data.item.amount.toString().replace(/[^\d.]/g, "")).toFixed(2),
                    remark: item.remark,
                    isExpend: this.data.isExpend,
                    date,
                }
                if (!this.data.item.id) {
                    const res = await createAmountDetailRequest(createDetailDto)
                    if (res.code == 200) {
                        showMessage("添加成功")
                        this.setData({
                            isRefresh: true
                        })
                    }
                } else {
                    const item = {
                        ...this.data.item
                    }
                    const amountId = item.id
                    delete item.id
                    const res = await updateAmountDetailRequest(amountId, item)
                    if (res.code == 200) {
                        showMessage("修改成功")
                        this.triggerEvent("refresh")
                    }
                }
            }
        }
    },

})