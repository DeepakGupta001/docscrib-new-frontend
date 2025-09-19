"use client";
import Cookies from "js-cookie";

export function getPreloadedAuthState() {
  if (typeof window === "undefined") return undefined; // SSR safe

  const userCookie = Cookies.get("__Dcocscrib_user");
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      return {
        auth: {
          user: parsed.user || {},
          token: parsed.token || null
        }
      };
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}
