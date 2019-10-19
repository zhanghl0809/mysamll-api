//index.js
//获取应用实例
const app = getApp();
//图片轮播
// indicator - dots  Boolean     false   是否显示面板指示点
// autoplay    Boolean     false   是否自动切换
// interval    Number  5000    自动切换时间间隔
// duration    Number  500     滑动动画时长
Page({
  data: {
    imgUrls: [
      'https://img.alicdn.com/tps/i4/TB1K2_8XBCw3KVjSZFlSuwJkFXa.jpg_q90_.webp',
      'https://img.alicdn.com/simba/img/TB1egO5RQvoK1RjSZFDSutY3pXa.jpg',
      'https://img.alicdn.com/simba/img/TB1UKihaQfb_uJkSndVSuuBkpXa.jpg'
    ],
    userImg: '/images/iconfont/user_1.png',
    lpImg: '/images/iconfont/lp.png',
    heImg: 'http://img1.imgtn.bdimg.com/it/u=2928578724,4145646089&fm=26&gp=0.jpg',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
  },
  // 点击滚动图
  imgPost: function(e) {
    //关闭当前页面，跳转到非tabBar的某个页面
    // wx.redirectTo({ 
    //   url: '../logs/logs',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // }),

    //保留当前页面，跳转到应用内的某个页面，使用 wx.navigateBack 可以返回
    // wx.navigateTo({
    // url: '../logs/logs',
    // }),
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000,
    })
    //跳转到tabBar的某个页面
    // wx.switchTab({
    //   url: '../logs/logs', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    // })
  },
  // 点击登录
  login: function(e) {
    //关闭当前页面，跳转到非tabBar的某个页面
    // wx.redirectTo({ 
    //   url: '../login/login',
    //   success: function(res) {

    //   },
    //   fail: function(res) {

    //   },
    //   complete: function(res) {

    //   },
    // })
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    var data = {
      age: "55",
      name: "qqqqqqqq"
    }
    app.post({
      url: 'student',
      data: data,
      success: this.releaseAcSuccess,
      fail: function() {
        issueBtnBool = false;
      },
      showLoading: true
    })
  },
  //提交成功
  releaseAcSuccess: function(e) {
    wx.hideLoading();
    wx.showModal({
      title: '提示：提交成功了',
      content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  map: function(e) {
    wx.redirectTo({
      url: '../map/map',
      success: function(res) {

      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })


  },
  lpClick: function(e) {
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
  },
  lpMassage: function() {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})