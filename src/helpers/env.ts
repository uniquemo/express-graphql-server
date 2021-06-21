export const isLocalhost = process.env.LOCAL === 'true';

export const getEnv = () => (isLocalhost ? 'development' : 'production');
