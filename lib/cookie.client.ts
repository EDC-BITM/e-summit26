"use client";

export function setClientCookie(key: string, value: string) {
  document.cookie = `${key}=${value}; path=/; max-age=31536000`; // 1 year
}

export function getClientCookie(key: string): string | null {
  const name = key + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
