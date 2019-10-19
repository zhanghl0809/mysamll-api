const app = getApp()

Page({
  data: {
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  },

  onLoad: function () {

  },

  getLocation: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("longitude" + longitude + "----latitude" + latitude);
        _this.setData({
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  }
})
