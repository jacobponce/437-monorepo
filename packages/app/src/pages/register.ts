import { define, Auth } from "@calpoly/mustang";
import { AppHeaderElement } from "../components/app-header";
import { LoginFormElement } from "../auth/login-form";

define({
  "mu-auth": Auth.Provider,
  "app-header": AppHeaderElement,
  "login-form": LoginFormElement
});
