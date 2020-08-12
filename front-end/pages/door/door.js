const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: '未检测',
    age: '未检测',
    emotion: '未检测',
  },

  // 基于Microsoft的人脸识别API
  // 基于enjfun.com搭建、可供测试、请勿用做其它用途
  openDoor: function (e) {
    var that = this
    if (this.data.userInfo != '') {
      var code = 'imnu'
      var openid = wx.getStorageSync('openid')
      var time = util.formatTimeID(new Date())
      var camera = wx.createCameraContext()

      this.camera.takePhoto({
        quality: 'low',
        success: (res) => {
          wx.showLoading({
            title: '检测中',
          })
          wx.uploadFile({
            url: 'https://www.enjfun.com/wecloud/faceupload?code=' + code + '&&xh=' + openid + '&&time=' + time,
            filePath: res.tempImagePath,
            name: 'checkimg',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success(res) {
              if (res.statusCode == 200) {
                console.log(res)
                wx.hideLoading()
                wx.showLoading({
                  title: '识别中',
                })
                that.setData({
                  checkurl: res.data
                })
                wx.request({
                  url: 'https://www.enjfun.com/wecloud/facebase?faceurl=' + 'https://www.enjfun.com/facesign/' + code + '_' + openid + '_baseimg.jpg',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.header['Content-Length'] == '234') {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: '数据库暂未录入你的人脸模板，试试体验趣味功能吧',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) {
                            wx.showLoading({
                              title: '识别中',
                            })
                            wx.request({
                              url: 'https://www.enjfun.com/wecloud/facecheck?faceurl=' + that.data.checkurl,
                              method: 'GET',
                              header: {
                                'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                console.log(res)
                                wx.hideLoading()
                                wx.showLoading({
                                  title: '识别中',
                                })
                                if (res.data.result.length == 0) {
                                  wx.hideLoading()
                                  wx.showModal({
                                    title: '提示',
                                    content: '未能检测到人脸，请在光线充足的环境下重新验证',
                                    showCancel: false,
                                  })
                                } else {
                                  wx.hideLoading()
                                  that.setData({
                                    age: res.data.result[0].faceAttributes.age,
                                  })
                                  if (res.data.result[0].faceAttributes.gender == 'male') {
                                    that.setData({
                                      sex: '男'
                                    })
                                  } else {
                                    that.setData({
                                      sex: '女'
                                    })
                                  }
                                  if (res.data.result[0].faceAttributes.emotion.happiness >= 0.5) {
                                    that.setData({
                                      emotion: '开心的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.sadness >= 0.2) {
                                    that.setData({
                                      emotion: '伤心的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.surprise >= 0.2) {
                                    that.setData({
                                      emotion: '惊讶的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.anger >= 0.2) {
                                    that.setData({
                                      emotion: '生气的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.contempt >= 0.2) {
                                    that.setData({
                                      emotion: '轻蔑的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.fear >= 0.2) {
                                    that.setData({
                                      emotion: '害怕的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.disgust >= 0.2) {
                                    that.setData({
                                      emotion: '厌恶的'
                                    })
                                  } else {
                                    that.setData({
                                      emotion: '平淡的'
                                    })
                                  }
                                }
                              }
                            })
                          }
                        },
                      })
                    } else {
                      that.setData({
                        faceid1: res.data.result[0].faceId
                      })
                      wx.request({
                        url: 'https://www.enjfun.com/wecloud/facecheck?faceurl=' + that.data.checkurl,
                        method: 'GET',
                        header: {
                          'Content-Type': 'application/json'
                        },
                        success: function (res) {
                          console.log(res)
                          wx.hideLoading()
                          wx.showLoading({
                            title: '上传比对中',
                          })
                          if (res.data.result.length == 0) {
                            wx.hideLoading()
                            wx.showModal({
                              title: '提示',
                              content: '未能检测到人脸，请在光线充足的环境下重新验证',
                              showCancel: false,
                            })
                          } else {
                            wx.hideLoading()
                            wx.showLoading({
                              title: '验证中',
                            })
                            if (res.data.result[0].faceAttributes.gender == 'male') {
                              that.setData({
                                sex: '男'
                              })
                            } else {
                              that.setData({
                                sex: '女'
                              })
                            }
                            if (res.data.result[0].faceAttributes.emotion.happiness >= 0.5) {
                              that.setData({
                                emotion: '开心的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.sadness >= 0.2) {
                              that.setData({
                                emotion: '伤心的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.surprise >= 0.2) {
                              that.setData({
                                emotion: '惊讶的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.anger >= 0.2) {
                              that.setData({
                                emotion: '生气的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.contempt >= 0.2) {
                              that.setData({
                                emotion: '轻蔑的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.fear >= 0.2) {
                              that.setData({
                                emotion: '害怕的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.disgust >= 0.2) {
                              that.setData({
                                emotion: '厌恶的'
                              })
                            } else {
                              that.setData({
                                emotion: '平淡的'
                              })
                            }
                            that.setData({
                              age: res.data.result[0].faceAttributes.age,
                              faceid2: res.data.result[0].faceId
                            })
                            wx.request({
                              url: 'https://www.enjfun.com/wecloud/faceverify?faceid1=' + that.data.faceid1 + '&&faceid2=' + that.data.faceid2,
                              method: 'GET',
                              header: {
                                'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                console.log(res)
                                if (res.data.result.confidence >= 0.6) {
                                  wx.hideLoading()
                                  wx.showToast({
                                    title: '认证成功',
                                    inon: 'success',
                                    duration: 1000,
                                  })
                                } else {
                                  wx.hideLoading()
                                  wx.showModal({
                                    title: '提示',
                                    content: '人脸不匹配，请确认是本人认证或在光线良好的环境重新验证',
                                    showCancel: false,
                                  })
                                  that.onShow()
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '检测失败，请重新尝试',
                  showCancel: false,
                })
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败\n请检查网络后重试',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
                            

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.camera = wx.createCameraContext()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})