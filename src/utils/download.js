import axios from 'axios'
import Qs from 'qs'
import store from '@/store'

export default {
  download: function(data, filename) {
    if (!data) {
      return
    }
    var blob = new Blob([data.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
    var url = window.URL.createObjectURL(blob)
    var aLink = document.createElement('a')
    aLink.style.display = 'none'
    aLink.download = filename + '.xls'
    aLink.href = url
    document.body.appendChild(aLink)
    aLink.click()
  },
  exportExcel: function(url, params, filename) {
    //兼容后台错误的用了分页
    params = Object.assign(params, {pageNum:1,pageSize:2147483647});
    axios.get(url, {
      params: params,
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' })
      },
      headers: {
        'Authorization': store.state.user.tPassWord
      },
      responseType: 'blob'
    }).then(response => {
      console.log(response)
      this.download(response, filename)
    }).catch(error => {
      console.log(error)
    })
  }
}
