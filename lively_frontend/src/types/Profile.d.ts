interface IFollower {
  username: string;
  avatar: string;
  _id?: string;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  headline: string;
  dob: string;
  mobile: string;
  zipcode: string;
  avatar: string;
  following?: IFollower[];
}

interface IOptionalUser extends Omit<Partial<IUser>, "following"> {}
