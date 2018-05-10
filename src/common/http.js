import storage from './storage';

let HTTPUtil = {};
const HOST = "http://ss.smovie168.com/api";
const DeviceInfo = require('react-native-device-info');
//const HOST = "http://192.168.10.54/api";
/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params
 * @returns {Promise}
 */
HTTPUtil.get = function (url, params) {
    url = HOST + url;
    if (params) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    headers = null;
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {

                reject({ status: -1 });
            })
    })
};
/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param params
 * @returns {Promise}
 */
HTTPUtil.post = function (url, params) {
    url = HOST + url;
    let formData = new FormData();
    for (key in params) {
        formData.append(key, params[key])
    }
    formData.append('unique_id', DeviceInfo.getUniqueID());
    formData.append('model', DeviceInfo.getModel());
    return new Promise(function (resolve, reject) {
        storage.asyncGet("TOKEN", res => {
            let headers = {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + res
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            }).then((response) => {
                return response.json();
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject({ status: -1 });
            })
        }, err => {
            let headers = {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            }).then((response) => {
                return response.json();
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject({ status: -1 });
            })
        })
    })
};

HTTPUtil.uploadImg = function (url, params, path) {
    url = HOST + url;
    let formData = new FormData();
    for (key in params) {
        formData.append(key, params[key])
    }
    let file = { uri: path, type: 'application/octet-stream', name: 'image.jpg' };
    formData.append("image", file);
    formData.append('unique_id', DeviceInfo.getUniqueID());
    formData.append('model', DeviceInfo.getModel());
    console.log(formData)
    return new Promise(function (resolve, reject) {
        storage.asyncGet("TOKEN", res => {
            let headers = {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'Authorization': 'Bearer ' + res
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            }).then((response) => {
                return response.json();
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject({ status: -1,error:err });
            })
        }, err => {
            let headers = {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            }).then((response) => {
                return response.json();
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject({ status: -1 });
            })
        })
    })
}

export default HTTPUtil;