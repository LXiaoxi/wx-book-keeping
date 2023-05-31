const BASE_URL = 'http://127.0.0.1:7001'
class XxRequest {
    constructor(base_url) {
        this.base_url = base_url
    }
    request(url, method, data) {
        // 删掉URLnull和空字符串 ""
        if (data != undefined) {
            for (let item in data) {
                const itemValue = data[item]
                if (itemValue === null || itemValue === "") {
                    delete data[item]
                }
            }
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.base_url + url,
                method,
                data,
                header: {
                    Authorization: wx.getStorageSync('token')
                },
                success(res) {
                    if (res.data.code === 401) {
                        let lock = wx.getStorageSync('loginPageLock')
                        if (typeof (lock) == 'undefined' || !lock) {
                            wx.setStorageSync('loginPageLock', true)
                            // 请求认证失败,移除旧token和用户信息和返回上一个页面。只会进行自动登录
                            wx.removeStorageSync('token')
                            wx.removeStorageSync('userInfo')
                            wx.navigateTo({
                                url: '/pages/user/user-login/index',
                            })
                        }
                    } else {
                        resolve(res.data)
                    }
                },
                fail: (err) => {
                    console.log(err);
                    reject(err)
                }
            })
        })

    }
    get(url, data) {
        return this.request(url, 'GET', data)
    }
    post(url, data) {
        return this.request(url, 'post', data)
    }
    delete(url, data) {
        return this.request(url, 'delete', data)
    }
    put(url, data) {
        return this.request(url, 'put', data)
    }
}

const xxRequest = new XxRequest(BASE_URL)
export default xxRequest