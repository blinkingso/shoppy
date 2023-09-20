import axios from '@/axios'
import qs from 'qs'

export function login(username, password) {
    return axios({
        url: '/admin/login',
        data: qs.stringify({
            username: username,
            password: password
        }),
        method: 'post',
        responseType: 'json'
    })
}

export function getInfo() {
    return axios({
        url: '/admin/getinfo',
        method: 'post',
        responseType: 'json'
    })
}

export function updatePassword(oldpassword, password, repassword) {
    return axios({
        url: '/admin/updatepassword',
        data: qs.stringify({
            oldpassword, password, repassword
        }),
        method: 'post',
        responseType: 'json'
    })
}

export function statistics1() {
    return axios({
        url: '/admin/statistics1',
        method: 'get',
        responseType: 'json'
    })
}

export function statistics2() {
    return axios({
        url: '/admin/statistics2',
        method: 'get',
        responseType: 'json'
    })
}

export function statistics3(type) {
    return axios({
        url: '/admin/statistics3',
        method: 'get',
        params: {
            type
        },
        responseType: 'json'
    })
}

export function category() {
    return axios({
        url: '/admin/category',
        method: 'get',
        responseType: 'json'
    })
}

function isNotEmpty(s) {
    return s && s.length != 0 && s.trim().length != 0
}

export function queryGoods(obj) {
    let params = {
        tab: 'all',
        limit: 5,
        page: 1
    }
    for (let key in obj) {
        params[key] = obj[key]
    }

    return axios({
        url: `/admin/goods/${params.page}`,
        method: 'get',
        params,
        responseType: 'json'
    })
}

export function updateGoods(goods) {
    if (goods) {
        return axios({
            url: `/admin/goods/${goods.id}`,
            method: 'post',
            data: goods,
            responseType: 'json',

        })
    }
}