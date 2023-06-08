// pages/user/user-login/index.js
import {
    login
} from '../../../service/api-user'
Page({
    data: {
        isShowGetPhoneNumberModal: false,
        registerUserDto: {
            "code": "",
            "encryptedData": "",
            "iv": "",
            "phoneCode": "",
            "signature": ""
        },
    },
    onUnload() {
        // 出去 把值改为false
        wx.setStorageSync('loginPageLock', false)
    },
    /**
     * 登录流程-----------------------------------------------
     * 微信登录(通过微信api获取手机号+通过服务器获取token和用户信息)
     * 1.app一进入,就去判断有没有token,有token的话,就让进去app。
     * 登录态没过期(请求没报错)，就可以继续使用小程序,
     * 如果登录态过期,就跳到登录页面,进行登录。
     * 
     * 2.登录页面的逻辑,每次都获取手机号,就行注册,并且登录
     */
    async handleLogin() {
        let getWxCode = () => { //通过promise方式获取code
            return new Promise((resolve, reject) => {
                wx.login({
                    success(res) {
                        resolve(res.code)
                    },
                    fail(err) {
                        reject(err)
                    }
                })
            })
        }
        let getUserInfo = () => { //通过promise方式获取用户信息
            return new Promise((resolve, reject) => {
                wx.getUserProfile({
                    desc: '用于完善会员资料',
                    success: res => {
                        resolve(res)
                    },
                    fail(err) {
                        reject(err)
                    }
                })
            })
        }
        Promise.all([getWxCode(), getUserInfo()]).then(res => {
            this.setData({
                'registerUserDto.code': res[0],
                'registerUserDto.encryptedData': res[1].encryptedData,
                'registerUserDto.iv': res[1].iv,
                'registerUserDto.signature': res[1].signature,
                'registerUserDto.userInfo': res[1].userInfo,
                isShowGetPhoneNumberModal: true
            })
        })
    },
    handleCancel() {
        this.setData({
            isShowGetPhoneNumberModal: false
        })
    },
    handleGetPhoneNumber() {
        login(this.data.registerUserDto).then(res => {
            if (res.code === 200) {
                wx.setStorageSync('token', res.token)
                wx.setStorageSync('userInfo', res.userInfo)
                this.setData({
                    registerUserDTO: {},
                    isShowGetPhoneNumberModal: false
                })
                const pages = getCurrentPages()
                const prevPage = pages[pages.length - 2]
                prevPage.setData({
                    isRefresh: true
                })
                wx.navigateBack({
                    delta: 1,
                })
            }
        })
    },

})
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {

//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad(options) {

//     },
//     onUnload() {
//         wx.setStorageSync('loginPageLock', false)
//     },
//     async handleUserLogin() {
//         let getUserCode = () => {
//             return new Promise((reslove, reject) => {
//                 wx.login({
//                     success(res) {
//                         reslove(res)
//                     },
//                     fail(err) {
//                         reject(err)
//                     }
//                 })
//             })
//         }
//         let getUserInfo = () => {
//             return new Promise((resolve, reject) => {
//                 wx.getUserProfile({
//                     desc: '用于完善用户信息',
//                     success(res) {
//                         resolve(res)
//                     },
//                     fail(err) {
//                         reject(err)
//                     }
//                 })({

//                 })
//             })
//         }
//         Promise.all([getUserCode(), getUserInfo()]).then(res => {
//             console.log(res);
//         })
//     }
// })