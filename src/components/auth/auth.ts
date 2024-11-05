import Cookies from "js-cookie";

  export function checkAuthLoader() {
    const isLoggedIn = Boolean(Cookies.get("token"));
    if (!isLoggedIn) {
      throw new Response("", { status: 302, headers: { Location: "/login" } });
    }
    return null;
  }

export function redirectIfLoggedIn() {
    const isLoggedIn = Boolean(Cookies.get("token"));
    if (isLoggedIn) {
      throw new Response("", { status: 302, headers: { Location: "/reservant" } });
    }
    return null;
  }