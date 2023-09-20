import axios from "axios"
import { getToken } from './composables/auth'
import { toast } from "./composables/util"


const service = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

service.interceptors.request.use(req => {
    const token = getToken()
    if (token) {
        req.headers['token'] = token
    }
    return req
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use(res => {
    return res.data.data
}, error => {
    toast(error.response.data.msg || "请求失败", "error")
    return Promise.reject(error)
})

export default service