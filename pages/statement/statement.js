// pages/statement/statement.js
var WxParse = require('../wxParse/wxParse.js');
var listHtml = "";
Page({
  data:{
    _listHtml: "",
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      _listHtml: options._listHtml
    }) 

    var app = getApp();
    listHtml = app.globalData.userInfo;
    WxParse.wxParse('article', 'html', listHtml, that, 5);
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})