import Cookies from 'js-cookie';

export const useCookie = () => {
  const setCookie = (key: string, value: string) => {
    Cookies.set(key, value, { expires: 7, secure: true, sameSite: 'strict' });
  };

  const getCookie = <T,>(key: string): T => {
    return Cookies.get(key) as unknown as T;
  };

  const removeCookie = (key: string) => {
    Cookies.remove(key);
  };

  return { setCookie, getCookie, removeCookie };
};
