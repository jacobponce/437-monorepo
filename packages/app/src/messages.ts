import { Credential } from "server/models";

export type Msg =
  | ["credential/request", { username: string }]
  | [
      "credential/save",
      {
        username: string;
        credential: Credential;
      },
      {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | Cmd;

type Cmd =
  | ["credential/load", { username: string; credential: Credential }];
