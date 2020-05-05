import axios from 'axios'
import qs from 'qs'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    config.data = qs.stringify(config.data)
    return instance(config)
}