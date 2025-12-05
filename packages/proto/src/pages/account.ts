import { define, Auth } from "@calpoly/mustang";
import "../components";

define({
  "mu-auth": Auth.Provider
});

function getUserInfo() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (e) {
      console.error("Failed to decode token:", e);
      return null;
    }
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const userInfo = getUserInfo();

  if (userInfo) {
    const usernameEl = document.getElementById("username");
    if (usernameEl) {
      usernameEl.textContent = userInfo.username;
    }

    const memberSinceEl = document.getElementById("member-since");
    if (memberSinceEl && userInfo.iat) {
      const date = new Date(userInfo.iat * 1000);
      memberSinceEl.textContent = date.toLocaleDateString();
    }
  }

  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", () => {
      localStorage.clear();

      const event = new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout"]
      });
      document.dispatchEvent(event);

      window.location.href = "/index.html";
    });
  }
});
