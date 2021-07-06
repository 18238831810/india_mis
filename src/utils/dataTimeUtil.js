String.format = function(format) {
  if (!format || arguments.length == 0) return ''
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i]
  })
}
Date.prototype.format = function(format) {
  /*
   * eg:format="YYYY-MM-dd hh:mm:ss";
   */
  var o = {
    'Y': this.getFullYear(), // year
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds()
    // millisecond
  }

  var week = ['日', '一', '二', '三', '四', '五', '六']

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? i18n.common.weekpre2 : i18n.common.weekpre1) : '') + week[this.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
export default {

  // 两个浮点数求和
  accAdd: function(num1, num2) {
    var r1 = 0
    var r2 = 0
    var m
    try {
      var n1 = num1.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = num2.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m
  },

  // 两个浮点数相减
  accSub: function(num1, num2) {
    var r1 = 0
    var r2 = 0
    var m, n

    try {
      var n1 = num1.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = num2.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
  },
  // 两数相除
  accDiv: function(num1, num2) {
    var t1, t2, r1, r2
    try {
      if (num1.toString().indexOf('.') != -1) {
        t1 = num1.toString().split('.')[1].length
      } else {
        t1 = 0
      }
    } catch (e) {
      t1 = 0
    }
    try {
      if (num2.toString().indexOf('.') != -1) {
        t2 = num2.toString().split('.')[1].length
      } else {
        t2 = 0
      }
    } catch (e) {
      t2 = 0
    }
    r1 = Number(num1.toString().replace('.', ''))
    r2 = Number(num2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  },

  // 两数乘法
  accMul: function(num1, num2) {
    var m = 0, s1 = num1.toString(), s2 = num2.toString()
    try {
      if (s1.indexOf('.') != -1) {
        m += s1.split('.')[1].length
      }
    } catch (e) {
    }
    try {
      if (s2.indexOf('.') != -1) {
        m += s2.split('.')[1].length
      }
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },

  isEqual: function(o1, o2) {
    for (var name in o1) {
      if (o1[name] != o2[name]) {
        return false
      }
    }
    return true
  },

  /**
   * 字符串空值判断
   * @param str
   * @returns {Boolean}
   */
  isEmpty: function(str) {
    return typeof (str) == 'undefined' || str === '' || str == null
  },

  /**
   * 字符串非空判断
   * @param str
   * @returns {Boolean}
   */
  isNotEmpty: function(str) {
    return !this.isEmpty(str)
  },

  /**
   * 字符串空值或者空白判断
   * @param str
   * @returns {Boolean}
   */
  isBlank: function(str) {
    return this.isEmpty(str) || str == 'null'
  },

  /**
   * 字符串不为空值并且不为空白判断
   * @param str
   * @returns {Boolean}
   */
  isNotBlank: function(str) {
    return !this.isBlank(str)
  },

  /**
   * 过滤空格
   * @param val
   * @returns {XML|string|void}
   */
  trim: function(val) {
    return this.isBlank(val) ? '' : val.toString().replace(/(^\s*)|(\s*$)/g, '')
  },

  mod: function(x, y) {
    var r1 = 0
    var r2 = 0
    var m, scale
    try {
      var n1 = x.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = y.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }

    scale = Math.max(r1, r2)
    m = Math.pow(10, scale)
    return (this.accMul(Number(x), Number(m))) % (this.accMul(Number(y), Number(m))) * Math.pow(10, -scale)
  },

  /**
   * x四舍五入保留digits位小数返回字符串，默认保留两位
   * @param x 源数值
   * @param digits 默认为2
   * @param minDigits 最小显示位数，有值时去掉 digits到minDigits 后面的0
   */
  fixToStr: function(x, digits, minDigits) {
    digits = (digits || digits == 0) ? Number(digits) : 2
    var f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    var result = f.toFixed(digits)
    if (minDigits && minDigits >= 0) {
      var regExp = new RegExp('0{1,' + (digits - minDigits) + '}$')
      result = result.replace(regExp, '')
    }
    return result + ''
  },

  // x四舍五入保留digits位小数返回数字
  fixToNum: function(x, digits) {
    return parseFloat(this.fixToStr(x, digits))
  },

  getSysHourOffset: function() {// WebUI系统时区
    return 8// 小时差
  },

  /**
   * 根据 秒数or毫秒数 返回目标时区Date对象
   * @param times 必传，秒数or毫秒数
   * @param orgOffset 源时区，非必传（取自本地客户端），小时差（0/8/-8/-2.5）
   * @param destOffset 目标时区，非必传（默认WebUI当前所选时区），小时差（0/8/-8/-2.5）
   * @returns {Date}
   */
  getDate: function(times, orgOffset, destOffset) {
    var _milltimes = ('' + times).length == 13 ? times : times * 1000
    var localOffset = -new Date().getTimezoneOffset() / 60
    var orgOffset = this.isEmpty(orgOffset) ? localOffset : orgOffset
    var destOffset = this.isEmpty(destOffset) ? this.getSysHourOffset() : destOffset

    _milltimes += (destOffset - orgOffset) * 3600000

    return new Date(_milltimes)
  },
  /**
   * 根据 秒数or毫秒数和目标格式 返回目标时区的格式化后时间字符串
   * @param times 必传，秒数or毫秒数
   * @param format 目标格式（yyyy-MM-dd hh:mm:ss）
   * @param orgOffset 源时区，非必传（取自本地客户端），小时差（0/8/-8/-2.5）
   * @param destOffset 目标时区，非必传（默认WebUI当前所选时区），小时差（0/8/-8/-2.5）
   * @returns {String}
   */
  formatDate: function(times, format, orgOffset, destOffset) {
    if (!times) return ''
    var utcDate = this.getDate(times, orgOffset, destOffset)
    return this.isEmpty(format) ? utcDate : utcDate.format(format)
  },
  /**
   * 如：
   *    （北京时间GMT8）转成(GMT0):
   *        this.formatDateStr('2016-06-17 11:21:41', 'yyyy-MM-dd hh:mm:ss', 8, 0)-->2016-06-17 03:21:41
   */
  formatDateStr: function(datestr, format, orgOffset, destOffset) {
    if (this.isEmpty(datestr)) return ''
    return this.formatDate(datestr.toDate().getTime(), format, orgOffset, destOffset)
  },
  parseDateStr: function(datestr, orgOffset, destOffset) {
    if (this.isEmpty(datestr)) return ''
    return this.getDate(datestr.toDate().getTime(), orgOffset, destOffset)
  },

  /**
   * 秒数or毫秒数转换为HH:MM:SS
   * @param times secs or millsecs
   * @param timezone 返回的时区
   */
  formatToHHMMSS: function(times, timezone) {
    timezone = timezone || 0
    var _milltimes = Number(String(times).padRight(13, '0'))
    var tmpDate = new Date(times + timezone * 3600000)
    var hour = (tmpDate.getUTCHours() < 10 ? '0' : '') + tmpDate.getUTCHours()
    var minutes = (tmpDate.getUTCMinutes() < 10 ? '0' : '') + tmpDate.getUTCMinutes()
    var seconds = (tmpDate.getUTCSeconds() < 10 ? '0' : '') + tmpDate.getUTCSeconds()
    return hour + ':' + minutes + ':' + seconds
  },

  /**
   * 分钟数转换为HH:MM
   * @param mins
   * @param timezone 返回的时区
   */
  formatMinutes: function(mins, timezone) {
    timezone = timezone || 0
    var tmpDate = new Date(mins * 60000 + timezone * 3600000)
    var hour = (tmpDate.getUTCHours() < 10 ? '0' : '') + tmpDate.getUTCHours()
    var minutes = (tmpDate.getUTCMinutes() < 10 ? '0' : '') + tmpDate.getUTCMinutes()
    return hour + ':' + minutes
  },

  // 返回随机请求序列
  getRandomSeq: function() {
    return Math.round(Math.random() * (999999999 - 100000000)) + 100000000
  },

  /**
   * 获取显示的产品代码
   * @example this.getShowPrdCode("GT1/PM/LLG")->LLG
   */
  getShowPrdCode: function(v) {
    return v ? v.substring(v.lastIndexOf('/') + 1).substring(v.lastIndexOf('\\') + 1) : ''
  },
  /**
   * 功能:向上舍入(类似于excel中的roundUp)
   */
  roundUp: function(n, f) {
    if (this.getDecimalLen(n) <= f) {
      return n
    }
    var flag = false
    if (n < 0) {
      n = -n
      flag = true
    }
    n = n * Math.pow(10, f)
    n = Math.ceil(n) / Math.pow(10, f)
    return flag ? -n : n
  },
  /**
   * 功能：向下舍入(类似于excel中的roundDown)
   */
  roundDown: function(n, f) {
    if (this.getDecimalLen(n) <= f) {
      return n
    }
    var flag = false
    if (n < 0) {
      n = -n
      flag = true
    }
    n = n * Math.pow(10, f)
    n = Math.floor(n) / Math.pow(10, f)
    return flag ? -n : n
  },
  /**
   * 功能：input只能输入数字
   */
  allowNumKeyPress: function(event) {
    var keyCode = event.which
    if (navigator.userAgent.indexOf('Firefox') >= 0 && keyCode == 0) { // 火狐下 delete键盘 、左右方向键盘 keycode都是0,特殊处理
      return true
    }
    if (keyCode == 46 || keyCode == 8 || (keyCode >= 48 && keyCode <= 57)) {
      return true
    } else {
      return false
    }
  },
  filterNum: function(curObj, allowNeg) {
    var curValue = curObj.value
    if (isNaN(curValue) || curValue == ' ') {// 空格用js的isNaN会判断为数字
      if (allowNeg && curValue == '-') {
        return true
      }
      var neg = ''
      if (allowNeg && curValue.indexOf('-') === 0) {
        neg = '-'
      }
      curValue = curValue.replace(/[^\d.]/g, '').replace(/^\./g, '')
        .replace(/\.{2,}/g, '.').replace('.', '$#$')
        .replace(/\./g, '').replace('$#$', '.')
      if (curValue.indexOf('.') === 0) {
        curValue = '0' + curValue
      }
      curObj.value = curValue != '' ? (neg + curValue) : ''
    }
  },
  /**
   * 功能：获取小数位的长度
   */
  getDecimalLen: function(n) {
    var arr = n.toString().split('.')
    if (arr.length == 1) {
      return 0
    } else {
      return arr[1].length
    }
  },

  /**
   * 获取近三个月时间
   * **/
  getLast3Month: function() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1//0-11表示1-12月
    let day = now.getDate()
    let dateObj = {}
    if (parseInt(month) < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }

    dateObj.endTime = year + '-' + month + '-' + day

    if (parseInt(month) == 1) {//如果是1月份，则取上一年的10月份
      dateObj.beginTime = (parseInt(year) - 1) + '-10-' + day
      return dateObj
    }
    if (parseInt(month) == 2) {//如果是2月份，则取上一年的11月份
      dateObj.beginTime = (parseInt(year) - 1) + '-11-' + day
      return dateObj
    }
    if (parseInt(month) == 3) {//如果是3月份，则取上一年的12月份
      dateObj.beginTime = (parseInt(year) - 1) + '-12-' + day
      return dateObj
    }

    var preSize = new Date(year, parseInt(month) - 3, 0).getDate()//开始时间所在月的总天数
    if (preSize < parseInt(day)) {
      // 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
      let resultMonth = parseInt(month) - 2 < 10 ? ('0' + parseInt(month) - 2) : (parseInt(month) - 2)
      dateObj.beginTime = year + '-' + resultMonth + '-01'
      return dateObj
    }

    if (parseInt(month) <= 10) {
      dateObj.beginTime = year + '-0' + (parseInt(month) - 3) + '-' + day
      return dateObj
    } else {
      dateObj.beginTime = year + '-' + (parseInt(month) - 3) + '-' + day
      return dateObj
    }
  },
  /**
   * 获取近一个月时间
   * **/
  getLast1Month: function() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1//0-11表示1-12月
    let day = now.getDate()
    let dateObj = {}
    if (parseInt(month) < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }

    dateObj.endTime = year + '-' + month + '-' + day

    if (parseInt(month) == 1) {//如果是1月份，则取上一年的10月份
      dateObj.beginTime = (parseInt(year) - 1) + '-12-' + day
      return dateObj
    }

    var preSize = new Date(year, parseInt(month) - 1, 0).getDate()//开始时间所在月的总天数
    if (preSize < parseInt(day)) {
      // 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
      let resultMonth = parseInt(month) < 10 ? ('0' + parseInt(month)) : (parseInt(month))
      dateObj.beginTime = year + '-' + resultMonth + '-01'
      return dateObj
    }

    if (parseInt(month) <= 10) {
      dateObj.beginTime = year + '-0' + (parseInt(month) - 1) + '-' + day
      return dateObj
    } else {
      dateObj.beginTime = year + '-' + (parseInt(month) - 1) + '-' + day
      return dateObj
    }
  },
  /**
   * 获取一周时间
   * **/
  getDay: function(days) {
    var now = new Date()
    var milliseconds = now.getTime() + 1000 * 60 * 60 * 24 * days
    now.setTime(milliseconds)
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    if (parseInt(month) < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }
    return year + '-' + month + '-' + day
  },
  /**
   * 时区时间转换
   * **/
  getLocalTime(i, val) {
    if (typeof i !== 'number') return
    let d = new Date(val.replace(/-/g, '/'))
    let len = d.getTime()
    let offset = d.getTimezoneOffset() * 60000
    let utcTime = len + offset
    return new Date(utcTime + 3600000 * i)
  },
  getZoneTime:function(i,val){
    if(typeof i !== 'number') return ;
    var d = new Date(val.replace(/-/g, "/"));
    var len = d.getTime();
    var offset = d.getTimezoneOffset() * 60000;
    var utcTime = len + offset;
    return this.getNowFormatDates(utcTime + 3600000 * i);
  },
  getNowFormatDates:function(time) {
    var _time = time
    if(_time == "" || _time == undefined || _time == null){
      var date = new Date();
    }else{
      var date = new Date(time);
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var getMinutes = date.getMinutes();
    var getSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if(getMinutes >= 0 && getMinutes <= 9){
      getMinutes = "0" + getMinutes;
    }
    if(getSeconds >= 0 && getSeconds <= 9){
      getSeconds = "0" + getSeconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + getMinutes
      + seperator2 + getSeconds;
    return currentdate;
  },
}
