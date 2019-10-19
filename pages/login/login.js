// pages/login/login.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logo: '/images/imgs/1.jpg',
  },
  showTopTips: function() {

    //正则匹配
    // var mobile = new RegExp('[0-9]','g'); //不严格
    
    var myreg = /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话
    var isMobile = myreg.test('010  65934662  '.replace(/\s/g, ''));//0431-65934662 //
    console.log(isMobile);

    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var is = mobile.test('043-165934662');
    console.log(is);
    wx.switchTab({
    url: '../index/index',
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})