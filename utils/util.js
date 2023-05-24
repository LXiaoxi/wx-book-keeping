const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function getCurrentTime() {
    const time = new Date()
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const day = time.getDate()
    return year + '-' + formatNumber(month) + '-' + formatNumber(day)

}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}
const showMessage = (message, isBack = false, duration = 1500, icon = "none", mask = true) => {
    wx.showToast({
        icon,
        title: message,
        duration,
        mask,
        success: () => {
            if (isBack) {
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, duration)
            }
        }
    })
}
// 获取周
function getWeek(year) {
    let days = getDate(year || new Date().getFullYear())
    let weeks = {};
    for (let i = 0; i < days.length; i++) {
        let weeksKeyLen = Object.keys(weeks).length;
        let daySplit = days[i].split('_');
        if (weeks[weeksKeyLen] === undefined) {
            weeks[weeksKeyLen + 1] = [daySplit[0]]
        } else {
            if (daySplit[1] == '1') {
                weeks[weeksKeyLen + 1] = [daySplit[0]]
            } else {
                weeks[weeksKeyLen].push(daySplit[0])
            }
        }
    }
    return weeks

}

function getDate(year) {
    let dates = [];
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= new Date(year, i, 0).getDate(); j++) {
            dates.push(year + '-' + formatNumber(i) + '-' + formatNumber(j) + '_' + new Date([year, i, j].join('-')).getDay())
        }
    }
    return dates;
}
// 获取当月的天数
function getMonthDay(year, month) {
    const day = new Date(year, month, 0).getDate()
    return day
}
module.exports = {
    formatTime,
    showMessage: showMessage,
    getWeek: getWeek,
    getCurrentTime: getCurrentTime,
    getMonthDay: getMonthDay
}