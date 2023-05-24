// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        wx.setStorageSync('loginPageLock', false)

    },
    globalData: {
        userInfo: null,
        isBookDetailPageRefresh: false
    }
})