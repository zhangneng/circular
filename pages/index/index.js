//index.js
//获取应用实例
var http = require("../../utils/http.js");
var app = getApp()
Page({
  data: {
    hellspawnList: [],
    popularList: [],
    searchText: ""
  },
  //事件处理函数
  getPopular: function() {
    var url = http.generateUrl('api/v1/populars');
    var context = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        // success
        if (res.data.status == 1) {
          context.setData({
            popularList: res.data.body.popular_list
          });
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  bindSearch: function(e) {
    var context = this;
    this.setData({
      searchText: e.detail.value
    })
    if (this.data.searchText) {
      var url = http.generateUrl('api/v1/search/' + this.data.searchText);
      wx.request({
        url: url,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res) {
          // success
          if (res.data.status == 1) {
            context.setData({
              hellspawnList: res.data.body.hellspawn_list
            })
          }
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }
  },

  wantedSearch: function(e) {
    // _loading = true;
    var context = this;
    this.setData({
      searchText: e.detail.value
    })

    wx.request({
      url:'http://106.14.208.22:80/tjl/search',
      //url: 'tjl/search',
      method: 'POST',
      data: this.data.searchText,
      success: function(res) {
        console.log(res);
        // _loading = false;
        if (res.data.status == 1) {
          searchDataHandle(res.data, 2);
        } else if (res.status == 2) {
          $('.J_search').removeClass('current');
          $('.J_noResult').addClass('current');
        }
      },
      error: function(res) {
        console.log(res);
      }
    });
  },

  searchDataHandle: function(data, type) {
    var _page = parseInt($('.J_wantedList').attr('data-page'));
    var _totalElements = data.totalElements || 0;
    $('.J_totalElements').text(_totalElements);
    if (data.last) {
      $('.J_wantedList').attr('data-over', 1);
      $('.J_wantedOverTip').show();
    } else {
      $('.J_wantedList').attr('data-over', 0);
      $('.J_wantedOverTip').hide();
    }
    var _dataContent = data.content;
    if ($.type(_dataContent) == 'array') {
      var _listHtml = '';
      $(_dataContent).each(function(i, e) {
        var _orderNumber = _page * 5 + i + 1;
        var _orderNumber = i + 1;
        var _showOrderNumber = numberToChinese(_orderNumber);
        if (e.lierGameserver) {
          var _gameId = e.lierGameserver + ':' + e.gameId || '';
        } else {
          var _gameId = e.gameId || '';
        }
        var _lierAplipy = e.lierAplipy || '';
        var _lierQq = e.lierQq || '';
        var _lierWeixin = e.lierWeixin || '';
        var _lierDiscribe = e.lierDiscribe || '';
        var _highlightDisplay = e.highlightDisplay || '';
        var _itemHtml = '<li class="warning-item ' + _highlightDisplay + '">' +
          '<div class="wanted-man-info cf">' +
          '<div class="wanted-man-face">' +
          '<div class="wanted-man-face-pic">' +
          '<img src="/images/logo.png"/>' +
          '</div>' +
          '</div>' +
          '<div class="wanted-man-info-content">' +
          '<div class="wanted-man-number">第' + _showOrderNumber + '号</div>' +
          '<div class="wanted-man-nick">' + _gameId + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="wanted-account wanted-alipay">' +
          '<div class="wanted-account-name">' +
          '<span class="wanted-icon wanted-icon-alipay"></span>支付宝账号' +
          '</div>' +
          '<div class="wanted-account-detail">' +
          '<p>' + _lierAplipy + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="wanted-account wanted-qq">' +
          '<div class="wanted-account-name">' +
          '<span class="wanted-icon wanted-icon-qq"></span>QQ账号' +
          '</div>' +
          '<div class="wanted-account-detail">' +
          '<p>' + _lierQq + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="wanted-account wanted-weixin">' +
          '<div class="wanted-account-name">' +
          '<span class="wanted-icon wanted-icon-weixin"></span>微信ID' +
          '</div>' +
          '<div class="wanted-account-detail">' +
          '<p>' + _lierWeixin + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="wanted-account wanted-describe">' +
          '<div class="wanted-account-name">' +
          '<span class="wanted-icon wanted-icon-warning"></span>骗术描述' +
          '</div>' +
          '<div class="wanted-account-detail">' +
          '<p>' + _lierDiscribe + '</p>' +
          '</div>' +
          '</div>' +
          '</li>';
        _listHtml += _itemHtml;
      });
      if (type == 1) {
        _searchSuccess = true;
        $('.J_search').removeClass('current');
        $('.J_result').addClass('current');
        $('.J_wantedList').attr('data-page', _page + 1);
        $('.J_wantedList').html(_listHtml);
      } else if (type == 2) {
        $('.J_wantedList').attr('data-page', _page + 1);
        $('.J_wantedList').append(_listHtml);
      }
    }
  },

  onShareAppMessage: function() {
    var title = '式神猎手 | 快速查寻阴阳师妖怪'
    return {
      title: title,
      path: 'pages/index/index'
    }
  },

  onShow: function() {
    this.getPopular();
  }

})