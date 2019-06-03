//index.js
//获取应用实例
var WxParse = require('../wxParse/wxParse.js');
var http = require("../../utils/http.js");
var app = getApp();

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

  inputSearch: function(e) {
    var context = this;
    this.setData({
      searchText: e.detail.value
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
    // var url = http.generateUrl('https://106.14.208.22/tjl/search?param=' + this.data.searchText + '&page=1&size=3');
    var url = 'https://106.14.208.22/tjl/search?param=' + this.data.searchText + '&page=1&size=3';
    wx.request({
      // url: 'https://106.14.208.22/tjl/search?param=黑暗&page=1&size=3', url
      // https://106.14.208.22/tjl/search?param=黑暗&page=1&size=3
      // url: 'tjl/search',
      url: url,
      method: 'POST',
      // data: this.data.searchText,
      data: {},
      header: {
        "Content-Type": "applciation/json" //默认值
      },
      success: function(res) {
        console.log(res);
        // _loading = false;
        if (res.data.status == 1) {
          context.setData({
            popularList: res.data.data.content
          })
          context.searchDataHandle(res.data, 2);
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

  numberToChinese: function(num) {
    var unitPos = 0;
    var chnNumChar = ["零", "壹", "貳", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var chnUnitSection = ["", "萬", "億", "萬億", "億億"];
    var chnUnitChar = ["", "拾", "佰", "仟"];
    var strIns = '',
      chnStr = '';
    var needZero = false;
    if (num === 0) {
      return chnNumChar[0];
    }
    while (num > 0) {
      var section = num % 10000;
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr;
      }
      strIns = sectionToChinese(section);
      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = (section < 1000) && (section > 0);
      num = Math.floor(num / 10000);
      unitPos++;
    }

    return chnStr;
  },

  searchDataHandle: function(data, type) {
    var context = this;
    //var _page = parseInt($('.J_wantedList').attr('data-page'));
    //var _totalElements = data.totalElements || 0;
    //$('.J_totalElements').text(_totalElements);
    if (data.last) {
      // $('.J_wantedList').attr('data-over', 1);
      // $('.J_wantedOverTip').show();
    } else {
      // $('.J_wantedList').attr('data-over', 0);
      // $('.J_wantedOverTip').hide();
    }
    let _dataContent = data.data.content;
    //if ($.type(_dataContent) == 'array') 
    //{
    var _listHtml = '';
    data.data.content.forEach(function(i, e) {
      // var _orderNumber = _page * 5 + i + 1;
      var _orderNumber = i + 1;
      var _showOrderNumber = context.numberToChinese(_orderNumber);
      if (i.lierGameserver) {
        var _gameId = i.lierGameserver + ':' + i.gameId || '';
      } else {
        var _gameId = i.gameId || '';
      }
      var _lierAplipy = i.lierAplipy || '';
      var _lierQq = i.lierQq || '';
      var _lierWeixin = i.lierWeixin || '';
      var _lierDiscribe = i.lierDiscribe || '';
      var _highlightDisplay = i.highlightDisplay || '';
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

  },

  sectionToChinese: function(section) {
    var strIns = '',
      chnStr = '';
    var unitPos = 0;
    var chnNumChar = ["零", "壹", "貳", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var chnUnitSection = ["", "萬", "億", "萬億", "億億"];
    var chnUnitChar = ["", "拾", "佰", "仟"];
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
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