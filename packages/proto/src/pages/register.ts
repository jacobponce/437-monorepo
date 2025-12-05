import { define, Auth } from "@calpoly/mustang";
import { LoginFormElement } from "../auth/login-form";
import "../components";

define({
  "mu-auth": Auth.Provider,
  "login-form": LoginFormElement
});
