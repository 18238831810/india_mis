export default {
    /*手机验证码*/
    validlog: {
        codeStatus: {2: "已失效", 0: "未使用", 1: "已使用", 3: "发送失败", 4: "接收失败"},
        smsTunnel: {0: "人工", 4: "金道", 5: "麦讯通", 6: "至臻"}
    },
    /*组装树形数据*/
    buildTreeArr(arr,id,parentid,children){
        const arrData = JSON.parse(JSON.stringify(arr))
        const newArr = [];
        for(let i = 0; i < arrData.length; i++){
            if (arrData[i][parentid] == 9999) {
                newArr.push(this.findChildren(arrData[i],arrData,id,parentid,children));
            }
        }
        return newArr;
    },
    findChildren(obj,arr,id,parentid,children){
        for(let i = 0; i < arr.length; i++){
            if (obj[id] == arr[i][parentid]) {
                if (obj[children] == null){
                    obj[children] = [];
                }
                obj[children].push(this.findChildren(arr[i],arr,id,parentid,children));
            }
        }
        return obj;
    }

}
