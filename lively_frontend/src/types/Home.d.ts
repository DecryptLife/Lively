interface IUserState {
  userDetails: IUser | null;
  followersDetails: Array<IFollower>;
  articles: Array<IDisplayArticle>;
}
