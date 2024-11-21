import axios, {AxiosRequestConfig} from 'axios';
import {logout, refreshToken} from '@/api/interface/auth';

export type Response<T> =
    | {
    data: T;
    success: true;
    errorCode?: string;
    errorMessage?: string;
}
    | {
    data?: T;
    success: false;
    errorCode: number;
    errorMessage: string;
};

type ExtractKeys<T extends string> =
    T extends `${string}{${infer Key}}${infer Rest}`
        ? Key | ExtractKeys<Rest>
        : never;

type PathVariables<T extends string> = ExtractKeys<T> extends never
    ? Record<string, string | number>
    : Record<ExtractKeys<T>, string | number>;

type RequestConfig<
    D extends object,
    Q extends object,
    U extends string,
    P = PathVariables<U>
> = Omit<AxiosRequestConfig<D>, "url" | "params"> & {
    /**
     * @example '/api/:id' => pathVariables: { id: "1" }
     * @example '/api/:id/:name' => pathVariables: { id: "1", name: "2" }
     */
    url: U;
    ignoreAuth?: boolean; //不為true時 header需附帶Authentication value為token
    silentError?: boolean;
    throwError?: boolean;
    params?: Q;
    /**
     * @example '/api/:id' => { id: "1" }
     * @example '/api/:id/:name' => { id: "1", name: "2" }
     */
    pathVariables?: P;
};

export interface Request {
    <
        T,
        D extends object = any,
        Q extends object = any,
        U extends string = string,
        P = PathVariables<U>
    >(
        args: RequestConfig<D, Q, U, P>
    ): Promise<Response<T>>;
}

const request: Request = async <
    T = any,
    D extends object = any,
    Q extends object = any,
    U extends string = string,
    P = PathVariables<U>
>(
    args: RequestConfig<D, Q, U, P>
) => {
    const axiosInstance = axios.create({
        ...args
    });

    axiosInstance.interceptors.request.use(
        function (config) {
            const {ignoreAuth} = config.params;
            if (!ignoreAuth) {
                const token = localStorage.getItem('access')

                if (!token) {
                    // 没有token可能是用户删除了什么东西，这里需要返回到登陆页面
                    window.location.href = '/login';
                }
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        function (e) {
            // error toast 根据不同ui组件做实现
            return Promise.reject(e);
        }
    )

    axiosInstance.interceptors.response.use(
        async function (res) {
            const {code, data, message, silentError, throwError} = res.data;

            // code200 直接返回登陆 种cookie一般是服务端种 如果非要前端种 是在auth分别去配置吧 这里做判断逻辑太臃肿
            if (code === 200) {
                return data;
            }

            // 401一般登陆超时 可以跳转到登陆页 也可以尝试刷新refreshToken
            if (code === 401) {
                try {
                    // 一般请求里会携带cookie 下面是如果写在了localStore里的情况
                    const refreshTokenK = localStorage.getItem('refreshToken');

                    if (!refreshTokenK) {
                        return Promise.reject('no refreshTokenK');
                    }

                    const result = await refreshToken({
                        refreshToken: ''
                    });

                    const {access, accessExpiredAt, refreshExpiredAt, refresh} = result.data;
                    localStorage.setItem(access, access);
                    localStorage.setItem(refresh, refresh);
                }
                catch (e) {
                    await logout();
                    // 跳转登陆页
                    window.location.href = '/login';
                    return ;
                }
            }

            if (silentError) {
                return Promise.reject(message);
            }

            else if (throwError) {
                return Promise.reject(message);
            }

            else {
                return Promise.reject(data);
            }
        },
        function (error) {
            // error toast 根据不同ui组件做实现
        }
    );

    return request as T;
};

export default request;
