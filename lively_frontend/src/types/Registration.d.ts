interface IRegistration<T> {
  username: T;
  email: T;
  mobile: T;
  dob?: T;
  pincode: T;
  password: T;
  confirmPassword?: T;
}
