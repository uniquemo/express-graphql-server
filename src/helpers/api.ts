import { isLocalhost } from 'helpers/env';

export const BASE_URL = isLocalhost ? 'http://localhost:3000' : 'http://www.uniquemo.cn/api';

export const prefixApiUrl = (url: string) => `${BASE_URL}${url}`;
