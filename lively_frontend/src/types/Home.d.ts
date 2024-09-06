interface IUserState {
  userDetails: IUser | null;
  followersDetails: Array<IFollower> | null | undefined;
  articles: Array<IArticle>;
}
