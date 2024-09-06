interface IUser {
  _id: string;
  username: string;
  email: string;
  headline: string;
  dob: string;
  mobile: string;
  zipcode: string;
  avatar: string;
  following: Array<string>;
}

interface IOptionalUser extends Omit<Partial<IUser>, "avatar"> {
  avatar?: string | ArrayBuffer | null;
}
