//app.js
// const requestUrl = 'http://172.30.1.52:8081/aipc-small-api/V1.0.0/' //SIT
// const requestUrl = 'http://172.30.1.53:8081/aipc-small-api/V1.0.0/' //UAT
// const requestUrl = "https://aipc-wx-api.buyforyou.cn/aipc-small-api/V1.0.0/" //生产环境
// var requestUrl = 'http://172.30.1.54:6789/V1.0.0/'; //聊天测试环境
//const requestUrl = 'http://192.168.30.166:8080/aipc-small-api/V1.0.0/' //zf
const requestUrl = 'http://127.0.0.1:8088/V1/' //zhl

var Device = '' //设备信息
var method = 'POST';

App({
  globalData: {
    isLogin: null,
    nicknameK: null,
    mobileK: null,
    companyId: null,
    nickName: null,
    integral: null, //积分
    isPosition: null,
    customerId: null, //客户id  12f69b3f1910a0ad1bdecdf9dd3307b9 558249453702873088
    openId: null, //微信登录ID
    mobile: null,
    jsCode: null,
    distinguish: null, //TEST001  QILU001 rfyh001 msbjfh  MSBJFH01 HXAS01
    activityId: null,
    activityUrl: null,

    smallUrl: null, //本人头像 
    userInfo: null,
    user_id: null, //通过员工端跳转小程序到客户端转发活动的员工id
    othercustomerId: null, //被帮助点灯的人的客户id
    bankName: null, //选择的银行机构
    bankId: null, //机构id
    employeesId: null,
    inviterRecordId: null, //邀请有礼的时候使用
    activityName: null, //活动名称

    isAllowPosition: false, //是否已经授权
    longitude: null,
    latitude: null,

    unReadSpot: false,
    saveFriendList: [],
    easemodId: '', //环信登录的id
    easemodPass: '', //环信登录的密码
    isHXLogin: null, //环信是否登录
    isNoLogin: null, //是否是在 noLogin登录的
    productIds: '', //全局的券id
    quanOpen: true, //弹窗全局控制
  },


  /** 
   * 判断是否缓存个人信息
   */
  getUsetInfo: function() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        if (res.data) {
          that.globalData.userInfo = res.data;
        } else {
          return null;
        }
      },
      fail: function(res) {
        return null;
      }
    })
  },


  /**
   * 微信登录(微信手机号登录的时候需要)
   */
  logins: function(resData) {
    var that = this;
    //先要微信登录获取js-code
    wx.login({
      success: function(resLogin) {
        wx.setStorage({
          key: 'jscode',
          data: resLogin.code,
          success: function(res) {
            var data = {
              lgType: 'customer',
              "jscode": resLogin.code,
              "appletSign": "hyb"
            }
            that.post({
              "url": 'S0016',
              data: data,
              success: resData.success,
              showLoading: true
            })
          },
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        })
      }
    })
  },


  /**
   * post请求
   * showLoading：bool 是否显示加载提示框
   * url：请求路径
   * data：请求体reqBody部分
   * success：成功回调
   * fail:失败回调
   * complete：请求完成回调，没有特殊操作不需传
   */
  post: function(req) {
    var that = this;
    // 发起网络请求
    if (req.showLoading) {
      wx.showLoading({
        title: '正在加载中...',
      })
    }
    var head = {
      appid: 'wx5f7440b4ababd4b8',
      deviceType: Device.platform,
      tradeTime: Date.now(),
      token: this.globalData.TOKEN,
      //TEST001  QILU001 rfyh001 msbjfh  zzzh MSBJFH01 HXAS01
      distinguish: this.globalData.distinguish,
      identity: this.globalData.distinguish,
    }
    const requestTask = wx.request({
      url: requestUrl + req.url,
      data: {
        reqHead: head,
        reqBody: req.data
      },
      header: {
        "content-type": "application/json"
      },
      method: method,
      success: function(res) {
        if (res.data.rspHead.status == 'PR0000') {
          req.success(res.data);
        } else if (res.data.rspHead.status == 'PR0001') {
          that.removeStorages();
          wx.showToast({
            title: "登录状态已失效，请重新登录",
            icon: 'none',
            duration: 3000,
            mask: true,
            success: function() {
              wx.navigateTo({
                url: "../loginFirst/loginFirst"
              })
            }
          })
        } else {
          switch (res.data.rspHead.message) {
            case "账户信息不存在":
              that.removeStorages();
              wx.showToast({
                title: res.data.rspHead.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              break;
            case "客户信息不存在!":
              req.success(res.data);
              break;
            case "服务维护中!":
              that.globalData.distinguish = null;
              that.removeStorages();
              req.success(res.data);
              wx.showToast({
                title: res.data.rspHead.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              break;
            case "公司不存在!":
              that.globalData.distinguish = null;
              that.removeStorages();
              wx.showToast({
                title: res.data.rspHead.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              break;
            default:
              wx.showToast({
                title: res.data.rspHead.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              break;
          }
          req.fail && req.fail(res.data);
        }
      },
      fail: function(res) {
        wx.showToast({
          title: "请求失败",
          icon: 'none',
          duration: 3000,
          mask: true
        })
        if (req.fail) {
          req.fail(res.data);
        }
      },
    })
    return requestTask;
  },

  /**
   * 判断地理位置权限
   */
  geoPosition: function(res, resData) {
    if (res == 'first') {
      //res.authSetting为{}代表第一次啊出现弹框
      wx.authorize({
        scope: 'scope.userLocation',
        success: function(res) {
          resData.checkCallBack("yes");
        },
        fail: function(res) {
          resData.checkCallBack('no');
        }
      })
    } else if (res == 'no') {
      //前往设置页面允许获取地理位置信息
      wx.openSetting({
        success: function(res) {
          if (res.authSetting['scope.userLocation']) {
            resData.checkCallBack('yes');
          } else {
            resData.checkCallBack('no');
          }
        },
        fail: function(res) {
          resData.checkCallBack('no');
        }
      })
    }
  },


  /**
   * 检查是否授权
   */
  checkPosition: function(resData) {
    wx.getSetting({
      success: function(res) {
        //res.authSetting为{}代表第一次啊出现弹框
        if (res.authSetting['scope.userLocation'] == null) {
          resData.checkCallBack('first');
        } else if (res.authSetting['scope.userLocation']) {
          //已经授权
          resData.checkCallBack('yes');
        } else {
          //前往设置页面允许获取地理位置信息
          resData.checkCallBack('no');
        }
      },
      fail: function(res) {}
    })
  },


  /**
   * 判断用户信息是否开启
   */
  userInfo: function(resData) {
    wx.getSetting({
      success: function(res) {
        //res.authSetting为{}代表第一次啊出现弹框
        if (res.authSetting['scope.userInfo'] == null) {
          //需要按钮调起授权弹框
          resData.callBack(res);
        } else if (res.authSetting['scope.userInfo']) {
          //已经授权
        } else {
          //前往设置页面允许获取地理位置信息
          wx.openSetting({
            success: function(res) {},
            fail: function(res) {}
          })
        }
      },
      fail: function(res) {}
    })
  },


  /**
   * 商家详情的位置权限判断 datas
   */
  checkPositionShop: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        //res.authSetting为{}代表第一次啊出现弹框
        if (res.authSetting['scope.userLocation'] == null) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function(res) {
              that.globalData.isPosition = true;
            },
            fail: function(res) {
              that.opSettingQx();
            }
          })
        } else if (res.authSetting['scope.userLocation']) {
          //已经授权
          that.globalData.isPosition = true
        } else {
          //前往设置页面允许获取地理位置信息 datas
          that.opSettingQx();
        }
      },
      fail: function(res) {
        that.globalData.isPosition = false
      }
    })
  },


  /**
   * 打开设置权限页面
   */
  opSettingQx: function() {
    var that = this;
    wx.openSetting({
      success: function(res) {
        if (res.authSetting['scope.userLocation']) {
          that.globalData.isPosition = true
        } else {
          that.globalData.isPosition = false
        }
      },
      fail: function(res) {
        app.globalData.isPosition = false
      }
    })
  },


  /**
   * 清除部分缓存 因为只有第一次
   * 或者删除小程序后进入显示添加小程序提示，所以这块不能缓存全部清除
   */
  removeStorages: function() {
    var that = this;
    wx.removeStorage({
      key: 'customerId',
      success: function(res) {
        that.globalData.customerId = null;
      },
    })
    wx.removeStorage({
      key: 'rdSession',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'bankData',
      success: function(res) {},
    })
  },


  onShow: function(e) {
    console.log("appjs~~~~~~~~~~")
    var that = this;
    if (e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.employeesId) {
      this.globalData.employeesId = e.referrerInfo.extraData.employeesId; //员工id
    }
    if (e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.distinguish) {
      this.globalData.distinguish = e.referrerInfo.extraData.distinguish; //机构标识
    }
    if (e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.activityUrl) {
      this.globalData.activityUrl = e.referrerInfo.extraData.activityUrl; //活动链接
      this.globalData.activityName = e.referrerInfo.extraData.name; //活动名称
    }
    //获取导航栏高度
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.windowHeight = res.screenHeight;
      },
    })
  },


  onLoginSuccess: function(myName) {
    var that = this;
    //环信登录成功
    wx.setStorage({
      key: 'hxLogin',
      data: 'true',
      success: function(res) {
        that.hxResData.hxLogin("success");
        that.globalData.isHXLogin = true;
      }
    })
  },



  getUserInfo(cb) {
    var me = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      // 调用登录接口
      wx.login({
        success() {
          wx.getUserInfo({
            success(res) {
              me.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(me.globalData.userInfo);
            }
          });
        }
      });
    }
  },


  onLaunch: function() {
    try { //获取设备信息
      Device = wx.getSystemInfoSync()
    } catch (e) {
      Device.platform = 'other'
    }
    //小程序版本检查
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用版本检查功能功能，请升级到最新微信版本后重试。'
      })
    }
  },


  /**
   * FormID上传接口
   */
  submitForm: function(formId) {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        var ad = {
          appId: 'wx5f7440b4ababd4b8',
          openId: res.data,
          formId: formId
        }
        that.post({
          url: 'CL053',
          data: {
            appId: 'wx5f7440b4ababd4b8',
            openId: res.data,
            formId: formId
          },
          success: function(datas) {},
          showLoading: false
        })
      },
      fail: function() {
        that.data.openId = null;
      }
    })
  },


  /**
   * 计算红色画布的高度
   */
  listHeight: function(length) {
    var height = 0;
    if (length == 1) {
      height = 130;
    }
    if (length == 2) {
      height = 245;
    }
    if (length == 3) {
      height = 361;
    }
    return height;
  }
})