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

interface IOptionalUser extends Partial<IUser> {}
