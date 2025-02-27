import axios from "axios";
import { config } from "process";

const NO_RETRY_HEADER = 'x-no-retry'

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});


const handleRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh');
    if (res && res.data) return res.data.access_token;
    else null
}

instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("access_token");
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
        return response.data
    }
    return response.data.data
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error && error.response && error.response.data && +error.response.status === 401 && !error.config.headers[NO_RETRY_HEADER]) {


        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`
            localStorage.setItem('access_token', access_token)
            return instance.request(error.config);
        }

    }

    if (error && error.response && error.response.data && +error.response.status === 400 && error.config.url === '/api/v1/auth/refresh') {
        window.location.href = '/login'
    }

    return Promise.reject(error);
});

export default instance

