interface IImage {}

interface IComment {
  comment: string;
  author: string;
  author_image: string;
}

interface IArticle {
  _id: string;
  text: string;
  authorID: string;
  image: {
    secure_url?: "";
  };
  date: string;
  commentsID: Array<IComment>;
  commentsDisplayed?: boolean;
  __v?: string | number;
}

interface INewArticle {
  text: string;
  post_image: string;
}
interface IDisplayArticle extends Partial<IArticle> {
  author?: string;
  avatar?: string;
}
// interface IUpdateArticle extends Partial<IArticle> {}
