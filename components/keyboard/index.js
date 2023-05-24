// components/keyboard/index.js
import {
    createAmountDetailRequest
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
        expression: "0",
        operation: "完成",
        keyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', '0', 'X'],
        date: null,
        remark: "",
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
            if (this.data.expression === '0') {
                this.data.expression = ''
            }
            let newExpression = this.data.expression.concat(item)
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
                expression: newExpression,
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
            if (this.data.expression === '0') {
                this.data.expression = ''
            }
            this.setData({
                expression: this.data.expression.concat(symbol)
            })
        },
        handleDateChange(e) {
            this.setData({
                date: e.detail.value
            })
        },
        handleRemark(e) {
            const remark = e.detail.value
            this.setData({
                remark
            })
        },
        // 计算结果/创建
        handleOperation() {
            if (this.data.operation === '=') {
                // 计算
                const amount = calcExpression(this.data.expression)
                this.setData({
                    expression: amount.toFixed(3) + "",
                    operation: "完成"
                })

            } else {
                if (this.data.expression == '0') {
                    showMessage("请输入金额")
                    return
                }
                // 发送请求
                const item = this.data.item
                // 获取当前时间
                let date = this.data.date
                if (this.data.date === null) {
                    const time = new Date()
                    const year = time.getFullYear()
                    const month = (time.getMonth() + 1).toString().padStart(2, "0")
                    const day = (time.getDate()).toString().padStart(2, "0")
                    date = year + '-' + month + '-' + day
                }
                const createDetailDto = {
                    icon: item.icon,
                    name: item.name,
                    amount: Number(this.data.expression.replace(/[^\d.]/g, "")).toFixed(2),
                    remark: this.data.remark,
                    isExpend: this.data.isExpend,
                    date,
                }
                if (this.data.isCreate) {
                    createAmountDetailRequest(createDetailDto).then(res => {
                        if (res.code === 200) {
                            showMessage("成功")
                            this.setData({
                                currentIndex: null,
                                expression: "0",
                                remark: "",
                                isRefresh: true
                            })
                        }
                    })
                } else {
                    console.log("编辑");
                }
            }
        }
    },

})