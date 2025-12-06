import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Credential } from "server/models";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  switch (message[0]) {
    case "credential/request": {
      const { username } = message[1];
      if (model.credential?.username === username) return model;
      return [
        { ...model, credential: { username, hashedPassword: "" } as Credential },
        requestCredential(message[1], user)
          .then((credential) => ["credential/load", { username, credential }])
      ];
    }
    case "credential/load": {
      const { credential } = message[1];
      return { ...model, credential };
    }
    default: {
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

function requestCredential(
  payload: { username: string },
  user: Auth.User
) {
  return fetch(`/api/credentials/${payload.username}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No Response from server";
    })
    .then((json: unknown) => {
      if (json) return json as Credential;
      throw "No JSON in response from server";
    });
}
