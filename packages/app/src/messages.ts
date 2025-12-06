import { Credential } from "server/models";

export type Msg =
  | ["credential/request", { username: string }]
  | Cmd;

type Cmd =
  | ["credential/load", { username: string; credential: Credential }];
