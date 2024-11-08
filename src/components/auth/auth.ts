import Cookies from "js-cookie";
import { UserInfo } from "../../services/types";

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

  export function checkIfOwner() {
    const isOwner = Boolean((JSON.parse(Cookies.get("userInfo") as string)).roles.includes("Restaurant Owner"))
    if (isOwner) {
      throw new Response("", { status: 302, headers: { Location: "/reservant" } });
    }
    return null;
  } 