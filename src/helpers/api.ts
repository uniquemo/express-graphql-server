import { isLocalhost } from 'helpers/env';

export const prefixApiUrl = (url: string) =>
  isLocalhost ? `http://localhost:3000${url}` : `http://www.uniquemo.cn/api${url}`;
