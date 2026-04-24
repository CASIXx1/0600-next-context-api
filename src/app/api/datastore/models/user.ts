import DateDecorator from "./date";

type UserStatus = "active" | "deactive";

export interface UserDateProps {
  createdAt: DateDecorator;
  updatedAt: DateDecorator;
}

export interface UserParams {
  uuid: string;
  title: string;
  email: string;
  username: string;
  status: UserStatus;

  createdAt: string;
  updatedAt: string;
}

export class UserModel {
  readonly id: string;
  readonly _raw: UserParams;

  constructor(params: UserParams) {
    this.id = params.uuid || crypto.randomUUID();
    this._raw = params;
  }

  get raw() {
    return this._raw;
  }
}

export type User = UserParams & UserModel & UserDateProps;
