// pages/chart/index.js
import * as echarts from '../../ec-canvas/echarts';
import {
    getAmountStatisticalRequest
} from '../../service/api-amount'
import {
    getWeek,
    getCurrentTime,
    getMonthDay
} from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ec: {
            lazyLoad: true
        },
        menu: ["支出", "收入"],
        menuDate: ["周", "月", "年"],
        menuIndex: 0,
        menuDateIndex: 0,
        weeks: null,
        weeksData: null,
        months: null,
        monthsData: null,
        years: null,
        dateIndex: 0,
        chartData: null,
        rankingData: null,
        isFirst: true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (this.data.isFirst) {
            this.getPageData()
        }

    },
    onShow() {
        if (!this.data.isFirst) {
            this.getPageData()
        }
    },
    onHide() {
        if (this.data.isFirst) {
            this.setData({
                isFirst: false
            })
        }
    },
    getPageData() {
        const menuDateIndex = this.data.menuDateIndex

        if (menuDateIndex === 0) {
            this.handleWeeks()
        } else if (menuDateIndex === 1 && this.data.months == null) {
            this.handleMonths()
        } else if (menuDateIndex === 2 && this.data.years == null) {
            this.handleYear()
        }
        const weekData = this.data.weeksData[this.data.dateIndex]
        const searchDto = {
            isExpend: this.data.menuIndex === 0 ? 1 : 0,
            date: this.data.weeksData[this.data.dateIndex],
            type: this.data.menuDateIndex
        }
        let xData = ""
        switch (menuDateIndex) {
            case 0:
                searchDto.date = weekData.join('|')
                xData = weekData.map(item => item.replace(item.slice(0, 5), ""))
                break;
            case 1:
                searchDto.date = this.data.monthsData[this.data.dateIndex].map(item => '2023' + '-' + this.data.months[this.data.dateIndex] + "-" + item).join('|')
                xData = this.data.monthsData[this.data.dateIndex]
                break;
            case 2:
                searchDto.date = this.data.yearsData.map(item => this.data.years[this.data.dateIndex] + '-' + item).join("|")
                xData = this.data.yearsData
                break;
            default:
                break
        }
        getAmountStatisticalRequest(searchDto).then(res => {
            this.setData({
                rankingData: res.data.ranking,
                chartData: res.data.list,
                total: res.data.total
            })
            this.initpie(xData, res.data.list)
        })


    },
    handleWeeks() {
        let weeks = getWeek()
        const dateStr = getCurrentTime()
        const newWeeks = []
        const newWeeksData = []
        for (let i in weeks) {
            let isFlag = false
            weeks[i].forEach(item => {
                if (item > dateStr) {
                    isFlag = true
                    return;
                }
            })
            newWeeks.push(i)
            newWeeksData.push(weeks[i])
            if (isFlag) {
                break;
            }
        }
        this.setData({
            weeks: newWeeks.reverse(),
            weeksData: newWeeksData.reverse()
        })
    },
    handleMonths() {
        const time = new Date()
        const month = time.getMonth() + 1
        const months = []
        const monthsData = []
        for (let i = 1; i <= month; i++) {
            months.push(i.toString().padStart(2, "0"))
            let days = getMonthDay(time.getFullYear(), i)
            let data = []
            for (let i = 1; i <= days; i++) {
                data.push(i.toString().padStart(2, "0"))
            }
            monthsData.push(data)
        }
        this.setData({
            months: months.reverse(),
            monthsData: monthsData.reverse()
        })
    },
    handleYear() {
        const time = new Date()
        const year = time.getFullYear()
        const newYears = []
        const newYearsData = Array.of('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12')
        for (let i = year; i >= year - 5; i--) {
            newYears.push(i)
        }

        this.setData({
            years: newYears,
            yearsData: newYearsData
        })

    },
    handleMenuItem(e) {
        const menuIndex = e.detail
        this.setData({
            menuIndex
        })
        this.getPageData()
    },
    handleMenuDateItem(e) {
        const menuDateIndex = e.detail
        this.setData({
            menuDateIndex,
            dateIndex: 0
        })
        this.getPageData()
    },
    handleDateItem(e) {
        const index = e.currentTarget.dataset.index
        this.setData({
            dateIndex: index
        })
        // 发送请求
        this.getPageData()
    },
    initpie(xData, chartData) {
        let ecComponent = this.selectComponent('#echarts');
        ecComponent.init((canvas, width, height, dpr) => {
            // 获取组件的 canvas、width、height 后的回调函数
            // 在这里初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
            });
            //调用设定EChart报表状态的函数，并且把从后端拿到的数据传过去
            setOption(chart, xData, chartData);
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return chart;
        });
    },

})

// 初始化图表函数
function setOption(chart, xData, chartData) {
    var option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,

            data: xData,
            axisTick: {
                alignWithLabel: true,
                show: false

            },
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
        },
        legend: {
            lineStyle: {
                color: '#ffda44'
            },
            z: -1
        },
        grid: {
            top: 0,
            left: 25,
            right: 25,
            bottom: 25,
        },
        yAxis: {
            show: false,
            axisLine: {
                lineStyle: {
                    color: '#ffda44'
                }
            },
        },

        series: [{
            data: chartData.map(item => {
                return item.amount < 0 ? -item.amount : item.amount
            }),
            type: 'line',
            itemStyle: {
                normal: {
                    color: '#ffda44', //改变折线点的颜色
                    lineStyle: {
                        color: '#dfdfdf' //改变折线颜色
                    }
                }
            }
        }]
    };
    chart.setOption(option);
    return chart;
}