const app = getApp()

Page({
  data: {
    latitude: '',
    longitude: '',
    speed: '',
    accuracy: '',
    altitude: '',
    verticalAccuracy: '',
    horizontalAccuracy: ''
  },

  onLoad: function () {

  },

  getLocation: function () {
    var _this = this;
    wx.getLocation({
    type: 'wgs84',
      //type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      altitude:'true',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var altitude = res.altitude
        var verticalAccuracy = res.verticalAccuracy
        var horizontalAccuracy = res.horizontalAccuracy
        console.log(latitude + "--" + longitude)
 
        // wx.openLocation({//使用微信内置地图查看位置。
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 18
        // })
        _this.setData({
          latitude: latitude,
          longitude: longitude,
          speed: speed,
          accuracy: accuracy,
          altitude: altitude,
          verticalAccuracy: verticalAccuracy,
          horizontalAccuracy: horizontalAccuracy
        })
      }
    })
  }
})
