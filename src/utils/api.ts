import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { type ChatDetails, type ChatSession, type ReligiousBot, type User } from '../interfaces';

const BASE_URL = 'https://backend-api.techkarmic.com';

export const getAccessToken = () => Cookies.get('session_token');
export const getRefreshToken = () => Cookies.get('refresh_token');
export const isAuthenticated = () => !!getAccessToken();
export const setAccessToken = (token: string) =>
    Cookies.set('session_token', token, { expires: 1 });
export const setRefreshToken = (token: string) =>
    Cookies.set('refresh_token', token, { expires: 1 });

const getAuthenticatedAxiosInstance = (): AxiosInstance => {
    const accessToken = getAccessToken();
    return axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    try {
        const response = await axios.post(`${BASE_URL}/auth/refresh_token`, { refresh_token: refreshToken });
        setAccessToken(response.data.data.sessionToken);
        setRefreshToken(response.data.data.refreshToken);
    } catch (error) {
        throw new Error('Session refresh failed');
    }
}

export const getUserDetails = async (suppressReloadOnAuthFail: boolean = false) => {
    try {
        const response = await handleRequest<{ data: User }>(
            () => getAuthenticatedAxiosInstance().get('/auth/me'),
            { suppressReloadOnAuthFail }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        throw error;
    }
};

// Function to handle user logout
export const logout = async () => {
    try {
        const axiosInstance = getAuthenticatedAxiosInstance();
        await axiosInstance.post(`${BASE_URL}/auth/logout`);
        Cookies.remove('session_token');
        Cookies.remove('refresh_token');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

async function handleRequest<T>(
    requestFunc: () => Promise<AxiosResponse<T>>,
    options?: { suppressReloadOnAuthFail?: boolean }
): Promise<T> {
    try {
        const response = await requestFunc();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
                await refreshAccessToken();
                const response = await requestFunc();
                return response.data;
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                if (!options?.suppressReloadOnAuthFail) {
                    logout();
                window.location.reload();
                }
                throw refreshError;
            }
        } else {
            throw error;
        }
    }
}

export const loginWithGoogle = (data: {}) => {
    return handleRequest(() => axios.post(`${BASE_URL}/auth/google_login`, data));
};

export const getPastChats = async (offset: number, limit: number) => {
    const data = await handleRequest<{ data: { records: ChatDetails[], total: number } }>(() =>
        getAuthenticatedAxiosInstance().get('/chat', { params: { offset, limit } })
    );
    return {
        data: data.data.records,
        total: data.data.total
    };
};

export const createRazorPayOrder = (body: { amount: number }) => {
    return handleRequest(() =>
        getAuthenticatedAxiosInstance().post('/user/create_razorpay_order', body)
    );
};

export const getRazorPayOrder = (body: { order_id: number }) => {
    return handleRequest(() =>
        getAuthenticatedAxiosInstance().get('/user/get_razorpay_order', {
          params: {
            order_id: body.order_id
          }
        }));
};

export const getChat = (chatId: string) => {
    return handleRequest(() => getAuthenticatedAxiosInstance().get(`/chat/${chatId}`));
};

export const sendMessage = (message: string, chatUUID?: string, chatbot_id?: string) => {
    return handleRequest<{ message: string, data: ChatSession }>(() =>
        getAuthenticatedAxiosInstance().post(`/chat/message`, { chat_id: chatUUID, message, chatbot_id })
    );
};

export const getAvailableBots = async () => {
    return handleRequest<{ records: ReligiousBot[], total: number }>(() =>
        getAuthenticatedAxiosInstance().get('/chatbots')
    );
}


export const updateProfile = (body: Partial<User>) => {
    return handleRequest(() =>
        getAuthenticatedAxiosInstance().put('/user/profile', body)
    );
};
