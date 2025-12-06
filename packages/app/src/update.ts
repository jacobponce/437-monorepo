import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Credential } from "server/models";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [command, payload, callbacks] = message;
  switch (command) {
    case "credential/request": {
      const { username } = payload;
      if (model.credential?.username === username) return model;
      return [
        { ...model, credential: { username, hashedPassword: "" } as Credential },
        requestCredential(payload, user)
          .then((credential) => ["credential/load", { username, credential }])
      ];
    }
    case "credential/load": {
      const { credential } = payload;
      return { ...model, credential };
    }
    case "credential/save": {
      const { username } = payload;
      return [
        model,
        saveCredential(payload, user, callbacks || {})
          .then((credential) => ["credential/load", { username, credential }])
      ];
    }
    default: {
      const unhandled: never = command;
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

function saveCredential(
  msg: {
    username: string;
    credential: Credential;
  },
  user: Auth.User,
  callbacks: {
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
  }
): Promise<Credential> {
  return fetch(`/api/credentials/${msg.username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.credential)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Failed to save credential for ${msg.username}`);
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as Credential;
      }
      throw new Error(`No JSON in API response`);
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}
