export const isDevMode = () => process.env.NODE_ENV === 'development';

export const getIdOrDefault = (id: any) => !!id ? id : Buffer.alloc(12).toString();
