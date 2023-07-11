import Cookies from 'js-cookie';

function getCookie(cookieName: string): string {
  return Cookies.get(cookieName);
}

function setCookie(cookieName: string, value: string, options?: object): void {
  Cookies.set(cookieName, value, options);
}

function removeCookie(cookieName: string): void {
  Cookies.remove(cookieName);
}

export { getCookie, setCookie, removeCookie }

