import { ElNotification } from "element-plus"

export function toast(message, type = "success") {
    return ElNotification({
        message,
        type,
        dangerouslyUseHTMLString: true,
        duration: 3000
    })
}

export function strToUpCam(str) {
    const arr = str.split('/')
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1, arr[i].length - 1)
    }
    return arr.join('')
}