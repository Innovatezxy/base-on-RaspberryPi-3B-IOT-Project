var App = getApp()

Page({
  data: {
    tmp: '-',
    smog: '检测中',
    light: false,
    door: false,
    roomIndex: 0,
    roompick: ['理工楼A0301', '理工楼A0302', '理工楼A0303', '理工楼A0304', '理工楼A0305', '理工楼A0306', '理工楼A0307', '理工楼A0308', '理工楼A0309', '理工楼A0310', '理工楼A0311', '理工楼A0312'], // 模拟教室
    roomvalue: [0,1,2,3,4,5,6,7,8,9,10,11]
  },
  roomPicker: function (e) {
    this.setData({
      roomIndex: e.detail.value,
    })
  },
  // IOT连接初始化
  onReady: function (){
    var that = this
    wx.request({
      url: 'https://www.enjfun.com/raspi/zxypi/relayinfo',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.statusCode == 200){
          wx.showToast({
            title: '远程连接成功',
            icon: 'success',
            duration: 1800
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '远程连接失败，请检查教室网络环境',
            showCancel: false,
          })
        }
        if (res.data.result[0].relay == 'on') {
          that.setData({
            light: true
          })
        } else {
          that.setData({
            light: false
          })
        }
      }
    })
  },
  // 获取烟雾情况（轮询方式）
  onLoad: function (){
    var that = this
    wx.stopPullDownRefresh()
    setTimeout(() => {
      wx.request({
        url: 'https://www.enjfun.com/raspi/zxypi/info',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          wx.hideNavigationBarLoading()
          var tmp = (res.data.result[0].evtmp / 1.00).toFixed(2)
          that.setData({
            tmp: tmp,
          })
          if (res.data.result[0].smog == 'working') {
            that.setData({
              smog: '安全'
            })
          } else {
            that.setData({
              smog: '危险'
            })
          }
        }
      })
      that.onLoad()
    }, 2500);
  },
  // 灯光控制
  lightChange: function (e){
    var that = this
    if(e.detail.value == false){
      wx.request({
        url: 'https://www.enjfun.com/raspi/zxypi/control?relay=off',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if(res.data.success == true){
            wx.showToast({
              title: '已关灯',
              icon: 'success',
              duration: 1000
            })
            that.onLoad()
          } else {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 1000
            })
            that.onLoad()
          }
        }
      })
    } else {
      wx.request({
        url: 'https://www.enjfun.com/raspi/zxypi/control?relay=on',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.success == true) {
            wx.showToast({
              title: '已开灯',
              icon: 'success',
              duration: 1000
            })
            that.onLoad()
          } else {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 1000
            })
            that.onLoad()
          }
        }
      })
    }
  },
  doorChange: function (e){
    var that = this
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    that.onReady()
  }
})